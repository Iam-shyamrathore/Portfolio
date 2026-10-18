# Design and content decisions

## First-screen priorities

This is a personal engineering portfolio. The opening screen presents Shyam's name and photo, current job, engineering scope, education, resume and contact links, real GitHub stars/repository/contribution totals, selected work, research, and recent writing. It uses a neutral system sans and compact hierarchy instead of a large promotional heading.

The homepage and work index use aligned project rows with generated image thumbnails, clear titles, descriptions, and roles. A project opens a deeper case study. There is no bento/card grid or SVG project art. The research page retains its manuscript-preview and summary layout.

Primary UX references: [aligned layouts and scanning](https://www.nngroup.com/articles/zigzag-page-layout/), [progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/), and [reading/scanning patterns](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/). The application is a design judgment: put identity and useful evidence first, align repeated information, and place detailed decisions on project pages.

## Visual world

White, dark neutral ink, muted blue-gray text, and cobalt #2d5195. System sans throughout. The supplied ASCII video is the page background: invert its grayscale pixels, screen-blend them onto cobalt, and use 0.23 opacity so it reads as blue-on-white. It has a global pause control and respects reduced motion, document visibility, and intersection visibility. A panoramic halftone sky inspired by the user's reference appears in the footer. Its wide aspect ratio avoids enlarging the portrait reference's dots to fill a shallow strip.

The reversible black-hole interaction uses an eased 1.8-second contraction and a soft scene entrance. A generated clay-style desk diorama sits in white space above a CSS ground shadow. Pointer or touch movement tilts the image in perspective; clicking or keyboard activation switches its lighting. Arrow keys provide tilt controls, and a separate lamp button is available. This is an interactive rendered image, not a rotatable 3D mesh. Restore and Escape return the website and keyboard focus. Motion is skipped under reduced motion. The dialog is portaled outside the transforming page.

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

The built-in image-generation tool created a transparent 3D-style desk miniature, optimized to `public/art/desk-miniature.webp`. Prompt: young Indian male programmer, glasses, short wavy black hair, blue shirt, pale trousers, white desk, cobalt laptop and lamp, sculpted matte clay collectible, full seated figure and desk legs, orthographic three-quarter front view, white/cobalt palette, transparent background, no floor or baked shadow, no text or logos. The website adds a soft ground shadow, perspective tilt, and interactive lighting.

The header now uses the plain full name Shyam Rathore, with no asterisk or decorative wordmark. Reading pages use a quiet white text surface and 16–17px body text so the animated page background does not reduce legibility.
