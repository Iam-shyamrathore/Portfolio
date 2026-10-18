# Local verification · 18 October 2026

- Next.js 16.4.2 production build passed, including TypeScript and generated routes.
- ESLint passed without errors or warnings after replacing the obsolete bento components.
- 23 representative pages, metadata routes, API responses, and PDF downloads returned HTTP 200. Missing project and blog slugs returned HTTP 404.
- Downloaded manuscript and selected resume match the supplied originals by SHA-256.
- Content checks verified all six published posts, calculated reading time, draft exclusion, and rejection of invalid category metadata.
- GitHub CLI refresh succeeded with 353 real contributions, 3 stars across original public repositories, and 25 public repositories including forks at the time of checking. Only aggregate profile and calendar data is saved. Server-token refresh remains optional and was not configured for this preview.
- Browser checks covered the 1280px desktop homepage, 390px mobile pages, and a 320px homepage without horizontal overflow. Project filtering, project navigation, blog search, subject filtering, empty-state reset, article rendering, background pause, black-hole collapse, restore, Escape, and focus return were exercised.
- The revised homepage places the contribution graph beside the profile on desktop and below profile statistics on mobile. The final 1280px and 390px layouts have no horizontal overflow. The panoramic footer renders at 320px and 170px tall respectively, with a white fade above the clouds.
- The research page was checked on desktop and mobile. The selected portrait loaded correctly. Other photos use native lazy loading. Reduced-motion behavior is implemented in CSS and the video/collapse handlers; browser media emulation was not available in this test surface.
- Production dependency audit reports zero vulnerabilities. Five high-severity development-only findings remain in the ESLint/fast-glob/micromatch/braces dependency chain. The suggested forced fix downgrades Next's lint config and was not applied.
- No company source code or private operational data was copied into the site. No changes were pushed or deployed.

Screenshots are saved under ignored `artifacts/`. Start the local server with `npm run dev` or use `npm run build` followed by `npm start`.

## Content and interaction revision · 18 October 2026

- Rewrote eight work stories and six roughly two-minute articles after inspecting authored commits and relevant implementation/tests. Public-source commit links are included where available. The private evidence ledger remains in ignored `artifacts/content-evidence.md`; review clones are outside the portfolio. Company source and operational data were not copied into the site.
- Corrected the Speechee history: Shyam authored the original fuzzy validator; a later teammate changed it to exact matching. The navigation story also records the later decision to restrict screen mounting after launch audio side effects. NanoGrad is described as an educational scalar engine, with no complete-training-framework claim.
- Verified the NanoGrad scalar derivative locally: `x*x+x` at `x=3` produces gradient `7`. Other source-repository regression cases were read, not rerun.
- The header now shows the plain full name. Article text computes to 17px desktop / 16px mobile, and work contribution text computes to 16px on mobile. Reading columns suppress the moving background behind text. Revised article and work views at 390px have no horizontal overflow.
- Generated a transparent clay-style desk miniature and verified its alpha channel. The interaction uses a portaled modal, a 1.8-second contraction, a soft entrance, perspective tilt, lamp control, and a CSS ground shadow. Lamp toggle, arrow-key tilt, restore, Escape, and focus return were checked in the browser. Reduced-motion handling is implemented; media emulation was unavailable.

## Three.js interaction revision · 19 October 2026

- ESLint and the production build, including TypeScript and all 26 generated routes, passed after the model refinements.
- The fixed-step elastic sheet stayed at rest without drift and completed with finite positions and all 1,053 nodes captured at 390×844, 1280×800, and 1920×1080 in a standalone numerical check.
- Earlier browser checks confirmed that the shader icon and procedural desk rendered and that the interaction reached the desk. The intermediate destruction frames were not visually reviewed.
- The final model refinements replace the block-shaped face and torso, reshape the hair, soften the floor shadow, and move the opening camera toward the face. Per the user's instruction, no computer use was performed for these final refinements. Visual acceptance is left to the user at http://127.0.0.1:3017/.
- User check: refresh, open the black hole, inspect the opening angle and shadow, drag to rotate, toggle the lamp, click the laptop, reset the view, and restore the website. Also try a narrow window and reduced motion.

## Push-up break mode · 19 October 2026

