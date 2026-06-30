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

Content lives in `content/<lang>/`, one Markdown file per page. **English
(`content/en/`) is the canonical source** that every translation follows;
Russian (`content/ru/`) is complete. To add a new language, see
[Adding a language](#adding-a-language) below.

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
- **Keep filenames in sync across languages.** The language switch shows every
  language; a page links to its translation when the same filename exists in the
  other language, otherwise to that language's home. So `content/en/values.md`
  should have a matching `content/ru/values.md`.
- **Don't edit `template/`** unless you mean to change the design.

### Quotes

For a styled quote, use a Markdown blockquote and put the attribution in a
**second paragraph** (a blank `>` line between them). Don't add a dash — it's
added automatically, and the attribution renders smaller and muted:

```markdown
> There is a crack in everything. That's how the light gets in.
>
> Leonard Cohen, "Anthem"
```

## Adding a language

1. Create `content/<code>/` (e.g. `content/de/`), where `<code>` is the locale code.
2. Translate the pages from `content/en/`, keeping the **same filenames** so links line up.
3. Keep each file's `order`; translate `title`, `description`, and the body.

That's all — the new language appears in the site and the language switch
automatically. English must always exist (it is the default locale); every other
language is optional and added this way.

## Proposing a change to the manifesto

The English text is canonical, so changes to **meaning** start there; translations
follow.

1. Edit the relevant Markdown file(s) under `content/en/` (and matching translations if you can).
2. Open a pull request describing what changed and why.
3. If you found a problem with the participation rules themselves, raise it
   **between meetings** (an issue or a message to the host) — not in the middle of
   a session. See the rules page on the site.

## Building locally (optional)

You don't need to run anything to contribute content — a maintainer and CI verify
the build. If you want to preview locally, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Conduct

Participation here follows our [Code of Conduct](CODE_OF_CONDUCT.md): honesty over
comfort, kindness, confidentiality, and no selling or recruiting.
