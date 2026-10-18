# Design and content decisions

## First-screen priorities

This is a personal engineering portfolio. The opening screen presents Shyam's name and photo, current job, engineering scope, education, resume and contact links, real GitHub stars/repository/contribution totals, selected work, research, and recent writing. It uses a neutral system sans and compact hierarchy instead of a large promotional heading.

The homepage and work index use aligned project rows with generated image thumbnails, clear titles, descriptions, and roles. A project opens a deeper case study. There is no bento/card grid or SVG project art. The research page retains its manuscript-preview and summary layout.

Primary UX references: [aligned layouts and scanning](https://www.nngroup.com/articles/zigzag-page-layout/), [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), and [reading/scanning patterns](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/). The application is a design judgment: put identity and useful evidence first, align repeated information, and place detailed decisions on project pages.

## Visual world

White, dark neutral ink, muted blue-gray text, and cobalt #2d5195. System sans throughout. The supplied ASCII video is the page background: invert its grayscale pixels, screen-blend them onto cobalt, and use 0.16 opacity so it reads as blue-on-white. It has a global pause control and respects reduced motion, document visibility, and intersection visibility. A panoramic halftone sky inspired by the user's reference appears in the footer. Its wide aspect ratio avoids enlarging the portrait reference's dots to fill a shallow strip.

The reversible black-hole interaction captures the visible page as a texture and deforms it with a fixed-step mass/spring simulation. Anchors release as attraction increases; the page stretches into the center. A WebGL shader approximates curved light around a dark core with a blue-white accretion disk. This is an artistic approximation, not a calibrated general-relativity simulation. The button uses the same shader rather than an SVG.

The quiet scene uses original procedural Three.js meshes: a seated figure with glasses and a continuous wavy hair mesh, a desk, keyboard, laptop, chair, articulated lamp, mug, and notebook. OrbitControls rotates the view, raycasting makes the lamp and laptop clickable, and keyboard/buttons provide equivalent controls. “Do push-ups” transitions to a procedural exercise rig using the same face and clothing, with fixed hands and feet and a two-segment arm solver. “Back to work” restores the desk; reduced motion shows a static plank. An overhead light and a faint radial contact shadow ground the scene. Restore and Escape return the website and keyboard focus. Reduced motion skips the destruction and suppresses idle animation. The dialog is portaled outside the page.

## Content boundaries

Company work describes responsibilities and general engineering decisions. Company source, internal endpoints, infrastructure addresses, customer data, and credentials are excluded. Private repositories are not linked as public source. GitHub data includes aggregate counts and dates only. Stars are summed from original public repositories; the public repository count includes public forks.

Older resumes disagree on metrics and publication status. The site avoids those project metrics and follows the user's current statement that the manuscript is unpublished. SIIN is a graph/search implementation; findings are scoped to its five-developer exploratory study.

The six notebook essays are newly written from reviewed implementations and authored commits. Each explains a failure, decision, tradeoff, and useful takeaway. They are dated when written, rather than backdated to the underlying change. Current implementation and individual authorship are distinguished from earlier code and team changes.

## Asset credits and prompts

Photographs, manuscript, and footer sky reference: supplied by Shyam. The ASCII video/poster comes from the supplied [21st.dev recipe](https://21st.dev/community/ascii/editor?from=488f05af-0110-4873-87e7-5afea99778ac).

The built-in image generation tool created the seated illustration, a panoramic sky used in the footer and social metadata, and eight project illustrations. Outputs were optimized as WebP in `public/art/` and `public/projects/`. They are conceptual artwork, not screenshots.

All project prompts share: landscape 3:2, minimal tactile white-paper still life, muted cobalt #2d5195, fine risograph texture, soft studio light, generous space, no text, numbers, logos, UI, borders, or gradients.

- YoLearn: layered learning atlas pages connected by a returning blue thread, suggesting reliable workflows.
- Previo: white architectural/cloud blocks connected by alternative blue conduits.
- APCAN: a cobalt voice waveform resolving into structured administrative index cards.
- Prachaar: evidence cards connected into a durable report with blue tabs.
- SIIN: sparse blue evidence points linked by threads, including an uncertain dotted path.
- MAANGRoute: a white daily calendar, blue checkmark, and organized index tabs.
- Speechee: white speech bubbles, a blue sound ribbon, and a paper apple.
- NanoGrad: a white computational tree with blue beads and a backward-traveling thread.

Seated illustration prompt: preserve the supplied subject's likeness, hair, glasses, seated posture, watch, and laptop; render the full person and chair in blue-and-white stipple on a transparent background; remove the office and add no text.

Panoramic sky prompt: panoramic cobalt-and-white halftone cumulus clouds with fine dithering, dissolving into white at the upper edge; no text, logos, people, or UI.

## Desk scene replacement

The earlier generated desk image remains an unused asset. The active scene is built in `lib/desk-model.ts` with Three.js geometry, lighting, materials, and a canvas texture for the laptop screen. No EPS asset is used. Geometry, textures, controls, and renderers are disposed when leaving the scene.

The header uses the plain full name Shyam Rathore, with no asterisk or decorative wordmark. Reading pages use a quiet white text surface and 16–17px body text so the animated page background does not reduce legibility.

## Aceternity cloud background

The project already has `components.json` for shadcn/ui, TypeScript, Tailwind v4 and its PostCSS plugin, and the `@/lib/utils` class merger. The [Aceternity cloud demo registry](https://ui.aceternity.com/registry/cloud-shader-demo.json) and its `cloud-shader` dependency were inspected; the user's pasted source matches the registry. No extra package is required: the component uses native WebGL and existing React utilities.

`components/ui/cloud-shader.tsx` retains Aceternity's billow shader with a corrected ascending-edge haze smoothstep. The reusable demo is in `components/cloud-shader-demo.tsx`. Portfolio integration uses five white clouds, blue sky, 0.35-speed drift, 20 fps, and a 900,000-pixel rendering budget. The cloud layer occupies the upper 720px (90svh on smaller screens) and fades vertically. The ASCII texture sits above the clouds so it remains visible instead of being covered by the sky. A shared pause control stops both clouds and ASCII. The shader stops scheduling animation when paused, offscreen, hidden, reduced-motion is enabled, or its context is lost. A CSS sky remains if WebGL is unavailable.

Both layers fade toward the measured content column. Cloud opacity is 1 at the edges and at most 0.2 under text; ASCII opacity is 0.16 at the edges and about 0.053 under text; the original white article/case-study reading surfaces remain. Clouds stay more visible at the edges. The sky footer remains the user's halftone artwork. No browser/computer use was performed for this addition.

## Background continuity during the black-hole interaction

The capture now freezes the ambient layers, asks WebGL canvases to paint/copy synchronously before their buffers clear, and rasterizes the current clouds and ASCII video with the same opacity, masks, and screen/invert treatment used by CSS. The page is captured with a transparent base. A fresh opaque Canvas 2D bitmap is filled white, then receives the background and foreground in order; html2canvas's drawing context is never reused. No images or layout changes are injected into html2canvas's clone. This avoids its missing WebGL/video-filter/mask support without letting optional decorations cancel the animation. Video uses anonymous CORS; the media server's response allows cross-origin reads. Mask parameters are shared through CSS variables.

The cloud canvas inherits visibility instead of explicitly forcing itself visible. The consumed page additionally hides that canvas, and the quiet dialog becomes opaque white immediately. This prevents clouds from painting through the hidden page during the scene handoff. The desk module is prefetched while the page capture is prepared. Restore clears both capture and consumed classes.
