# Development

This site is built with [Astro](https://astro.build) and deployed to GitHub
Pages by GitHub Actions. You only need this document if you're building the site
locally or working on its code — contributors who only edit content don't need
any of it (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Requirements

Node 20+ (CI builds on Node 22).

## Commands

All commands run from `template/`, the Astro project root:

```bash
cd template
npm install
npm run dev      # local dev server with hot reload (http://localhost:4321)
npm run build    # build the static site into template/dist
npm run preview  # serve the built dist locally
npm test         # run unit tests (Vitest)
```

> Always run Astro from `template/` (or use the VS Code tasks in `.vscode/`).
> Running it from the repo root generates a stray `.astro/` with wrong paths.

## Project layout

| Path            | What it is                                                   |
|-----------------|-------------------------------------------------------------|
| `content/<lang>/*.md` | Page content, one file per page (contributor-owned)   |
| `template/`     | The Astro project: layout, components, styles, config       |
| `template/public/` | Static assets copied to the site root (CNAME, favicon, images) |

Locales are derived from the folders under `content/` — add `content/<lang>/`
and that language joins the site automatically. `content/en` is required (the
default locale); a missing `content/en` fails the build on purpose.

Navigation and the language switch are generated from the content collection,
so adding a page or a language never requires touching `template/`.

## Deploy

The generated site (`template/dist`) is **not** committed. On every push to
`main`, the [`deploy.yml`](.github/workflows/deploy.yml) workflow builds
`template/` and publishes it to GitHub Pages.

Repo setting (one-time): **Settings → Pages → Source → GitHub Actions**.
`template/public/CNAME` carries the custom domain into the published site.
