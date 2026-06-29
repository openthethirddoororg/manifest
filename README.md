# Open the Third Door — manifest

Source for **[openthethirddoor.org](https://openthethirddoor.org)** — the public
site for *Another Way* / «Можно иначе», a live community for people who work with
people. We meet for live breakdowns: you bring a real knot from your work, and
together we find the lie hidden in the framing — the **third door** you couldn't
see from inside your own point of view.

## How it works

A static, multilingual site generated with [Astro](https://astro.build) from
Markdown and deployed to GitHub Pages. There is a deliberate split between
**content** and **design**:

| Folder        | Who owns it  | What's in it                                       |
|---------------|--------------|----------------------------------------------------|
| `content/`    | contributors | Page content in Markdown, one folder per language  |
| `template/`   | maintainer   | The Astro project: layout, components, CSS, config |

Navigation and the language switch are generated from the content, so adding a
page or a language never requires touching the design. To build the site
locally, see **[DEVELOPMENT.md](DEVELOPMENT.md)**.

## Contributing

The words on this site are the point, and we'd love your help with them. There
are two ways in — pick either, no coding required:

- **🌍 Localize it.** Add your language by translating the pages into a new
  `content/<your-language>/` folder. The site picks it up automatically.
- **✍️ Improve the manifesto.** The **English** text is the central, canonical
  version — the source every translation follows. Propose changes to the meaning
  there, and translations can follow.

### Localizations

| Language | Code | Status                |
|----------|------|-----------------------|
| English  | `en` | Canonical source      |
| Russian  | `ru` | Complete              |

Want to see your language here? Open an issue or a pull request — start from the
English pages in `content/en/` as the reference.

The how-to (frontmatter, file naming, the content/design boundary) lives in
**[CONTRIBUTING.md](CONTRIBUTING.md)**. Please also read the
**[Code of Conduct](CODE_OF_CONDUCT.md)**.

## License

Content and documentation are licensed under
**[Creative Commons Attribution-ShareAlike 4.0 International](LICENSE)** (CC BY-SA 4.0).
Share and adapt freely, with attribution, under the same license.
