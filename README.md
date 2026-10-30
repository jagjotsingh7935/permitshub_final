# Permits Hub frontend

Responsive website for Permits Hub, a Victorian town planning business. Built with React 19, TypeScript, Vite, React Router, Motion, Lenis and Three.js. All site content is managed in a Django REST Framework backend (`backend/`) with an admin portal at `/admin/`; the React app loads it from the API. The enquiry form sends enquiries to the backend, which stores them for the team and emails a confirmation from `permits@permitshub.com.au`. There is no analytics.

## Run locally

```bash
npm install
npm run dev       # development server
npm run lint      # ESLint
npm run build     # type-check (tsc -b) and production build into dist/
npm run preview   # serve the production build locally
```

The frontend needs the backend running to show any content (see "Backend, admin portal and deployment" below); `npm run dev` proxies `/api`, `/media` and `/admin` to Django on port 8000. Routes use browser history, so every page address must be served the app (the Docker setup does this through Django, which also adds the SEO tags).

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: 3D hero, services, enquiry types, common problems, planning journey, project updates, About preview, enquiry starter, FAQs |
| `/services` | Six services, a "which service fits?" finder, stage matrix, coordination roles, engagement formats, FAQs |
| `/projects` | Featured project, filterable index of public updates and demo projects |
| `/projects/:slug` | Project note (public update) or demo scenario |
| `/about` | Introduction, the animated company timeline, principles, regions, the client process |
| `/contact` | Contact options, enquiry form, preparation checklist, indicative region map, FAQs |
| anything else | Friendly 404 |

The Home enquiry starter carries the project type, location and stage into `/contact` as URL parameters (`/contact?projectType=…&location=…&stage=…`), and service pages add `service=…`.

## Folder structure

```
backend/                 Django REST Framework API, admin portal, SEO pages, seed data (see below)
docker-compose.yml, Dockerfile.web, Caddyfile, .env.example   Deployment (see below)
src/
  main.tsx, App.tsx      App shell. Home loads with the first bundle; other pages load on demand (React.lazy).
  api/client.ts          Fetches /api/site/ and posts enquiries to /api/enquiries/
  site/SiteProvider.tsx  Loads all content once and provides it to every component (useSite)
  content/index.ts       Shared types, navigation and small helpers. No site content lives here any more.
  pages/                 One file per route (Home, Services, Projects, ProjectDetail, About, FAQs, Contact, NotFound)
  components/
    layout/              Header (with mobile menu), Footer, Brand
    home/                ArchitecturalHero + architecturalScene.ts (Three.js), ProjectStarter, ServicesEditorial
    about/               CompanyTimeline.tsx (sticky timeline), SiteEvolution.tsx (seven-stage drawing)
    projects/            ProjectCard, ProjectMedia, ProjectShowcase, ProjectIllustration (demo drawings)
    ui/                  Accordion, Badges, Checklist, PlanningJourney, Reveal, Sections (PageHero, CTA)
  lib/
    scroll.ts            The single scroll controller (Lenis or native)
    usePageSetup.ts      Page titles/meta, scroll reset, hash targets, creates the one Lenis instance
    motion.ts, iso.ts, useActiveIndex.ts, useMediaQuery.ts, icons.ts
  styles/                CSS (styles, redesign, cinematic, sections, about, evolution)
public/images/           architectural-study.svg (hero fallback) and the favicon logo
draft-assets/            Unused drafts, not published
PERMITS_HUB_BOLT_PROMPT.md   Original design brief
```

Headings, intros, labels and button text are "Page text" in the admin; everything list-like or repeatable has its own admin page (see below).

## Managing content (admin portal)

Sign in at `/admin/`. The sidebar groups everything the site shows:

| Admin section | What it controls |
| --- | --- |
| Enquiries | Every enquiry from the contact form (status, notes, email delivery). A badge shows new ones. |
| Pages & search | **Page text** (about 300 headings, paragraphs and labels, grouped by page), **Images** (About photos), **Search & social (SEO)** (title, description and sharing image per page). |
| Services | The five services (all fields, tick lists, stages, related projects), project stages, the service finder, who contributes, ways to work together, consultation preparation. |
| Projects | Public updates and demo projects (facts, milestones, gallery, sources, cover image, home page position), and project categories with their typical considerations. |
| FAQs | Questions by page (FAQs, Home, Services, Contact) and FAQ categories. |
| Home page | Highlights strip, who we help, what people bring to us, common situations, coordination benefits, planning journey steps. |
| About page | Timeline chapters, timeline drawing captions, principles, regions. |
| Contact page | Useful to prepare, first-conversation checklist, what happens next, enquiry project types and stages. |
| Settings | Logo, contact details, disclaimer, SEO basics (website address, business location, service areas) and the enquiry email settings. |

