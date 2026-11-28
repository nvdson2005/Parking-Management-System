// Converts the report / product Markdown files into formal DOCX documents
// (Times New Roman, A4, cover page, TOC, numbered figures, shaded table headers, page numbers).
// Requires the `docx` npm package. If it is not resolvable from the repo, set DOCX_MODULE_DIR
// to a folder containing node_modules/docx.
// Usage: node docs/m2-report/scripts/to-docx.mjs <input.md> <output.docx> [--keep-review]
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const reportRoot = join(here, '..');
let docx;
try { docx = createRequire(import.meta.url)('docx'); } catch {
  docx = createRequire(join(process.env.DOCX_MODULE_DIR || '.', 'package.json'))('docx');
}
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, ImageRun, Footer, PageNumber, TableOfContents, PageBreak,
  PageOrientation, LevelFormat, VerticalAlign,
} = docx;

const [, , inFile, outFile, ...flags] = process.argv;
if (!inFile || !outFile) { console.error('usage: to-docx.mjs <in.md> <out.docx>'); process.exit(1); }
let md = readFileSync(inFile, 'utf8');
if (!flags.includes('--keep-review')) md = md.replace(/<!-- REVIEW-INDEX-START -->[\s\S]*?<!-- REVIEW-INDEX-END -->\n?/, '');
md = md.replace(/<!--[\s\S]*?-->/g, '');
const lines = md.split('\n');

const FONT = 'Times New Roman';
const BODY = 26; // 13 pt
const A4 = { width: 11906, height: 16838 };
const MARGIN = 1134; // 2 cm
const PORTRAIT_W = A4.width - 2 * MARGIN;
const LANDSCAPE_W = A4.height - 2 * MARGIN;
const PX_PER_DXA = 96 / 1440;

const CAPTIONS = {
  '01-pbs': 'Cấu trúc phân rã sản phẩm (PBS)',
  '02-pfd': 'Sơ đồ luồng sản phẩm (PFD)',
  '03-activity-network': 'Mạng hoạt động lý tưởng',
  '04-gantt': 'Biểu đồ Gantt theo lịch đã cân bằng nguồn lực',
  '05-critical-path': 'Mạng hoạt động và đường găng (CPM)',
  '06-risk-matrix': 'Ma trận rủi ro mức hoạt động (L × I)',
  '07-erd': 'Mô hình thực thể - quan hệ (ERD)',
};

// ---------- inline formatting ----------
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0, m;
  const push = (t, o = {}) => t && out.push(new TextRun({ text: t, font: FONT, ...base, ...o }));
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('`')) push(tok.slice(1, -1), { font: 'Courier New', size: base.size ? base.size - 2 : BODY - 4 });
    else push(tok.slice(1, -1), { italics: true });
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out.length ? out : [new TextRun({ text: '', font: FONT, ...base })];
}
const para = (text, opts = {}, runOpts = {}) => new Paragraph({ children: runs(text, runOpts), spacing: { after: 120, line: 300 }, ...opts });

// ---------- tables ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: '808080' };
const borders = { top: border, bottom: border, left: border, right: border };
function splitRow(l) { return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()); }
function buildTable(rows, totalW) {
  const n = Math.max(...rows.map((r) => r.length));
  rows = rows.map((r) => [...r, ...Array(n - r.length).fill('')]);
  const size = n >= 8 ? 20 : n >= 6 ? 22 : 24; // 10 / 11 / 12 pt
  // column widths ∝ sqrt of the longest cell, with a floor
  const weight = Array.from({ length: n }, (_, c) => Math.max(4, Math.sqrt(Math.max(...rows.map((r) => r[c].length)))));
  const sum = weight.reduce((a, b) => a + b, 0);
  const widths = weight.map((w) => Math.floor((w / sum) * totalW));
  widths[n - 1] += totalW - widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, ri) => new TableRow({
      tableHeader: ri === 0,
      cantSplit: false,
      children: r.map((cell, ci) => new TableCell({
        width: { size: widths[ci], type: WidthType.DXA },
        borders,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        shading: ri === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: 'D9E2F3' } : undefined,
        children: [new Paragraph({ children: runs(cell, { size, bold: ri === 0 ? true : undefined }), spacing: { after: 0, line: 260 } })],
      })),
    })),
  });
}

