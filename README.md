# Shyam Rathore · Portfolio

Next.js App Router, React, TypeScript, and Tailwind CSS v4. Project stories, a Markdown notebook, research, real GitHub contribution data, photographs, and a reversible black-hole interaction with an interactive procedural Three.js desk scene.

## Run locally

```sh
npm install
npm run dev
```

Open the printed local URL. `npm run build` creates the production build; `npm start` serves it. No database or admin account is needed.

## Publish a blog post

Add a Markdown file to `content/blog/`, locally or through GitHub's Add file UI. Its filename becomes its URL: `my-next-note.md` becomes `/blog/my-next-note`.

```markdown
---
title: "My next note"
description: "A short description for the index and search."
date: "2026-10-18"
category: "System design"
draft: false
---

Start writing here.

## A useful heading

Markdown links, images, code blocks, lists, and tables work.
```

Categories: `System design`, `Databases`, `Agents`, `Product thinking`. Quote dates. Use lowercase, hyphenated filenames. Set `draft: true` to exclude a post from the index, direct routes, RSS, and sitemap. Builds validate published metadata and fail on invalid files. Raw HTML and executable MDX are not enabled.

Commit and redeploy to publish. Files are read at build time; there is no upload endpoint. The six initial posts are newly written engineering notes grounded in reviewed source and authored commits, not historical entries. Company examples are paraphrased; private source stays outside the portfolio. Reading time is calculated. RSS lives at `/feed.xml`.

## Update work and research

- Edit `lib/projects.ts` for project copy, categories, stack, and public links. Case-study pages generate automatically.
- Edit `app/research/page.tsx` for the manuscript summary. The paper is `public/research/siin-manuscript.pdf`; replace its preview if the paper changes.
- The selected resume is `public/resume/Shyam_Rathore_AI_Engineer.pdf`.
- Photos are in `public/photos/`; original generated artwork is in `public/art/` and `public/projects/`. Project images are conceptual illustrations, not product screenshots.
- `components/ui/minimal.tsx` integrates the supplied ASCII recipe. TypeScript, Tailwind, `@/` aliases, `components/ui/`, and `lib/utils.ts` already exist. `components.json` declares shadcn-compatible paths; no migration is needed.

## GitHub activity

`data/github.json` is a real GraphQL contribution snapshot. `data/profile.json` contains public repository totals and the sum of stars on original public repositories. The sync command refreshes both. The interface labels the snapshot date. No private repository names or activity details are stored.

Refresh with the existing GitHub CLI login:

```sh
npm run github:sync
```

Commit and redeploy to update the graph and profile totals. For hourly server-side contribution refresh, set optional server-only `GITHUB_TOKEN` before building. Requests fall back to the dated snapshot on failure. Profile stars and repository counts use the dated snapshot until the next CLI sync. No token enters the browser. `/api/github` serves the contribution data. Both snapshots work without credentials.

The supplied Contribution Skyline renders the same server-provided calendar on Home (26 weeks) and About (53 weeks). It starts as a flat heat map, with an optional 3D skyline and drag/keyboard controls. Colors match the portfolio and preserve GitHub’s contribution levels. No generated sample activity is used. The chart respects reduced motion and stops its animation loop when the tab is hidden; the source/snapshot date remains visible.

## Hosting and metadata

Set `SITE_URL` to the canonical address before deployment (default `https://shyam.codes`). See `.env.example`. It controls RSS, metadata, robots, and sitemap URLs. Use a supported Next.js host. This local redesign does not alter the live website until deployed.

## Verify

```sh
npm run lint
npm run build
```

Check desktop/mobile navigation, project filters, blog search and subject filters, paper/resume links, contribution dates, and black-hole restore/Escape behavior. Test reduced motion. `docs/design.md` records the direction, content boundaries, image prompts, and credits.
