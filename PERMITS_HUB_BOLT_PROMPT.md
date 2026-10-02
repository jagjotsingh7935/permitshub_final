# Permits Hub — cinematic 3D frontend brief

Build a complete React and TypeScript frontend for Permits Hub, an Australian town planning and development permit business. I have also attached an Instagram reel video for visual and motion reference, along with the company logo. Inspect the attached reel before designing. It shows immersive architectural camera movement, aerial building views, structural-to-finished-building transitions, large imagery, and clean typography. Translate those qualities into an original, professional Permits Hub website.

## Scope and references

Use Vite, React, TypeScript, React Router, and either Tailwind with accessible shadcn/ui primitives or a well-organised custom CSS design system. Use Three.js or React Three Fiber for actual 3D, Motion for interface animation, Lenis for desktop smooth scrolling, and Google Maps on Contact. Build the frontend only. Keep typed content separate from components so a Django REST Framework API can replace local data later. Do not add a database, authentication, or backend.

Information architecture reference: https://smarttownplanning.com.au/ . Use its service, process, project, and enquiry hierarchy as inspiration; create original copy and layout.

Company information: https://www.facebook.com/share/1GKWnvWjHw/ and https://www.facebook.com/abromacdevelopments . Public contact details supplied for the brief are 0409 198 597 and permits@permitshub.com.au. Use Australian English and review details against the original posts before publication. Do not invent staff, office locations, awards, reviews, approval rates, or historical milestones.

## Art direction

The reel is attached for reference purposes. Aim for the feeling of a carefully art-directed architectural portfolio with immersive scroll storytelling and clear business information. Use restrained depth, a convincing architectural model, slow camera easing, soft lighting, wide compositions, and generous whitespace. Avoid repetitive generic cards, glowing gradients, excessive rounded panels, fake counters, and constant floating animation.

Palette: deep navy #09243D, secondary navy #123750, brand blue #176EAE, mineral white #F7F6F2, white #FFFFFF, pale blue #DCEEF7, dark ink #172B3B, muted slate #5A6D7B, and border #DCE4E8. A small warm stone/bronze accent can complement the architectural model. Alternate light editorial sections with deliberate navy feature sections. Match the uploaded logo without stretching, redrawing, or blurring it.

Use Manrope for headings and interface labels, DM Sans for readable body copy, and occasional Newsreader italic for short editorial emphasis. Desktop headlines can be 64–88px; use fluid sizing around 38–52px on phones. Body text should generally be 16–18px with comfortable line height. Keep typography clear over imagery with controlled contrast and overlays.

## The signature 3D experience

Create a real WebGL architectural scene near the top of Home, not merely a flat image with a hover tilt. Use an original abstract architectural study: a site platform with landscaping, a glazed community building, structural beams, roof elements, and surrounding paths. Label it as a conceptual architectural study so it is never confused with an actual approved Permits Hub project.

Connect normal page scroll to a short, cinematic sequence: (1) site and possibility, (2) structure and planning, (3) a resolved building and the next stage. Ease the camera between an oblique view and a more aerial view while the structure assembles. Coordinate three short text chapters with the scene. The sequence should reverse naturally on upward scrolling. Include a visible skip link to the regular page content and accessible chapter controls. Keep scrolling under user control. Do not require dragging or exploring a canvas to find business information.

Use photorealistic GLB/GLTF models or rendered image sequences only when supplied or appropriately licensed. If those assets are missing, use a polished procedural model and clearly describe that limitation. Do not claim that a simple model exactly reproduces the reel’s photorealistic walkthroughs. Do not publish the reference reel itself as website content.

Lazy-load 3D code, cap device pixel ratio, pause rendering when offscreen or when the tab is hidden, and dispose resources on unmount. Keep scene complexity controlled. Provide an attractive static architectural fallback for unavailable WebGL, context loss, and reduced-motion users. On phones, simplify the scene, avoid long pinned sections, and keep normal touch scrolling. Prefer one animation frame loop for the scene and avoid React state updates on every frame.

## Pages

Home: accessible sticky navigation; signature architectural hero with “Discuss your project” and “Explore our work”; a useful project enquiry starter; editorial service overview; a clear four-step client journey; real project showcase; FAQs; strong final contact CTA.

Services: detailed planning and permit support with clear next steps. Only claim services that the business can confirm. Use varied but coherent layouts and plain language.

Projects: an image-led index and individual case-study routes. Feature one large project and supporting projects, with location, dated public status, concise scope, image captions, and source links. Use the actual Permits Hub Facebook visuals. Some are architectural renders or promotional artwork; label them accurately. Do not imply that approved proposals are completed buildings.

Public project updates to verify and include: St Leonards 94-place childcare (June 2025 approval update); Winter Valley swim school in Ballarat (June 2025 permit approval update); Winchelsea 100-place childcare (June 2025 planning and building permit update). Treat construction forecasts in those posts as historical statements, not current status.

About: a grounded introduction, approach, and visually engaging journey based on documented milestones. Use sourced company history or an honest client-process timeline. Avoid fabricated biographies or a made-up founder story.

Contact: clickable phone and email; labelled fields for name, email, optional phone, project type, suburb, stage, and message; helpful validation; and Google Maps showing the relevant Victorian region with an external fallback link. Do not invent an office pin. In this frontend phase, prepare an email locally and make it clear that the visitor still needs to send it. Do not fake a successful server submission.

## Real imagery and interaction

Keep actual project imagery prominent below the conceptual scene. Download available client-owned Facebook assets into the project instead of using expiring CDN hotlinks. If a visual cannot be retrieved, list the exact missing image and use a restrained placeholder for that asset. Never substitute stock buildings or AI renders as actual client work.

Use subtle image parallax, restrained card depth, crisp focus and hover states, and transitions of roughly 200–650ms. Do not combine multiple smoothing systems, use scroll-jacking, or hide content behind a loading screen. Lenis must respect reduced motion and touch devices. Keep the standard cursor and obvious navigation.

## Quality and delivery

Make every page responsive from 320px to wide desktop. Check landscape and portrait layouts, text wrapping, image crops, menu behaviour, keyboard navigation, focus visibility, contrast, and reduced motion. Include semantic headings, descriptive alt text, meaningful link labels, page titles, metadata, a logo-based favicon, working routes, and a useful 404.

Build the actual working application. Complete the content sections and interactions as well as the 3D scene. Run TypeScript, lint, and production build checks, then inspect the website visually. Explain which effects from the attached reel were implemented and which would need supplied project-specific 3D assets. Provide a short list of missing assets or facts requiring client review.
