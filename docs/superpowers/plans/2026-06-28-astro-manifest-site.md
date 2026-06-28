# Astro Manifest Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (en/ru) static manifesto site that Astro generates from Markdown in `/content` and deploys to GitHub Pages via Actions.

**Architecture:** Markdown content lives in `/content/{en,ru}` (contributors). An Astro project in `/template` (maintainer) reads it through a single Content Layer collection, renders every page from one dynamic route, and builds static HTML. A GitHub Actions workflow runs `astro build` and publishes the artifact. The generated site is never committed.

**Tech Stack:** Astro 5 (Content Layer / glob loader), TypeScript, Vitest (unit tests for pure helpers), Node 20, GitHub Actions, GitHub Pages.

## Global Constraints

- Content/design boundary: contributors touch only `/content/**.md`; all code/design lives in `/template`.
- Astro project root is `/template`; the collection reads `../content`.
- Node 20; package manager npm; `package-lock.json` committed for `npm ci`.
- Languages: `en` (default) and `ru`, both URL-prefixed (`/en/…`, `/ru/…`); `/` redirects to `/en`.
- Frontmatter contract per content file: `title` (string, required), `order` (number, required), `description` (string, optional).
- Generated output (`template/dist`, `template/.astro`, `node_modules`) is git-ignored, never committed.
- Custom domain `openthethirddoor.org` via `template/public/CNAME`.
- First milestone = working/deployable site with stub content; doc files (README/LICENSE/CONTRIBUTING/CODE_OF_CONDUCT) are filled in a **separate later commit**, out of scope for this plan.

---

### Task 1: Scaffold project, clean up old drafts, move assets

Establishes the `/template` Astro project skeleton, root `.gitignore`, relocates the real assets (CNAME, favicon, logo), and removes the abandoned `/website` folder, `/docs` Jekyll draft, and old `pages.yml`. After this task `npm install` succeeds inside `template/` (no pages yet — build comes in Task 4).

**Files:**
- Create: `template/package.json`
- Create: `template/astro.config.mjs`
- Create: `template/tsconfig.json`
- Create: `.gitignore`
- Move: `website/CNAME` → `template/public/CNAME`
- Move: `website/favicon.ico` → `template/public/favicon.ico`
- Move: `logo.png` (repo root) → `template/public/images/logo.png`
- Delete: `website/` (remaining `index.html`), `.github/workflows/pages.yml`
- Delete: `/docs` Jekyll draft only — `docs/_config.yml`, `docs/index.md`, `docs/values.md`, `docs/rules.md`, `docs/trust.md`, `docs/join.md`, `docs/cohost.md`, `docs/ru/`, `docs/_layouts/`, `docs/_includes/`, `docs/assets/`. **Keep `docs/superpowers/`.**

**Interfaces:**
- Produces: an Astro project rooted at `template/` with `site`, `i18n`, and `redirects` config that Task 2–5 build on. Public assets resolve to `dist/` root (`/CNAME`, `/favicon.ico`, `/images/logo.png`).

- [ ] **Step 1: Create `template/package.json`**

```json
{
  "name": "openthethirddoor-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `template/astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  // Root → default locale. en/ru are prefixed by the [lang] route itself.
  redirects: {
    '/': '/en',
  },
});
```

- [ ] **Step 3: Create `template/tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create root `.gitignore`**

```gitignore
# dependencies
node_modules/

# Astro build output & cache (generated site is never committed)
template/dist/
template/.astro/

# logs / env
*.log
.env
.env.*
.DS_Store
```

- [ ] **Step 5: Move assets into `template/public`**

The working tree is mixed (some of these paths are tracked, some untracked
from earlier exploration), so use plain filesystem moves — not `git mv` — and
let Step 9 stage the result.

Run (PowerShell):
```powershell
New-Item -ItemType Directory -Force template\public\img | Out-Null
Move-Item -Force website\CNAME        template\public\CNAME
Move-Item -Force website\favicon.ico  template\public\favicon.ico
Move-Item -Force logo.png             template\public\img\logo.png
```
Expected: three files now under `template/public`.

- [ ] **Step 6: Remove the obsolete website folder, old workflow, and Jekyll draft**

Run (PowerShell). `-ErrorAction SilentlyContinue` tolerates paths that were
already removed or never committed:
```powershell
Remove-Item -Recurse -Force website -ErrorAction SilentlyContinue
Remove-Item -Force .github\workflows\pages.yml -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force docs\_config.yml,docs\index.md,docs\values.md,docs\rules.md,docs\trust.md,docs\join.md,docs\cohost.md,docs\ru,docs\_layouts,docs\_includes,docs\assets -ErrorAction SilentlyContinue
```
Expected: `website/`, `pages.yml`, and the `docs/` Jekyll draft gone;
`docs/superpowers/` untouched.

