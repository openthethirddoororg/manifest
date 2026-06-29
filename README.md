# Open the Third Door — website

Source for **[openthethirddoor.org](https://openthethirddoor.org)** — the public
site for *Another Way* / «Можно иначе», a live community for people who work with
people. We meet for live breakdowns: you bring a real knot from your work, and
together we find the lie hidden in the framing — the **third door** you couldn't
see from inside your own point of view.

## How the site is built

A static site generated with [Astro](https://astro.build) from Markdown, deployed
to GitHub Pages via GitHub Actions. There is a deliberate split between **content**
and **design**:

| Folder        | Who owns it  | What's in it                                        |
|---------------|--------------|-----------------------------------------------------|
| `content/`    | contributors | Page content in Markdown (`title` + `order` only)   |
| `template/`   | maintainer   | The Astro project: layout, components, CSS, config  |

Content lives in `content/<lang>/*.md`. Each file becomes a page; navigation and
the language switch are generated from the files automatically, so adding a page
never requires touching `template/`. Today only Russian (`content/ru/`) is
published; English (`content/en/`) will follow.

## Working on it locally

Requires Node 20+. All commands run from `template/`:

```bash
cd template
npm install
npm run dev      # local dev server with hot reload
npm run build    # build static site into template/dist
npm test         # run unit tests (Vitest)
```

> Always run Astro from `template/` (or use the VS Code tasks in `.vscode/`).
> Running it from the repo root generates a stray `.astro/` with wrong paths.

The generated site (`template/dist`) is **not** committed — GitHub Actions builds
and publishes it on every push to `main`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: edit Markdown in
`content/<lang>/` only, keep the `title` + `order` frontmatter, and leave the
design to `template/`. Please also read the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Content and documentation are licensed under
**[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE)** (CC BY-SA 4.0).
Share and adapt freely, with attribution, under the same license.
