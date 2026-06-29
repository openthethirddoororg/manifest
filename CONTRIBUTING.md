# Contributing

Thank you for helping shape this site. The most important thing to understand is
the **content ↔ design boundary**.

## The boundary

| You want to…                          | Edit…                          |
|---------------------------------------|--------------------------------|
| Change wording, add or remove a page  | `content/<lang>/*.md` only     |
| Change layout, styling, components    | `template/` (maintainer-owned) |

If you're contributing **meaning** (the words people read), you only ever touch
`content/`. You never need to open `template/`. The design — layout, typography,
colors, navigation — is owned by the maintainer so the site stays coherent.

## Editing content

Content lives in `content/<lang>/`, one Markdown file per page. Currently the
published language is Russian (`content/ru/`). English (`content/en/`) is planned.

Every content file **must** start with frontmatter:

```yaml
---
title: Values          # page heading and navigation label
order: 2               # position in the navigation (1, 2, 3, …)
description: ...        # optional — used for the page <meta> description
---
```

Then write the page body in normal Markdown.

Rules:

- **`title` and `order` are required.** A missing or malformed field fails the
  build with a clear error — that's intentional, it stops broken pages shipping.
- **Navigation is automatic.** The menu is built from the files, ordered by
  `order`. Add a file → it appears. No code change needed.
- **Keep filenames in sync across languages.** The language switch links a page
  to the same filename in the other language and only appears when that mirror
  exists. So `content/en/values.md` should match `content/ru/values.md`.
- **Don't edit `template/`** unless you mean to change the design.

## Proposing a change

1. Edit the relevant Markdown file(s) under `content/<lang>/`.
2. Open a pull request describing what changed and why.
3. If you found a problem with the participation rules themselves, raise it
   **between meetings** (an issue or a message to the host) — not in the middle of
   a session. See the rules page on the site.

## Running it before you submit (optional)

If you have Node 20+ installed, you can preview locally:

```bash
cd template
npm install
npm run dev
```

But you don't need to run anything to contribute content — a maintainer and CI
will verify the build.

## Conduct

Participation here follows our [Code of Conduct](CODE_OF_CONDUCT.md): honesty over
comfort, kindness, confidentiality, and no selling or recruiting.