- [ ] **Step 7: Install dependencies**

Run: `npm install --prefix template`
Expected: completes; creates `template/node_modules` and `template/package-lock.json`.

- [ ] **Step 8: Verify project resolves**

Run: `npx --prefix template astro --version` (or `npm --prefix template exec astro -- --version`)
Expected: prints an Astro 5.x version with no config error.

- [ ] **Step 9: Commit**

Stage **only** this task's paths. Do **not** use `git add -A`/`git add .` —
empty `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` files exist in the
working tree as untracked placeholders for a later milestone and must NOT be
committed here.

```powershell
git add template .gitignore
git add website .github/workflows/pages.yml
git status --short
git commit -m "chore: scaffold Astro project in template/, relocate assets, drop drafts"
```
Expected `git status --short` before commit: new `template/**` and
`.gitignore` added; `website/**` and `pages.yml` shown as deletions; the
empty `LICENSE`/`CONTRIBUTING.md`/`CODE_OF_CONDUCT.md` remain untracked
(`??`) and unstaged.

---

### Task 2: Path helpers (TDD) + content collection

Pure, framework-free helpers that translate a collection entry `id`
(`en/index`, `ru/values`) into language, slug, and URL. These are the only
non-trivial logic in the site, so they get real unit tests. Then wire the
collection that produces those ids.

**Files:**
- Create: `template/src/lib/paths.ts`
- Test: `template/src/lib/paths.test.ts`
- Create: `template/src/content.config.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'en' | 'ru'`
  - `const LANGS: Lang[]` = `['en', 'ru']`
  - `const DEFAULT_LANG: Lang` = `'en'`
  - `parseId(id: string): { lang: Lang; slug: string }` — splits `"en/values"` → `{ lang: 'en', slug: 'values' }`
  - `routeSlug(slug: string): string` — `"index"` → `""`, else unchanged
  - `entryUrl(lang: Lang, slug: string): string` — `("en","index")` → `"/en"`, `("ru","values")` → `"/ru/values"`
  - `otherLang(lang: Lang): Lang` — `"en"` → `"ru"`, `"ru"` → `"en"`
  - collection `pages` with schema `{ title: string; order: number; description?: string }`
- Consumed by: Task 4 (`[lang]/[...slug].astro`, `Nav.astro`, `LangSwitch.astro`).

- [ ] **Step 1: Write the failing test**

Create `template/src/lib/paths.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseId, routeSlug, entryUrl, otherLang, LANGS, DEFAULT_LANG } from './paths';

describe('parseId', () => {
  it('splits language and slug', () => {
    expect(parseId('en/values')).toEqual({ lang: 'en', slug: 'values' });
    expect(parseId('ru/index')).toEqual({ lang: 'ru', slug: 'index' });
  });
});

describe('routeSlug', () => {
  it('maps index to empty string', () => {
    expect(routeSlug('index')).toBe('');
  });
  it('passes other slugs through', () => {
    expect(routeSlug('values')).toBe('values');
  });
});

describe('entryUrl', () => {
  it('builds the home url for index', () => {
    expect(entryUrl('en', 'index')).toBe('/en');
    expect(entryUrl('ru', 'index')).toBe('/ru');
  });
  it('builds a sub-page url', () => {
    expect(entryUrl('en', 'values')).toBe('/en/values');
  });
});

describe('otherLang', () => {
  it('toggles language', () => {
    expect(otherLang('en')).toBe('ru');
    expect(otherLang('ru')).toBe('en');
  });
});

describe('constants', () => {
  it('exposes languages and default', () => {
    expect(LANGS).toEqual(['en', 'ru']);
    expect(DEFAULT_LANG).toBe('en');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix template test`
Expected: FAIL — cannot resolve `./paths` (module not yet created).

- [ ] **Step 3: Write minimal implementation**

Create `template/src/lib/paths.ts`:
```ts
export type Lang = 'en' | 'ru';

export const LANGS: Lang[] = ['en', 'ru'];
export const DEFAULT_LANG: Lang = 'en';

export interface ParsedId {
  lang: Lang;
  slug: string;
}

/** Split a collection id like "en/values" into language and slug. */
export function parseId(id: string): ParsedId {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

/** "index" is the home page (empty route slug); everything else passes through. */
export function routeSlug(slug: string): string {
  return slug === 'index' ? '' : slug;
}

/** Build the URL for a page: "/en" for home, "/en/values" otherwise. */
export function entryUrl(lang: Lang, slug: string): string {
  const r = routeSlug(slug);
  return r ? `/${lang}/${r}` : `/${lang}`;
}

/** The other supported language. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'ru' : 'en';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix template test`
Expected: PASS — all assertions green.

