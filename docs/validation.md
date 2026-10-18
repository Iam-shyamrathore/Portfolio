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