Headings use `*word*` for the italic style and a new line for a line break. Uploaded images are stored as WebP (SVG is kept).

### Demo projects

The four fictional demo projects (clinic, warehouse, townhouses, community hall) are seeded as projects of type **Demo project** and are always labelled "Demo project" on the site. They are hidden from search engines and the sitemap. To remove them, delete them in **Projects** (or untick *Show on website*); the Projects page drops every demo mention automatically once none remain.

### Images

Project and About images live in the admin, not in `public/`. The seed images in `backend/seed_images/` are WebP versions of the Permits Hub Facebook graphics and the Pexels stock images the site already used. Replace any of them by editing the project or image in the admin; raster uploads are converted to WebP automatically.

## The 3D homepage hero

The Home hero is a live Three.js study of an original "community pavilion", labelled as illustrative architecture. On desktop, scrolling through the hero eases the camera through three chapters: possibility, planning and the next chapter. The chapter buttons scroll to the same positions, and the sequence reverses on the way back up. On phones, tablets and touch screens the hero is a normal-height section, and the chapter buttons switch chapters in place without a pinned scroll.

`architecturalScene.ts` is loaded on demand as its own chunk (about 530 kB minified, 134 kB gzipped). It caps pixel density, renders only when something changes, pauses when off-screen or when the tab is hidden, and disposes of everything on unmount. Reduced-motion visitors never download it and see `architectural-study.svg` instead, which also stands in if WebGL is unavailable or the context is lost. The pavilion is procedural. A photographic walkthrough like the reference reel would need a project-specific GLB/GLTF model or a rendered image sequence. The reference video is not published.

## About timeline

`CompanyTimeline.tsx` tells the company story in seven chapters (`chapters` in `src/content/about.ts`). Dated chapters ("milestone") use only verified sources. Undated chapters describe the approach and current work, and the last chapter invites an enquiry.

- **Desktop (at least 1024 px wide and 620 px tall):** the narrative is on the left, and a **sticky panel** on the right holds the evolving drawing, a caption, and seven chapter buttons. Nothing is pinned: the page scrolls normally and the panel sticks below the header. `useActiveIndex` marks the chapter whose top has passed 45% of the viewport, so the state reverses naturally when scrolling up. A progress rail fills as you read. The chapter buttons scroll to their chapter through the shared scroll controller.
- **Smaller or shorter screens:** a single column with the drawing shown inline inside each chapter. There is no sticky or pinned behaviour on phones.
- **Reduced motion:** chapter reveals, the panel tilt and drift, the drawing's camera moves and the line-drawing effects are switched off. The progress rail shows full, and every chapter is visible without scrolling.

`SiteEvolution.tsx` is the seven-stage isometric drawing: site, analysis, plan, structure, form, place and next site. Each chapter's `stage` picks a stage. Layers fade in and out with CSS (the `layers` table gives the first and last stage of each), and a camera transform frames each stage using the `cameras` array: `focus` is the point to centre (in viewBox units) and `scale` is the zoom. Stage 0 uses focus [400, 282] and stage 6 uses focus [478, 292] at 1.06. At 1440 × 900 and 1024 × 768 each stage's subject sits within about 20 px of the panel centre horizontally. At stages 0–2 the lot sits slightly high, leaving room for the street (and the sun arc). At stage 6 the whole site fills the panel edge to edge. The drawing is original and labelled "Not a Permits Hub project".

## Scrolling: one Lenis instance

There is exactly **one** smooth-scroll controller for the whole app, created in `usePageSetup.ts`:

- Lenis runs only for fine pointers (mouse or trackpad) when reduced motion is off. Touch devices and reduced-motion visitors use native scrolling. The choice updates live if either media query changes.
- All programmatic scrolling (page changes, hash links, timeline buttons, hero chapters) goes through `scrollToPosition` and `scrollToElement` in `src/lib/scroll.ts`, so Lenis and native scrolling never compete. Before scrolling, Lenis re-measures the page, because pages load lazily. Without that, deep links such as `/services#site-feasibility` stopped short on a fresh load.
- Route changes reset to the top. Links with a hash wait briefly for the lazy page to render, then scroll the target to 100 px below the top (clear of the sticky header).
- The mobile menu has `data-lenis-prevent`, and `html.lenis` turns off CSS smooth scrolling so the two never stack.

