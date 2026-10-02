# Permits Hub frontend

Responsive website for Permits Hub, a Victorian town planning business. Built with React 19, TypeScript, Vite, React Router, Motion, Lenis and Three.js. This phase is **frontend only**: there is no backend, database or analytics, and the enquiry form prepares an email on the visitor's device rather than sending anything.

## Run locally

```bash
npm install
npm run dev       # development server
npm run lint      # ESLint
npm run build     # type-check (tsc -b) and production build into dist/
npm run preview   # serve the production build locally
```

Routes use browser history, so a static host must rewrite unknown paths to `index.html` (for example a Netlify `_redirects` rule or an nginx `try_files`).

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
src/
  main.tsx, App.tsx      App shell. Home loads with the first bundle; other pages load on demand (React.lazy).
  content/               ALL site data and most copy, typed. Replace with an API later without touching components.
    types.ts             Content status (verified | draft | demo) and shared types
    site.ts              Contact details, navigation, page titles, public sources, regions
    home.ts              Home sections and FAQs
    services.ts          Services, finder, stage matrix, roles, engagement formats
    projects.ts          Verified projects, demo projects, category guidance, date formatting
    about.ts             Timeline chapters, drawing stages, principles
    contact.ts           Contact guidance and FAQs (Contact and Services)
  pages/                 One file per route (Home, Services, Projects, ProjectDetail, About, Contact, NotFound)
  components/
    layout/              Header (with mobile menu), Footer, Brand
    home/                ArchitecturalHero + architecturalScene.ts (Three.js), ProjectStarter, ServicesEditorial
    about/               CompanyTimeline.tsx (sticky timeline), SiteEvolution.tsx (seven-stage drawing)
    projects/            ProjectCard, ProjectMedia, ProjectShowcase, ProjectIllustration (demo drawings)
    ui/                  Accordion, Badges, Checklist, PlanningJourney, Reveal, Sections (PageHero, CTA)
  lib/
    scroll.ts            The single scroll controller (Lenis or native)
    usePageSetup.ts      Page titles, scroll reset, hash targets, creates the one Lenis instance
    motion.ts            Shared animation timings
    iso.ts               Isometric projection helper for the SVG drawings
    useActiveIndex.ts    Which timeline chapter is being read
    useMediaQuery.ts     Media query hook
  styles/
    styles.css, redesign.css, cinematic.css   Original styles (minified), kept as the base layer
    sections.css         New page sections (Home, Services, Projects, Contact)
    about.css            About timeline
    evolution.css        Isometric drawings (timeline and demo projects)
