/**
 * Pipe callouts.
 *
 * A top-level block where every line starts with `|` becomes a highlighted,
 * rounded box (`<div class="callout">`). An empty `|` line is a paragraph
 * break inside the box. Normal Markdown works inside (bold, links, lists…).
 *
 *   | First paragraph, with **bold** if you like.
 *   |
 *   | Second paragraph.
 *
 * Safe next to GFM tables: a real table has a delimiter row (`| --- |`) and is
 * already parsed as a table node, so only non-table `|` blocks (paragraphs)
 * are matched here.
 */
export default function remarkCallout() {
  const self = this;
  return (tree, file) => {
    const source = String(file.value);
    const children = tree.children;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type !== 'paragraph') continue;
      const offset = node.position?.start?.offset;
      const endOffset = node.position?.end?.offset;
      if (offset == null || endOffset == null) continue;

      const raw = source.slice(offset, endOffset);
      const lines = raw.split('\n');
      if (lines.length === 0 || !lines.every((line) => /^\s*\|/.test(line))) continue;

      const inner = lines.map((line) => line.replace(/^\s*\|[ \t]?/, '')).join('\n');
      const parsed = self.parse(inner);

      children[i] = {
        type: 'callout',
        data: { hName: 'div', hProperties: { className: ['callout'] } },
        children: parsed.children,
      };
    }
  };
}