## Accessibility notes

- Skip link to `<main>`, semantic landmarks, one `h1` per page, headings in order, `lang="en-AU"`, and a unique title on every page and project.
- **Keyboard:** everything works by keyboard and has visible focus. The mobile menu closes with Escape and keeps focus on its toggle. The timeline and hero chapter controls are real buttons (`aria-current` / `aria-pressed`).
- **Form:** labelled fields with required/optional text. On submit, an error summary (`role="alert"`) receives focus and links to each field. Fields get `aria-invalid` and `aria-describedby`, and an error clears as soon as its field is edited. The confirmation panel receives focus after sending.
- **Accordions:** buttons with `aria-expanded` and `aria-controls`, and panels as labelled regions. Enter and Space work.
- **Project filters:** toggle buttons with `aria-pressed`, and the result count is announced (`aria-live="polite"`). An empty result offers "Clear filters".
- **Images and drawings:** content images have descriptive alt text that says whether they're renders or announcements. Decorative images use `alt=""`. SVG drawings are `role="img"` with a label saying they are conceptual. External links say "(opens in a new tab)" to screen readers.
- **Motion:** honours `prefers-reduced-motion` everywhere (no WebGL, no Lenis, no reveals or camera moves, and content is never hidden waiting for an animation).
- **Contrast:** an axe-core audit (WCAG 2.1 AA) of every page at 390 and 1440 px passes. A few muted greys were darkened slightly to reach 4.5:1. The only remaining flag is the very large decorative page number in the page hero (`aria-hidden`, exempt as pure decoration under WCAG 1.4.3).
- Touch targets for the menu, filters, timeline buttons and form controls are at least 44 px.

## Map

The Contact map is an indicative Victoria view, not an office location. The Google Maps embed needs no API key. If it can't load, a drawn fallback map shows the public regions, and the card always offers an "Open in Google Maps" link. A verified address, project pins or a styled map (which needs a Maps API key) can be added later.

## Backend, admin portal and deployment

`backend/` is a Django + Django REST Framework project. `GET /api/site/` returns everything the site renders; `POST /api/enquiries/` stores an enquiry, emails a confirmation to the visitor from `permits@permitshub.com.au` and an alert to the addresses set in Site settings (bot-protected with a honeypot and rate limit).