public/images/           Published images (see "Images" below)
draft-assets/            Unused drafts, not published
PERMITS_HUB_BOLT_PROMPT.md   Original design brief
```

Page headings and short section intros sit inline in `src/pages/*.tsx` (and the three hero chapters in `ArchitecturalHero.tsx`). Everything list-like or repeatable is in `src/content/`.

## Content status: verified, draft and demo

Every piece of content falls into one of three states, defined in `src/content/types.ts`:

- **verified**: supported by a public source, which is linked in the data (the Australian Business Register, a City of Melton planning report, or a Permits Hub Facebook post). The four Home FAQ answers marked `verified` come from the original website, as do the six service titles and one-line descriptions.
- **draft**: written for this build from general planning knowledge. It renders normally, but the client must confirm it. Drafts are marked with `status: 'draft'` on FAQs and services, or with a `DRAFT` comment above the data.
- **demo**: fictional. Demo content is always labelled on screen ("Demo project", "Illustrative", "Conceptual illustration") and never appears in the Home project showcase, the About timeline or the Services "related updates".

The status is a review flag for the team. It is not shown to visitors, except for the demo labels.

### Verified projects

`verifiedProjects` in `src/content/projects.ts` holds the three public updates (St Leonards, Winchelsea, Winter Valley). Each record links to its Facebook post. Statuses are written "as reported" on the post date, and construction forecasts are presented as historical statements. To update a project, change `status`, `statusNote`, `milestones` and `nextSteps`, and add the new source to `sources` in `site.ts`.

### Demo projects: replace or remove

The four demo projects live in `demoProjects` in `src/content/projects.ts`:

1. Shopfront to allied health clinic (`demo-shopfront-clinic`)
2. Warehouse extension and loading bay (`demo-warehouse-extension`)
3. Three townhouses on a suburban lot (`demo-three-townhouses`)
4. Community hall accessibility upgrade (`demo-community-hall`)

**To remove them all:** set `export const demoProjects: DemoProject[] = []`. The Projects page adapts automatically. The "Source" filter, the demo count, the demo footnote and the demo wording in the page intro all disappear, and the type filters only show categories that still have projects. Old demo URLs fall through to the "project not found" page. `ProjectIllustration.tsx` can stay (it is only used by demos) or be deleted along with the `.pi-*` rules in `sections.css`.

**To remove one:** delete its object from the array.

**To replace one with real work:** move it into `verifiedProjects` and give it the `VerifiedProject` fields: `record: 'verified'`, `region`, `updateDate`, `statusNote`, a `cover` image, a `gallery` and `sources`. The type checker lists anything missing. Use a real slug without the `demo-` prefix.

**To adjust a demo drawing:** each drawing in `ProjectIllustration.tsx` is wrapped in `<g transform="translate(x y)">`. These are set so every drawing is centred around (260, 170) of the 520 × 360 viewBox, with at least 30 units of margin, leaving room for the "Conceptual illustration" tag. If you change a drawing's geometry, adjust that translate.

## Images

All published images are in `public/images/` and were downloaded from Permits Hub's public Facebook posts (no hotlinks):

| File | Size | Use |
| --- | --- | --- |
| `st-leonards-childcare.jpg` | 1080 × 1350 | Full announcement graphic, St Leonards gallery |
| `winchelsea-render.jpg` | 1063 × 1417 | Full render, Winchelsea gallery |
| `winchelsea-announcement.jpg` | 1080 × 1350 | Announcement graphic, Winchelsea gallery (**client to confirm it matches the linked post**) |
| `winter-valley-swim-school.jpg` | 1080 × 1350 | Full announcement graphic, Winter Valley gallery |
| `architectural-study.svg` | vector | Static hero study (reduced motion, WebGL fallback) |
| `permits-hub-logo.jpg` | 40 × 40 | Header/footer logo and favicon (**low resolution, see missing assets**) |

### Crops in `public/images/crops/`

The portrait Facebook graphics don't work as landscape thumbnails, so each project has a landscape **cover crop** showing just the architectural render:

| Crop | Size | Cropped from |
| --- | --- | --- |
| `crops/st-leonards-render.jpg` | 1080 × 644 | the render area of `st-leonards-childcare.jpg` |
| `crops/winchelsea-render.jpg` | 1063 × 728 | the building in `winchelsea-render.jpg` |
| `crops/winter-valley-views.jpg` | 1080 × 560 | the three circular views in `winter-valley-swim-school.jpg` |

A project's `cover.src` points to its crop, and `cover.position` sets the CSS `object-position` focal point. The crop is used on project cards, the featured project, the Home showcase, the project overview figure, the About timeline and the Services "related updates". The full graphics stay unchanged in each project's `gallery` (shown with `fit: 'contain'` so nothing is cut off). Every caption says whether an image is a render or announcement artwork; none are photographs of completed buildings.

To replace a crop, export a landscape JPEG at least 1000 px wide (between 3:2 and 2:1 works everywhere) at about 80% quality and under 150 KB. Then overwrite the file or update `cover.src`, and tune `cover.position` if the subject is off-centre.

`draft-assets/` holds an unused generated hero image and a duplicate of the Winchelsea announcement. Neither is published.

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
- **Form:** labelled fields with required/optional text. On submit, an error summary (`role="alert"`) receives focus and links to each field. Fields get `aria-invalid` and `aria-describedby`, and an error clears as soon as its field is edited. The prepared email panel receives focus. The form says plainly that nothing is sent.
- **Accordions:** buttons with `aria-expanded` and `aria-controls`, and panels as labelled regions. Enter and Space work.
- **Project filters:** toggle buttons with `aria-pressed`, and the result count is announced (`aria-live="polite"`). An empty result offers "Clear filters".
- **Images and drawings:** content images have descriptive alt text that says whether they're renders or announcements. Decorative images use `alt=""`. SVG drawings are `role="img"` with a label saying they are conceptual. External links say "(opens in a new tab)" to screen readers.
- **Motion:** honours `prefers-reduced-motion` everywhere (no WebGL, no Lenis, no reveals or camera moves, and content is never hidden waiting for an animation).
- **Contrast:** an axe-core audit (WCAG 2.1 AA) of every page at 390 and 1440 px passes. A few muted greys were darkened slightly to reach 4.5:1. The only remaining flag is the very large decorative page number in the page hero (`aria-hidden`, exempt as pure decoration under WCAG 1.4.3).
- Touch targets for the menu, filters, timeline buttons and form controls are at least 44 px.

## Map

The Contact map is an indicative Victoria view, not an office location. The Google Maps embed needs no API key. If it can't load, a drawn fallback map shows the public regions, and the card always offers an "Open in Google Maps" link. A verified address, project pins or a styled map (which needs a Maps API key) can be added later.

## Backend later

The enquiry form validates locally and builds a `mailto:` link with a copyable message. To connect a Django REST Framework endpoint, replace `prepare()` in `src/pages/Contact.tsx` with a POST, keep the same validation, and add a privacy notice. Content in `src/content/` has the same shape an API would return.

## Client review list

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

**Limitations of the testing environment:** Google Fonts and the Google Maps embed were blocked, so text was rendered in fallback fonts and only the map's fallback was seen. WebGL was tested only with software rendering (SwiftShader) in headless Chromium, not on real GPUs, and Safari and Firefox were not tested. The reference site home3ds.com could only be read as static markup, not experienced with its animations. The enquiry form is frontend-only and sends nothing.

Three.js references: [responsive rendering](https://threejs.org/manual/pages/responsive.html) and [resource cleanup](https://threejs.org/manual/pages/cleanup.html).
