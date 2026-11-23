# مركز الرضوان لصيانة السيارات الحديثة — Landing page

One-page Arabic (RTL) landing page for El Radwan modern car service center, El-Lebeny, Haram, Giza.

**Stack:** Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · shadcn/ui · lucide-react

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
cp .env.example .env   # sets VITE_API_URL (the backend)
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Deploy

`npm run build` produces a static single-page app in `dist/`. Every route (`/admin/...`) must fall back to `index.html`:

- **Vercel:** import the repo. `vercel.json` already has the fallback rewrite. Set `VITE_API_URL=https://radwan-auto-car-backend.vercel.app` in the project settings (it is read at build time, including by the prerender).
- **Netlify / Cloudflare Pages:** add a `public/_redirects` file containing `/* /spa.html 200`.

After you have a domain, set `og:url` in `index.html` to its full URL. The title, description, share image and Google business data (JSON-LD) are filled in from the API at build time (`scripts/prerender.js`); the share image must be a full URL (set it in the admin under جوجل والمشاركة).

## How the landing page loads (performance)

`npm run build` also prerenders `/` (`src/entry-server.tsx` + `scripts/prerender.js`):

- `dist/index.html` contains the landing page as real HTML plus its content (from the API at `VITE_API_URL`), so it paints without waiting for JavaScript or the API.
- The app script starts after the first paint, hydrates the page and refetches the content, so admin edits show up without a rebuild.
- `dist/spa.html` is the plain app shell; `vercel.json` serves it for `/admin` and every other route.
- Fonts are self-hosted (`@fontsource-variable/cairo`), images are WebP.

If the content can't be loaded at build time, the build still succeeds and `index.html` stays a plain single-page app.

## Admin portal (`/admin`)

The owner edits the page at `/admin` (Arabic, works on phones). Everything on the landing page except the layout, colors and nav links comes from the API.

| Page                   | Edits                                                                         |
| ---------------------- | ----------------------------------------------------------------------------- |
| بيانات التواصل         | name, area, address, phone, WhatsApp, email, map link, Facebook links, rating |
| المواعيد               | opening hours                                                                 |
| الواجهة                | hero description and photo (the photo saves as soon as it is picked)          |
| شريط الإعلان           | temporary banner above the page (on/off, color, end date)                     |
| الخدمات / آراء العملاء | add, edit, delete, reorder, show/hide                                         |
| آراء جديدة             | reviews visitors sent from the page: accept, reject, block the sender         |
| صور الورشة             | gallery photos: add, edit caption, delete, reorder, show/hide                 |
| جوجل والمشاركة         | page title, description, share image                                          |
| الحساب                 | change password                                                               |

### API contract

The backend's contract is the source of truth: [Swagger UI](https://radwan-auto-car-backend.vercel.app/docs) / [openapi.json](https://radwan-auto-car-backend.vercel.app/openapi.json). A copy is kept in `docs/openapi.yaml`.

All responses are `{ "data": ... }`; errors are `{ "message": "..." }` (Arabic, shown as-is). Content GETs and `POST /review-submissions` are public; everything else sends `Authorization: Bearer <token>`. A 401 logs the admin out. Images are uploaded on what they belong to (`PUT /hero/image`, `PUT /seo/image`, `POST /gallery`). Each resource has a file in `src/services/`.

Shapes and validation rules are in `src/schemas/content.ts`.

## Where to change things

| What                                                     | File                                         |
| -------------------------------------------------------- | -------------------------------------------- |
| Content (contact, hours, services, reviews, photos, SEO) | the admin portal                             |
| Nav links, logo                                          | `src/config/site.ts`, `src/assets/logo.webp` |
| Colors, radius, font                                     | `src/index.css` (shadcn CSS variables)       |
| Default page title, Google business data                 | `index.html`                                 |

## Structure

```
src/
  main.tsx, router.tsx          providers + routes ("/" and lazy-loaded "/admin/*")
  pages/landing-page.tsx        loads all content, then renders the sections
  services/                     axios + React Query, one file per API resource
  schemas/content.ts            zod schemas = API types + form validation
  lib/
    api.ts                      axios instance (base URL, auth header, 401 handling)
    query-client.ts             React Query defaults, error toasts
  admin/
    layout/                     auth guard, sidebar
    pages/                      one page per section
    components/                 form fields, save bar, image upload, list rows...
  components/
    ui/                         shadcn/ui
    sections/, layout/, shared/ landing page
public/                         favicons, og-image.jpg, robots.txt
```

## Scripts

```bash
npm run lint          # ESLint (typescript-eslint, react-hooks, react-refresh)
npm run format        # Prettier + Tailwind class sorting
npm run format:check
npm run typecheck
```

## Adding shadcn components

`components.json` is set up, so the shadcn CLI works as usual:

```bash
npx shadcn@latest add accordion
```

The CLI writes shadcn default sizes; `button.tsx` and `badge.tsx` are customised (taller buttons, semibold text) to match this design, so re-adding them with `--overwrite` will change the look. If the CLI writes `import { cn } from "cn"`, change it to `@/lib/utils`.

## Credits

- Font: Cairo (self-hosted via Fontsource).