- [ ] **Step 5: Create the content collection**

Create `template/src/content.config.ts`:
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  // base is relative to the Astro project root (template/) → repo-level /content
  loader: glob({ pattern: '**/*.md', base: '../content' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string().optional(),
  }),
});

export const collections = { pages };
```

- [ ] **Step 6: Commit**

```powershell
git add template/src/lib/paths.ts template/src/lib/paths.test.ts template/src/content.config.ts
git commit -m "feat: add path helpers (tested) and content collection"
```

---

### Task 3: Content stubs (en + ru)

Twelve Markdown stubs with valid frontmatter so the collection has data and the
build has pages. Bodies are short placeholders; real copy is a contributor task
later. `order` defines nav position.

**Files (create all):**
- `content/en/index.md`, `content/en/values.md`, `content/en/rules.md`, `content/en/trust.md`, `content/en/join.md`, `content/en/cohost.md`
- `content/ru/index.md`, `content/ru/values.md`, `content/ru/rules.md`, `content/ru/trust.md`, `content/ru/join.md`, `content/ru/cohost.md`

**Interfaces:**
- Produces collection ids `en/index … en/cohost`, `ru/index … ru/cohost`, each with `title` + `order`. Consumed by Task 4 routing/nav.

- [ ] **Step 1: Create the English stubs**

`content/en/index.md`:
```markdown
---
title: Manifesto
order: 1
description: Open the Third Door — the manifesto.
---

# Open the Third Door

This is the manifesto. Replace this body with real content.

## The Core

The home page ends with the Core.
```

`content/en/values.md`:
```markdown
---
title: Values
order: 2
---

# Values

Placeholder. Replace with real content.
```

`content/en/rules.md`:
```markdown
---
title: Rules
order: 3
---

# Rules

Placeholder. Replace with real content.
```

`content/en/trust.md`:
```markdown
---
title: Trust
order: 4
---

# Why should I trust you?

No, you don't. Placeholder — replace with real content.
```

`content/en/join.md`:
```markdown
---
title: Join
order: 5
---

# Join

Application (Google Form) + WhatsApp. Placeholder — replace with real content.
```

`content/en/cohost.md`:
```markdown
---
title: Co-host
order: 6
---

# Co-host guide

Placeholder. Replace with real content.
```

- [ ] **Step 2: Create the Russian mirrors**

`content/ru/index.md`:
```markdown
---
title: Манифест
order: 1
description: Open the Third Door — манифест.
---

# Open the Third Door

Это манифест. Замените текст на настоящий.

## Ядро

Главная страница заканчивается «Ядром».
```

`content/ru/values.md`:
```markdown
---
title: Ценности
order: 2
---

# Ценности

Заглушка. Замените на настоящий текст.
```

`content/ru/rules.md`:
```markdown
---
title: Правила
order: 3
---

# Правила

Заглушка. Замените на настоящий текст.
```

`content/ru/trust.md`:
```markdown
---
title: Доверие
order: 4
---

# Почему мне доверять?

No, you don't. Заглушка — замените на настоящий текст.
```

`content/ru/join.md`:
```markdown
---
title: Присоединиться
order: 5
---

# Присоединиться

Анкета (Google Form) + WhatsApp. Заглушка — замените на настоящий текст.
```

`content/ru/cohost.md`:
```markdown
---
title: Со-хост
order: 6
---

# Гайд для со-хоста

