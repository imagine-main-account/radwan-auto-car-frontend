/**
 * Runs after `vite build` + the SSR build of src/entry-server.tsx.
 *
 * - dist/spa.html  = the untouched app shell (served for /admin and any other route).
 * - dist/index.html = the landing page rendered to HTML with its content embedded,
 *   so it paints without waiting for JavaScript or the API.
 *
 * Content comes from the API at VITE_API_URL.
 * If it can't be loaded, index.html is left as a plain single-page app.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { loadEnv } from "vite";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const apiUrl = loadEnv("production", root, "VITE_").VITE_API_URL?.replace(/\/+$/, "");

const escapeHtml = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** JSON that is safe inside a <script> tag. */
const serialize = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

async function load(resource) {
  if (!apiUrl) throw new Error("VITE_API_URL is not set");
  const res = await fetch(`${apiUrl}/${resource}`);
  if (!res.ok) throw new Error(`GET ${apiUrl}/${resource} -> ${res.status}`);
  return (await res.json()).data;
}

/** Inlined into the page (serialized with toString), so it must be self-contained. */
function startAfterPaint(src) {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    setTimeout(() => import(src));
  };
  const Observer = globalThis.PerformanceObserver;
  if (Observer?.supportedEntryTypes?.includes("largest-contentful-paint")) {
    new Observer(start).observe({ type: "largest-contentful-paint", buffered: true });
  }
  globalThis.addEventListener("load", () => setTimeout(start, 3000), { once: true });
}

/** Local business data for Google Search / Maps, from the admin's contact info. */
function businessJsonLd({ "site-info": info, seo }) {
  // Coordinates from a Google Maps link like ".../search/?api=1&query=29.978969,31.156391", when present.
  const coords = info.mapUrl.match(/(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/);
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: info.name,
    image: seo.image,
    telephone: `+2${info.phone}`,
    email: info.email,
    address: { "@type": "PostalAddress", streetAddress: info.address, addressCountry: "EG" },
    ...(coords && { geo: { "@type": "GeoCoordinates", latitude: Number(coords[1]), longitude: Number(coords[2]) } }),
    hasMap: info.mapUrl,
    sameAs: [info.facebook.page],
  };
}

function setMeta(html, attribute, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`);
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
await fs.writeFile(path.join(dist, "spa.html"), template);

try {
  const { render, resources } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
  const content = Object.fromEntries(await Promise.all(resources.map(async (r) => [r, await load(r)])));
  const { html, state } = await render("/", content);
  const { seo } = content;

  const assets = await fs.readdir(path.join(dist, "assets"));
  const arabicFont = assets.find((file) => /^cairo-arabic-wght-normal-.+\.woff2$/.test(file));
  const fontPreload = arabicFont
    ? `<link rel="preload" href="/assets/${arabicFont}" as="font" type="font/woff2" crossorigin />\n  `
    : "";

  // The prerendered page works without JavaScript (every action is a plain link), so the app script
  // loads after the page has painted instead of competing with the hero image, CSS and font.
  const entry = template.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
  if (!entry) throw new Error("app entry <script> not found in index.html");
  // Start the app once the page has painted its main content (or after `load` where that can't be observed).
  const deferredEntry = `<script type="module">${startAfterPaint.toString()};startAfterPaint(${JSON.stringify(entry[1])});</script>`;

  let page = template
    .replace(entry[0], "")
    .replace(/\s*<link rel="modulepreload"[^>]*>/g, "")
    .replace("</body>", `  ${deferredEntry}\n  </body>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(
      "</head>",
      `  <script type="application/ld+json">${serialize(businessJsonLd(content))}</script>\n  ${fontPreload}</head>`,
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>\n    <script>window.__QUERY_STATE__=${serialize(state)}</script>`,
    );
  page = setMeta(page, "name", "description", seo.description);
  page = setMeta(page, "property", "og:title", seo.title);
  page = setMeta(page, "property", "og:description", seo.description);
  page = setMeta(page, "property", "og:image", seo.image);

  await fs.writeFile(path.join(dist, "index.html"), page);
  console.log(`[prerender] / rendered from ${apiUrl} (${(page.length / 1024).toFixed(1)} KB)`);
} catch (error) {
  console.warn(`[prerender] skipped, index.html stays a plain SPA: ${error.message}`);
} finally {
  await fs.rm(ssrDir, { recursive: true, force: true });
}