Local development:

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
set DJANGO_DEBUG=true                              # macOS/Linux: export DJANGO_DEBUG=true
python manage.py migrate
python manage.py seed_content
python manage.py createsuperuser
python manage.py runserver 8000
```

Then run `npm run dev` in the project root.

### Deploy on a Hostinger VPS (Docker)

Requires a Hostinger **VPS** (shared hosting cannot run Docker) with Docker and the Compose plugin, and the domain's `A` record pointing at the VPS IP.

```bash
git clone <this repository> && cd <repo>
cp .env.example .env      # fill in the secrets, domain and email password
docker compose up --build -d
```

Caddy serves the React build, proxies `/api` and `/admin` to Django and gets the HTTPS certificate automatically. If the server already has nginx (or another proxy) on ports 80/443, see "Behind an existing nginx" below instead. To update later: `git pull && docker compose up --build -d`. Data lives in the `pgdata` and `media` volumes. The enquiry email uses a Google app password for `permits@permitshub.com.au` (the domain's mail is on Google); add SPF and DKIM records so confirmations are not marked as spam. `vercel.json` is only needed if the frontend is hosted separately on Vercel; in that case set `VITE_API_URL` to the backend address and note that the server-rendered SEO tags only apply when pages are served through the Docker setup.

### Behind an existing nginx

When a proxy on the host already owns ports 80/443, add this line to `.env` (on Linux; separate files with `:`):

```
COMPOSE_FILE=docker-compose.yml:docker-compose.proxy.yml
```

`docker compose up --build -d` then publishes the site only on `127.0.0.1:8090` (change with `WEB_PORT`), and the host nginx forwards the domain to it and handles HTTPS (for example with certbot). The nginx server block must send `Host`, `X-Real-IP`, `X-Forwarded-For` and `X-Forwarded-Proto`.

### SEO and answer-engine optimisation

- Every page address is served by Django with its own `<title>`, description, canonical and Open Graph tags, JSON-LD (business, website, breadcrumbs, services, articles, FAQ) and a plain-HTML copy of the content, so crawlers and AI engines can read it without JavaScript. React then takes over.
- `/sitemap.xml`, `/robots.txt` and `/llms.txt` are generated from the live content. Demo projects are excluded.
- Titles and descriptions are edited under **Search & social (SEO)** and in the SEO section of services, categories and projects.

## Client review list

Content now lives in the admin portal, so the file names below refer to where this copy used to live: look for it under the matching admin section (Page text, Services, Projects, FAQs, Home page, About page, Contact page). The FAQs page also gained several answers written for search and answer engines (how to get a planning permit, cost, subdividing, childcare centres, zoning checks, due diligence): please review them too. The Contact FAQ "Does this form send my enquiry?" was rewritten because the form now sends enquiries.

Before publishing, please confirm or supply the following.

**1. Draft copy (everything not marked verified)**

- Home (`home.ts` and `Home.tsx`): intro, "Who we help", "What people bring to us", the six common situations, the planning journey, and two FAQs ("planning permit vs building permit", "zones and overlays"). The other four Home FAQs come from the original site.
- Hero (`ArchitecturalHero.tsx`): the three chapter headlines and lines.
- Services (`services.ts` and `Services.tsx`): for all six services, what it involves, who it's for, when it helps, typical inputs, example deliverables and the conversation prompt (titles and one-liners are original). Also the service finder, stage matrix, coordination roles, engagement formats, consultation preparation list and the five Services FAQs.
- Projects (`projects.ts` and `Projects.tsx`): "Our role in these projects" and "Typical considerations" for each project type (general guidance).
- About (`about.ts` and `About.tsx`): the intro, the four undated timeline chapters (Approach, Focus, Today, Next) and the four principles. The dated chapters (2021, 2022, June 2025) are sourced.
- Contact (`contact.ts`): what to prepare, the first-conversation checklist, what happens next, and the five Contact FAQs.

**2. Four demo projects.** Approve them as clearly labelled examples, replace them with real work, or remove them (see above).

**3. Winchelsea announcement graphic.** Confirm `public/images/winchelsea-announcement.jpg` matches the 10 June 2025 Facebook post it is linked to.

**4. Current status of the three real projects.** Any updates since June 2025: has St Leonards or Winter Valley started construction? Is Winchelsea under construction or complete? The site currently shows only what the June 2025 posts said.

**5. Is the first conversation free?** The Contact FAQ "Is the first conversation free?" is a placeholder.

**Also useful:**
- permission to use the architectural renders, if the architects hold copyright
- confirmation that the ABN can be shown on the About page
- any other approved projects and their public sources

## Missing client assets

- **A high-resolution or SVG logo.** The current logo is a 40 × 40 JPG, which looks soft on high-density screens and as a favicon. An SVG, or a PNG of at least 512 px, would fix both.
- **Photographs of completed or under-construction projects.** Today every project visual is a render or an announcement graphic.
- **A social sharing image (1200 × 630)** and Open Graph tags.
- Optional: a project-specific GLB/GLTF model or rendered image sequence for a photographic hero, a verified address or service area for the map, and a Maps API key for a styled map.

## QA performed (this round)

- `npm run lint` and `npm run build` both pass with no warnings. Vendor code is split into `react` and `motion` chunks. Three.js is the only chunk over 500 kB and loads on demand, so the warning limit is set just above it.
- Every page (Home, Services, Projects, a verified project, a demo project, About, Contact) was checked at 320, 390, 768, 1024 and 1440 px, with normal and reduced motion, against both the dev server and the production build. Each run checked horizontal overflow, elements spilling off-screen, clipped text, broken images, and console or page errors, and was followed by a visual review of every page.
- Scripted checks covered the mobile menu, the form's errors and prepared email, the enquiry starter, the project filters, the accordions, the sticky timeline (at 1024 × 768, at 1440 × 900, and its single-column fallback for short or narrow screens), the hero chapter controls, the skip link and hash deep links.

**Limitations of the testing environment:** Google Fonts and the Google Maps embed were blocked, so text was rendered in fallback fonts and only the map's fallback was seen. WebGL was tested only with software rendering (SwiftShader) in headless Chromium, not on real GPUs, and Safari and Firefox were not tested. The reference site home3ds.com could only be read as static markup, not experienced with its animations. The enquiry form was frontend-only at the time of that testing round; it now posts to the backend.

Three.js references: [responsive rendering](https://threejs.org/manual/pages/responsive.html) and [resource cleanup](https://threejs.org/manual/pages/cleanup.html).