// ---------- images ----------
function pngSize(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
let figNo = 0;
function figure(pngRel, contentW) {
  const file = resolve(reportRoot, pngRel);
  const data = readFileSync(file);
  const { w, h } = pngSize(data);
  const maxW = Math.floor(contentW * PX_PER_DXA);
  const maxH = contentW === LANDSCAPE_W ? 560 : 900;
  let width = maxW, height = Math.round((h / w) * maxW);
  if (height > maxH) { height = maxH; width = Math.round((w / h) * maxH); }
  figNo++;
  const key = pngRel.split('/').pop().replace(/\.png$/, '');
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 }, children: [new ImageRun({ type: 'png', data, transformation: { width, height } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Hình ${figNo}. ${CAPTIONS[key] || key}`, font: FONT, italics: true, size: 24 })] }),
  ];
}

// ---------- parse ----------
const h1Idx = lines.map((l, i) => (/^# /.test(l) ? i : -1)).filter((i) => i >= 0);
const shiftUntil = h1Idx.length > 1 ? h1Idx[1] : lines.length; // promote headings before the 2nd H1
const HL = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4];

const sections = []; // { landscape, children }
let cur = { landscape: false, children: [] };
const add = (...x) => cur.children.push(...x);
const newSection = (landscape) => { if (cur.children.length) sections.push(cur); cur = { landscape, children: [] }; };

// cover: title lines up to the first table or the first section heading; an info table that
// directly follows the title lines also goes on the cover. TOC follows on its own page.
const SECTION = /^#+\s+(\d+[.\s]|Kiểm soát tài liệu|Lịch sử phiên bản|Định danh)/;
const clean = (t) => t.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/`/g, '');
let i = 0;
const cover = [];
while (i < lines.length && !lines[i].startsWith('|') && !SECTION.test(lines[i])) {
  if (lines[i].trim() && !/^-{3,}\s*$/.test(lines[i].trim())) cover.push(lines[i]);
  i++;
}
add(new Paragraph({ spacing: { before: 1800 } }));
cover.forEach((l, k) => {
  const size = k === 0 ? 32 : k === 1 ? 36 : 28;
  add(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: clean(l), font: FONT, bold: k < 3, size })] }));
});
add(new Paragraph({ spacing: { after: 600 } }));
if (i < lines.length && lines[i].startsWith('|')) {
  const rows = [];
  while (i < lines.length && lines[i].startsWith('|')) { if (!/^\|\s*:?-{2,}/.test(lines[i])) rows.push(splitRow(lines[i])); i++; }
  add(buildTable(rows, PORTRAIT_W));
}
add(new Paragraph({ children: [new PageBreak()] }));
add(new Paragraph({ children: [new TextRun({ text: 'MỤC LỤC', font: FONT, bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 240 } }));
add(new TableOfContents('Mục lục', { hyperlink: true, headingStyleRange: '1-3' }));
add(new Paragraph({ children: [new PageBreak()] }));

let firstTableDone = true;
let bullets = [];
const flushBullets = () => { bullets.forEach((b) => add(b)); bullets = []; };
while (i < lines.length) {
  const l = lines[i];
  if (l.startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) {
      if (!/^\|\s*:?-{2,}/.test(lines[i])) rows.push(splitRow(lines[i]));
      i++;
    }
    flushBullets();
    add(buildTable(rows, cur.landscape ? LANDSCAPE_W : PORTRAIT_W));
    add(new Paragraph({ spacing: { after: 120 } }));
    if (!firstTableDone) {
      firstTableDone = true;
      add(new Paragraph({ children: [new PageBreak()] }));
      add(new Paragraph({ children: [new TextRun({ text: 'MỤC LỤC', font: FONT, bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 240 } }));
      add(new TableOfContents('Mục lục', { hyperlink: true, headingStyleRange: '1-3' }));
      add(new Paragraph({ children: [new PageBreak()] }));
    }
    continue;
  }
  const h = l.match(/^(#{1,4})\s+(.*)$/);
  if (h) {
    flushBullets();
    let level = h[1].length - 1 - (i < shiftUntil ? 1 : 0);
    level = Math.max(0, Math.min(3, level));
    if (level === 0 && sections.length + cur.children.length > 0 && i >= shiftUntil) add(new Paragraph({ children: [new PageBreak()] }));
    add(new Paragraph({ heading: HL[level], children: [new TextRun({ text: clean(h[2]), font: FONT })] }));
    i++; continue;
  }
  if (l.startsWith('>')) {
    const block = [];
    while (i < lines.length && lines[i].startsWith('>')) { block.push(lines[i].replace(/^>\s?/, '')); i++; }
    const png = block.join(' ').match(/`(diagrams\/[^`]+\.png)`/);
    flushBullets();
    if (png) {
      const { w, h: hh } = pngSize(readFileSync(resolve(reportRoot, png[1])));
      if (w / hh > 2.2) { newSection(true); add(...figure(png[1], LANDSCAPE_W)); newSection(false); }
      else add(...figure(png[1], PORTRAIT_W));
    } else block.forEach((b) => add(para(b, { indent: { left: 400 } }, { italics: true })));
    continue;
  }
  const li = l.match(/^\s*[-•]\s+(\[( |x)\]\s+)?(.*)$/);
  if (li) {
    const mark = li[1] ? (li[2] === 'x' ? '☑ ' : '☐ ') : '';
    bullets.push(new Paragraph({ numbering: li[1] ? undefined : { reference: 'bul', level: 0 }, indent: li[1] ? { left: 360 } : undefined, spacing: { after: 60, line: 300 }, children: runs(mark + li[3]) }));
    i++; continue;
  }
  flushBullets();
  if (l.trim() && !/^-{3,}$/.test(l.trim())) add(para(l.trim(), { alignment: AlignmentType.JUSTIFIED }));
  i++;
}
flushBullets();
sections.push(cur);

const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Trang ', PageNumber.CURRENT], font: FONT, size: 22 })] })] });
const headingStyle = (size, before, after) => ({ run: { font: FONT, size, bold: true, color: '000000' }, paragraph: { spacing: { before, after }, keepNext: true } });
const doc = new Document({
  features: { updateFields: true },
  creator: 'Nhóm 11 - CO3011',
  styles: {
    default: {
      document: { run: { font: FONT, size: BODY } },
      heading1: headingStyle(32, 360, 180),
      heading2: headingStyle(28, 240, 120),
      heading3: headingStyle(26, 200, 100),
      heading4: { ...headingStyle(26, 160, 80), run: { font: FONT, size: 26, bold: true, italics: true, color: '000000' } },
    },
  },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: sections.map((s) => ({
    properties: { page: { size: { ...A4, orientation: s.landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    footers: { default: footer },
    children: s.children,
  })),
});
writeFileSync(outFile, await Packer.toBuffer(doc));
console.log(`wrote ${outFile} (${figNo} figures, ${sections.length} sections)`);
