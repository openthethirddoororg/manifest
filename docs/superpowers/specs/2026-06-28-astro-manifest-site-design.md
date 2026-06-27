# Astro Manifest Site — Design Spec

**Date:** 2026-06-28
**Repo:** `openthethirddoororg/manifest`
**Domain:** https://openthethirddoor.org (apex, GoDaddy DNS → GitHub Pages)

## Purpose

A small public manifesto site. Contributors edit **meaning only** (Markdown).
A maintainer owns **design** (Astro layout, CSS, components). The site is
bilingual (English + Russian) with a language switch. Astro generates static
HTML from the Markdown via GitHub Actions and deploys it to GitHub Pages. The
generated site is **not committed**.

The home page is the manifesto; sub-pages cover values, rules, trust, joining,
and co-hosting. The home page ends with the "Core" («Ядро»).

## Core principle: content ↔ design boundary

| Folder        | Owner        | Contents                                          |
|---------------|--------------|---------------------------------------------------|
| `/content`    | contributors | Markdown only (`title` + `order` frontmatter)     |
| `/template`   | maintainer   | Astro project: layout, CSS, components, config    |

Contributors never open `/template`. The maintainer owns all visual/code
decisions. The collection schema validates frontmatter, so a malformed page
fails the build with a clear error rather than shipping broken.

## Repository structure

```
manifest/
├── content/                      # contributors: meaning only
│   ├── en/
│   │   ├── index.md   values.md  rules.md
│   │   ├── trust.md   join.md    cohost.md
│   └── ru/
│       └── index.md … cohost.md  # Russian mirrors
│
├── template/                     # maintainer: Astro + design
│   ├── package.json
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   ├── src/
│   │   ├── content.config.ts     # glob loader → ../content
│   │   ├── layouts/Base.astro    # html skeleton, header/footer, <slot/>
│   │   ├── pages/
│   │   │   └── [lang]/[...slug].astro   # single route → all pages
│   │   ├── components/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   └── LangSwitch.astro
│   │   └── styles/global.css
│   └── public/
│       ├── CNAME                 # openthethirddoor.org
│       ├── favicon.ico
│       └── img/logo.png
│
├── .github/workflows/deploy.yml  # Astro build → Pages
├── README.md
├── LICENSE                       # CC BY-SA 4.0 (full text)
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── .gitignore                    # node_modules, template/dist, .astro
```

`/website` and the `/docs` Jekyll draft are removed. The old
`.github/workflows/pages.yml` is replaced by `deploy.yml`.

## How it works

### Content collection (Astro 5 Content Layer)

A single collection `pages` reads Markdown from outside `src` via the glob
loader:

```ts
// template/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../content' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    description: z.string().optional(),
  }),
});

export const collections = { pages };
```

- `base: '../content'` is relative to the Astro project root (`template/`),
  resolving to the repo-level `/content`.
- Entry `id` encodes language + slug: `en/index`, `ru/values`, etc.

### Routing

One dynamic route builds every page:

```
template/src/pages/[lang]/[...slug].astro
```

`getStaticPaths()` iterates the collection, splits each `id` into `lang`
(`en`/`ru`) and `slug` (filename without language prefix). `index` maps to the
empty slug:

| Content file            | id           | URL          |
|-------------------------|--------------|--------------|
| `content/en/index.md`   | `en/index`   | `/en/`       |
| `content/en/values.md`  | `en/values`  | `/en/values` |
| `content/ru/index.md`   | `ru/index`   | `/ru/`       |
| `content/ru/cohost.md`  | `ru/cohost`  | `/ru/cohost` |

### i18n

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: { prefixDefaultLocale: true },
  },
});
```

`prefixDefaultLocale: true` makes Astro emit a `/ → /en/` redirect, so both
languages are prefixed (`/en/…`, `/ru/…`) and the bare root lands on English.
IP-based default-language detection is **out of scope** for the static build; it
is a future enhancement at the edge (e.g. Cloudflare).

### Navigation & language switch (auto-generated)

- **`Nav.astro`** — queries the collection for the current `lang`, sorts by
  `order`, renders menu links. Adding a Markdown file appears in the nav
  automatically; no template edit needed.
- **`LangSwitch.astro`** — given the current `lang` + `slug`, links to the same
  `slug` in the other language (when that mirror exists).

These derive entirely from the collection, so contributors changing `/content`
never touch component code.

## Contributor contract

Every `.md` in `/content/**` starts with frontmatter:

```yaml
---
title: Values          # page heading and nav label
order: 2               # position in navigation
description: ...       # optional, used for <meta name="description">
---
```

Markdown body follows. Rules captured in `CONTRIBUTING.md`:

- Edit content **only** in `/content/<lang>/`.
- `title` and `order` are required; missing `title` fails the build.
- Do not edit `/template` (design is maintainer-owned).
- Keep `en` and `ru` filenames in sync so the language switch resolves.

A `nav: false` flag to hide a page from the menu is a **possible future
addition**, intentionally omitted for now (current set is small enough that all
pages belong in the nav).

## Deployment

`.github/workflows/deploy.yml`:

- **Trigger:** push to `main` touching `content/**`, `template/**`, or the
  workflow file; plus `workflow_dispatch`.
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`.
- **Steps:** checkout → setup Node 20 (npm cache) → `npm ci` in `template/` →
  `npx astro build` → `upload-pages-artifact` with `path: template/dist` →
  `deploy-pages`.
- `package-lock.json` is committed so `npm ci` is reproducible.

GitHub repo setting: **Settings → Pages → Source: GitHub Actions**.
`public/CNAME` is copied to `dist/` root, preserving the custom domain.

## Documentation files

| File               | Content                                                        |
|--------------------|----------------------------------------------------------------|
| `README.md`        | What this is, how to contribute, CC BY-SA notice               |
| `LICENSE`          | Full CC BY-SA 4.0 legal text                                   |
| `CONTRIBUTING.md`  | Edit flow + frontmatter contract + content/design boundary     |
| `CODE_OF_CONDUCT.md` | Psychological-safety code in the project's spirit            |

## Out of scope (for now)

- IP / geo-based default language (future edge enhancement).
- `nav: false` page-hiding flag.
- Committing the generated site.
- Search, comments, analytics.

## Open implementation details (decided during planning)

- Exact `getStaticPaths` slug-splitting helper and `LangSwitch` mirror lookup.
- Visual design specifics of `Base.astro` / `global.css` (maintainer-owned;
  not constrained by this spec).

## Implementation sequencing

1. **First commit** — working Astro generation per this spec: `/content` (en+ru
   Markdown stubs with valid frontmatter), `/template` (Astro project, layout,
   components, config), `deploy.yml`, `.gitignore`; remove `/website`, `/docs`
   Jekyll draft, and old `pages.yml`. Site must build and deploy.
2. **Second commit** — fill the doc files: `README.md`, `LICENSE` (CC BY-SA 4.0),
   `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