- “Do push-ups” transitions from the desk to an exercise rig using cloned face/shirt geometry. “Back to work” restores the desk. The exercise uses planted hands/feet, a two-segment arm solver, and a 2.6-second repetition; reduced motion shows a static plank.
- Full ESLint and production build passed. Numerical checks across two repetitions found arm-length error below 1e-15 and at least 0.0417 scene units between the actual head geometry and the floor.
- No browser/computer-use QA was performed, following the user's preference. User verification: trigger the quiet scene, choose Do push-ups, inspect from front/side, return mid-repetition, and repeat. Check reduced motion and the reset-view control.

## Aceternity cloud integration · 19 October 2026

- Verified shadcn/ui configuration, Tailwind CSS v4/PostCSS, TypeScript, utility alias, and registry dependencies. No new dependency was needed. The pasted source matches the registry component.
- Lint and production build passed after the final lifecycle/style changes. The local homepage returned HTTP 200.
- A conservative compositing calculation for the muted foreground `#5e6875` and the cloud/ASCII content-area masks gives a contrast ratio of at least 4.54 with the current layer order and opacity settings. This is a numerical bound, not a visual/browser accessibility audit.
- Visual acceptance is left to the user: refresh the homepage, inspect text and background at desktop/mobile widths, pause/resume, open an article, and verify the black-hole/desk interaction still restores the background.

## Black-hole background continuity · 19 October 2026

- Root causes: the capture deliberately excluded the new ambient layers; the cloud canvas wrote an explicit visible style that overrode inherited page hiding; the quiet dialog faded its opaque background in after the animation ended.
- Added ambient raster capture, synchronous WebGL frame copies, shared CSS mask parameters, video anonymous CORS, capture-time pause, inherited canvas visibility, immediate opaque scene handoff, and desk-module prefetch.
- Verified that the video asset returns `Access-Control-Allow-Origin: *`. Full lint and production build passed. No computer-use/visual QA performed.
- User check after refreshing: click the black hole with clouds visible, verify they deform with the page, check that no clouds flash before the model, restore, and repeat. Also check Skip animation and Escape while preparing/collapsing.

## Prevent capture errors from skipping destruction · 19 October 2026

- The prior code treated any capture or animation-initialization exception as a completed animation, immediately entering the desk scene. Removed that silent shortcut. Actual errors now restore the page and show an error beside the trigger; deliberate Skip and reduced motion still enter the scene directly.
- Removed cloned-DOM background insertion. Background and transparent page captures are composited afterward. Optional background, icon, and desk-prefetch failures are isolated from the destruction animation.
- Fault-injection checks verified that a background capture exception still returns a page frame, successful backgrounds composite behind the content, and foreground failures stay explicit. Full lint, TypeScript, production build, and diff whitespace checks passed.
- No browser/computer use. User needs to refresh and check the complete collapse, restore, and another collapse with clouds visible.

## Prevent black transparent regions during destruction · 19 October 2026

- Background filling previously reused html2canvas's drawing context, which retains DPR/scroll transforms and may retain clipping/alpha state. Transparent regions could remain in the texture; the opaque page material rendered their RGB as black.
- Capture now flattens white, background, and foreground onto a fresh opaque canvas. The page mesh also blends texture transparency over its white scene as a safeguard.
- Native Canvas pixel tests exercised DPR 1/1.5/2, scroll positions 0/600/1400, deliberately retained source clip/alpha state, and background-capture failure. Every output pixel was opaque; background corners and foreground colors matched expectations; failed backgrounds remained white. The test-only Canvas runtime was installed outside the repository.
- Full lint and production build passed. No browser/computer use was performed; the user should refresh and check the full collapse again.

## Live project websites · 19 October 2026

- Added the user's six public URLs to the corresponding project data, case-study links, and project-list live links. MAANGRoute uses its verified HTTPS canonical hostname.
- Response-header checks: Previo, SIIN, APCAN, and Speechee returned 200 without framing restrictions and receive lazy-loaded sandboxed iframe previews. MAANGRoute sends frame-ancestors 'none' plus SAMEORIGIN, and YoLearn sends SAMEORIGIN, so they receive linked preview cards instead of blocked frames. No security policies on those sites were modified.
- YoLearn's public preview image returned 200; MAANGRoute's advertised OG image returned 404, so its existing conceptual artwork remains explicitly labeled.
- Full lint and production build passed. HTTP/HTML checks verified four iframe sources, all six case-study live links, both non-iframe cards, and all six live links on the work index. No browser/computer-use QA performed.
