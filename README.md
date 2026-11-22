# مركز الرضوان لصيانة السيارات الحديثة — Landing page

One-page Arabic (RTL) landing page for El Radwan modern car service center, El-Lebeny, Haram, Giza.

**Stack:** Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · shadcn/ui · lucide-react

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Deploy

`npm run build` produces a static single-page app in `dist/`. Every route (`/admin/...`) must fall back to `index.html`:

- **Vercel:** import the repo. `vercel.json` already has the fallback rewrite. Set `VITE_API_URL` in the project settings when the backend is ready.
- **Netlify / Cloudflare Pages:** add a `public/_redirects` file containing `/* /spa.html 200`.

After you have a domain, open `index.html` and change `og:image`, `og:url` and the JSON-LD `image` to full URLs (e.g. `https://your-domain.com/og-image.jpg`) so WhatsApp and Facebook show the preview card.

## How the landing page loads (performance)

`npm run build` also prerenders `/` (`src/entry-server.tsx` + `scripts/prerender.js`):

- `dist/index.html` contains the landing page as real HTML plus its content (from `VITE_API_URL`, or the mock files), so it paints without waiting for JavaScript or the API.
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
| الواجهة                | hero description and photo                                                    |
| شريط الإعلان           | temporary banner above the page (on/off, color, end date)                     |
| الخدمات / آراء العملاء | add, edit, delete, reorder, show/hide                                         |
| صور الورشة             | the 4 gallery photos and captions                                             |
| جوجل والمشاركة         | page title, description, share image                                          |
| الحساب                 | change password                                                               |

### Mock API

With no `VITE_API_URL` set, a mock backend answers every request: GETs read `public/mock-api/*.json`, and edits are saved in `localStorage` (this browser only). Log in with **admin@radwan.com / admin123**. Settings → "رجّع البيانات التجريبية" resets it.

To use the real backend, copy `.env.example` to `.env` and set `VITE_API_URL`. Nothing else changes.

### API contract

All responses are `{ "data": ... }`; errors are `{ "message": "..." }` with a 4xx/5xx status. Writes send `Authorization: Bearer <token>`. A 401 logs the admin out.

| Method       | Path                                               | Body                               | Returns             |
| ------------ | -------------------------------------------------- | ---------------------------------- | ------------------- |
| POST         | `/auth/login`                                      | `{ email, password }`              | `{ token, user }`   |
| GET          | `/auth/me`                                         |                                    | `user`              |
| POST         | `/auth/logout`                                     |                                    |                     |
| PUT          | `/auth/password`                                   | `{ currentPassword, newPassword }` |                     |
| GET / PUT    | `/site-info`, `/hours`, `/hero`, `/banner`, `/seo` | the whole object                   | the saved object    |
| GET / POST   | `/services`, `/reviews`                            | item without `id`                  | list / created item |
| PUT / DELETE | `/services/:id`, `/reviews/:id`                    | partial item                       | saved item          |
| PUT          | `/services/reorder`, `/reviews/reorder`            | `{ ids: string[] }`                | the reordered list  |
| GET / PUT    | `/gallery`                                         | all 4 photos                       | the saved list      |
| POST         | `/uploads`                                         | multipart `file`                   | `{ url }`           |

Shapes and validation rules are in `src/schemas/content.ts`; the seed files in `public/mock-api/` are example payloads.

## Where to change things

| What                                                     | File                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Content (contact, hours, services, reviews, photos, SEO) | the admin portal, or `public/mock-api/*.json` in mock mode |
| Nav links, logo                                          | `src/config/site.ts`, `src/assets/logo.webp`               |
| Colors, radius, font                                     | `src/index.css` (shadcn CSS variables)                     |
| Default page title, Google business data                 | `index.html`                                               |

## Structure

```
src/
  main.tsx, router.tsx          providers + routes ("/" and lazy-loaded "/admin/*")
  pages/landing-page.tsx        loads all content, then renders the sections
  services/                     axios + React Query, one file per API resource
  schemas/content.ts            zod schemas = API types + form validation
  lib/
    api.ts                      axios instance (auth header, 401 handling, mock switch)
    mock-api.ts                 mock backend
    query-client.ts             React Query defaults, error toasts
  admin/
    layout/                     auth guard, sidebar
    pages/                      one page per section
    components/                 form fields, save bar, image upload, list rows...
  components/
    ui/                         shadcn/ui
    sections/, layout/, shared/ landing page
public/
  mock-api/                     mock API seed data
  images/                       hero + gallery photos
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

- Workshop photos: El Radwan's Facebook page.
- Hero photo: Unsplash (free licence).
- Font: Cairo (self-hosted via Fontsource).