Заглушка. Замените на настоящий текст.
```

- [ ] **Step 3: Verify the collection sees all entries**

Run: `npm --prefix template exec astro -- sync`
Expected: completes without schema errors (`title`/`order` present on every file). A frontmatter mistake here would fail with a Zod error naming the file.

- [ ] **Step 4: Commit**

```powershell
git add content
git commit -m "content: add en/ru page stubs with frontmatter"
```

---

### Task 4: Layout, components, dynamic route — the rendered site

Everything visual plus the single route that turns the collection into pages.
Verified by a real `astro build` and checking the generated `dist` tree.

**Files:**
- Create: `template/src/styles/global.css`
- Create: `template/src/components/Header.astro`
- Create: `template/src/components/Footer.astro`
- Create: `template/src/components/Nav.astro`
- Create: `template/src/components/LangSwitch.astro`
- Create: `template/src/layouts/Base.astro`
- Create: `template/src/pages/[lang]/[...slug].astro`

**Interfaces:**
- Consumes from Task 2: `parseId`, `routeSlug`, `entryUrl`, `otherLang`, `LANGS`, `Lang`, collection `pages`.
- `Base.astro` props: `{ title: string; description?: string; lang: Lang; slug: string }`.
- `Nav.astro` props: `{ lang: Lang; current: string }` (`current` = route slug, `''` for home).
- `LangSwitch.astro` props: `{ lang: Lang; slug: string }`.

- [ ] **Step 1: Create global styles**

`template/src/styles/global.css`:
```css
:root {
  --maxw: 42rem;
  --fg: #1a1a1a;
  --bg: #ffffff;
  --muted: #666;
  --accent: #b8742a;
  color-scheme: light dark;
}
@media (prefers-color-scheme: dark) {
  :root { --fg: #ededed; --bg: #121212; --muted: #9a9a9a; }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  line-height: 1.6;
  color: var(--fg);
  background: var(--bg);
}
.wrap { max-width: var(--maxw); margin: 0 auto; padding: 1.5rem; }
header.site { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
header.site .brand { display: flex; align-items: center; gap: .5rem; font-weight: 600; text-decoration: none; color: inherit; }
header.site img { width: 32px; height: 32px; }
nav.main { display: flex; gap: 1rem; flex-wrap: wrap; }
nav.main a { text-decoration: none; color: var(--muted); }
nav.main a[aria-current="page"] { color: var(--accent); font-weight: 600; }
.lang-switch { margin-left: auto; }
.lang-switch a { color: var(--muted); text-decoration: none; }
main { margin: 2rem 0; }
footer.site { border-top: 1px solid #8884; margin-top: 3rem; padding-top: 1rem; color: var(--muted); font-size: .9rem; }
a { color: var(--accent); }
```

- [ ] **Step 2: Create `Nav.astro`**

`template/src/components/Nav.astro`:
```astro
---
import { getCollection } from 'astro:content';
import { parseId, routeSlug, entryUrl, type Lang } from '../lib/paths';

interface Props { lang: Lang; current: string }
const { lang, current } = Astro.props;

const entries = (await getCollection('pages'))
  .filter((e) => parseId(e.id).lang === lang)
  .sort((a, b) => a.data.order - b.data.order);
---
<nav class="main">
  {entries.map((e) => {
    const slug = parseId(e.id).slug;
    const href = entryUrl(lang, slug);
    const isCurrent = routeSlug(slug) === current;
    return <a href={href} aria-current={isCurrent ? 'page' : undefined}>{e.data.title}</a>;
  })}
</nav>
```

- [ ] **Step 3: Create `LangSwitch.astro`**

`template/src/components/LangSwitch.astro`:
```astro
---
import { entryUrl, otherLang, type Lang } from '../lib/paths';

interface Props { lang: Lang; slug: string }
const { lang, slug } = Astro.props;
const target = otherLang(lang);
const label = target.toUpperCase();
---
<div class="lang-switch">
  <a href={entryUrl(target, slug)} hreflang={target}>{label}</a>
</div>
```

- [ ] **Step 4: Create `Header.astro`**

`template/src/components/Header.astro`:
```astro
---
import Nav from './Nav.astro';
import LangSwitch from './LangSwitch.astro';
import { entryUrl, type Lang } from '../lib/paths';

interface Props { lang: Lang; slug: string }
const { lang, slug } = Astro.props;
const current = slug === 'index' ? '' : slug;
---
<header class="site">
  <a class="brand" href={entryUrl(lang, 'index')}>
    <img src="/images/logo.png" alt="Open the Third Door" />
    <span>Open the Third Door</span>
  </a>
  <Nav lang={lang} current={current} />
  <LangSwitch lang={lang} slug={slug} />
</header>
```

- [ ] **Step 5: Create `Footer.astro`**

`template/src/components/Footer.astro`:
```astro
---
---
<footer class="site">
  <p>Open the Third Door · content licensed CC BY-SA 4.0</p>
</footer>
```

- [ ] **Step 6: Create `Base.astro` layout**

`template/src/layouts/Base.astro`:
```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import type { Lang } from '../lib/paths';
import '../styles/global.css';

interface Props { title: string; description?: string; lang: Lang; slug: string }
const { title, description, lang, slug } = Astro.props;
---
<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · Open the Third Door</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div class="wrap">
      <Header lang={lang} slug={slug} />
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

- [ ] **Step 7: Create the dynamic route**

`template/src/pages/[lang]/[...slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import { parseId, routeSlug } from '../../lib/paths';
import Base from '../../layouts/Base.astro';

export async function getStaticPaths() {
  const entries = await getCollection('pages');
  return entries.map((entry) => {
    const { lang, slug } = parseId(entry.id);
    const r = routeSlug(slug);
    return {
      params: { lang, slug: r || undefined },
      props: { entry },
    };
  });
}

const { entry } = Astro.props;
const { lang, slug } = parseId(entry.id);
const { Content } = await render(entry);
---
<Base title={entry.data.title} description={entry.data.description} lang={lang} slug={slug}>
  <Content />
</Base>
```

- [ ] **Step 8: Build the site**

Run: `npm --prefix template run build`
Expected: build succeeds, no Zod/type errors.

- [ ] **Step 9: Verify the generated tree**

Run (PowerShell, from repo root):
```powershell
$d = "template/dist"
$paths = @(
  "$d/en/index.html", "$d/en/values/index.html", "$d/en/cohost/index.html",
  "$d/ru/index.html", "$d/ru/values/index.html",
  "$d/index.html", "$d/CNAME", "$d/favicon.ico", "$d/images/logo.png"
)
$missing = $paths | Where-Object { -not (Test-Path $_) }
if ($missing) { "MISSING:"; $missing } else { "OK: all expected files present" }
Get-Content "$d/CNAME"
```
Expected: `OK: all expected files present`; `CNAME` prints `openthethirddoor.org`. (`$d/index.html` is the `/ → /en` redirect page.)

- [ ] **Step 10: Spot-check the root redirect and a page**

Run (PowerShell):
```powershell
Select-String -Path "template/dist/index.html" -Pattern "/en" -SimpleMatch | Select-Object -First 1
Select-String -Path "template/dist/ru/index.html" -Pattern "Манифест" -SimpleMatch | Select-Object -First 1
```
Expected: root `index.html` references `/en` (redirect); `ru/index.html` contains the Russian title.

- [ ] **Step 11: Commit**

```powershell
git add template/src
git commit -m "feat: layout, components, and dynamic [lang] route rendering content"
```

---

### Task 5: Deploy workflow

GitHub Actions builds `template/` and publishes `template/dist` to Pages.

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `template/package-lock.json` (Task 1), buildable site (Task 4).
- Produces: Pages deployment from `template/dist`.

- [ ] **Step 1: Create the workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - "content/**"
      - "template/**"
      - ".github/workflows/deploy.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: template
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: template/package-lock.json
      - name: Install
        run: npm ci
      - name: Build
        run: npm run build
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: template/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate workflow YAML**

Run (PowerShell):
```powershell
npm --prefix template exec -- js-yaml ../.github/workflows/deploy.yml > $null; if ($?) { "YAML OK" }
```
If `js-yaml` is unavailable, instead confirm structure by eye: one `build` job (Node 20, `npm ci`, `npm run build`, upload `template/dist`) and one `deploy` job needing `build`.
Expected: no parse error.

- [ ] **Step 3: Commit and push**

```powershell
git add .github/workflows/deploy.yml
git commit -m "ci: deploy Astro site to GitHub Pages via Actions"
git push origin main
```

- [ ] **Step 4: Enable Pages source (manual, one-time)**

In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then watch the **Actions** tab for the `Deploy site to GitHub Pages` run to go green and verify https://openthethirddoor.org serves `/en`.

---

## Post-plan (separate commit, out of scope here)

Fill `README.md`, `LICENSE` (CC BY-SA 4.0 full text), `CONTRIBUTING.md` (frontmatter contract + content/design boundary), `CODE_OF_CONDUCT.md`. Tracked as the second milestone per the spec.

## Self-Review

- **Spec coverage:** content/design boundary (Tasks 1–4), `/content/{en,ru}` (Task 3), Content Layer glob loader (Task 2), single dynamic route (Task 4), i18n `/en`+`/ru` with `/`→`/en` (Task 1 config + Task 4 route, verified Step 9–10), auto nav + lang switch (Task 4), frontmatter contract `title`/`order`/`description?` (Task 2 schema + Task 3 data), deploy workflow + Pages source + CNAME (Tasks 1 & 5), output not committed (Task 1 `.gitignore`). Doc files explicitly deferred. All covered.
- **Placeholders:** none — every code/config step contains full content. Content bodies are intentional stubs (spec milestone 1), not plan placeholders.
- **Type consistency:** `parseId`/`routeSlug`/`entryUrl`/`otherLang`/`Lang`/`LANGS` defined in Task 2 and used with identical signatures in Task 4; `Base.astro` prop shape `{ title, description?, lang, slug }` matches its consumer in `[lang]/[...slug].astro`; collection schema `{ title, order, description? }` matches frontmatter in Task 3.
