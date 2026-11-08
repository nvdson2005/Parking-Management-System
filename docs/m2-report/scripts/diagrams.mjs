// Generates the six report diagrams as native draw.io XML from plan.mjs + generated/schedule.json.
// Run after schedule.mjs. Usage: node docs/m2-report/scripts/diagrams.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as plan from '../data/plan.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'diagrams');
mkdirSync(outDir, { recursive: true });
const sched = JSON.parse(readFileSync(join(root, 'generated', 'schedule.json'), 'utf8'));
const byId = Object.fromEntries(sched.activities.map((a) => [a.id, a]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = 'fontFamily=Times New Roman;';
function doc(cells) {
  return `<mxfile host="drawio"><diagram name="Page-1"><mxGraphModel adaptiveColors="auto" grid="0" page="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
}
const box = (id, label, x, y, w, h, style) =>
  `<mxCell id="${esc(id)}" value="${esc(label)}" style="${FONT}whiteSpace=wrap;html=1;${style}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
let eid = 0;
const edge = (s, t, style = '') =>
  `<mxCell id="e${eid++}" style="${FONT}edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endSize=6;strokeColor=#555555;${style}" edge="1" parent="1" source="${esc(s)}" target="${esc(t)}"><mxGeometry relative="1" as="geometry"/></mxCell>`;
const write = (name, cells) => { writeFileSync(join(outDir, name), doc(cells)); console.log('wrote diagrams/' + name); };

const C = {
  deliver: 'fillColor=#DCFCE7;strokeColor=#16A34A;',
  inter: 'fillColor=#DBEAFE;strokeColor=#2563EB;',
  mgmt: 'fillColor=#FEF3C7;strokeColor=#D97706;',
  deferred: 'fillColor=#F3F4F6;strokeColor=#9CA3AF;fontColor=#6B7280;dashed=1;',
  done: 'fillColor=#FFFFFF;strokeColor=#6B7280;dashed=1;',
  root: 'fillColor=#1F2937;strokeColor=#111827;fontColor=#FFFFFF;fontStyle=1;',
  crit: 'fillColor=#FEE2E2;strokeColor=#DC2626;strokeWidth=2;',
  normal: 'fillColor=#FFFFFF;strokeColor=#374151;',
  cp: 'fillColor=#EDE9FE;strokeColor=#7C3AED;',
};
const prodStyle = (p) => (p.status === 'deferred' ? C.deferred : p.status === 'done' ? C.done : p.group === 'PG-3' ? C.mgmt : p.type === 'D' ? C.deliver : C.inter);

// ---------- 01 PBS ----------
{
  eid = 0;
  const cells = [];
  const W = 200, H = 52, GAP = 30;
  const groups = plan.productGroups;
  const colW = W + 40;
  const totalW = groups.length * colW;
  const rootP = plan.products.find((p) => p.id === 'P00');
  cells.push(box('P00', `P00\n${rootP.name}`.replace('\n', '<br>'), totalW / 2 - 140, 0, 280, 60, C.root));
  groups.forEach((g, i) => {
    const x = i * colW;
    cells.push(box(g.id, `<b>${g.id}</b><br>${g.name}`, x, 120, W, H, 'fillColor=#E5E7EB;strokeColor=#374151;'));
    cells.push(edge('P00', g.id, 'edgeStyle=orthogonalEdgeStyle;'));
    plan.products.filter((p) => p.group === g.id).forEach((p, j) => {
      const label = `<b>${p.id}</b> ${p.name}${p.status === 'deferred' ? '<br><i>(hoãn, Q22)</i>' : p.status === 'done' ? '<br><i>(đã hoàn thành)</i>' : p.inc ? `<br><i>Inc ${p.inc}</i>` : ''}`;
      cells.push(box(p.id, label, x + 20, 210 + j * (H + 14), W - 20, H, prodStyle(p)));
      cells.push(edge(g.id, p.id, 'exitX=0;exitY=0.5;entryX=0;entryY=0.5;exitDx=10;'));
    });
  });
  const ly = 210 + 9 * 66 + 20;
  cells.push(box('lg1', 'Bàn giao (phần mềm, tài liệu)', 0, ly, 190, 30, C.deliver));
  cells.push(box('lg2', 'Trung gian', 200, ly, 120, 30, C.inter));
  cells.push(box('lg3', 'Quản lý dự án', 330, ly, 130, 30, C.mgmt));
  cells.push(box('lg4', 'Hoãn theo Q22', 470, ly, 130, 30, C.deferred));
  cells.push(box('lg5', 'Đã hoàn thành trước 09/11', 610, ly, 180, 30, C.done));
  write('01-pbs.drawio', cells);
}

// ---------- 02 PFD ----------
{
  eid = 0;
  const cells = [];
  const used = new Set(plan.productFlows.flat());
  const ids = plan.products.filter((p) => used.has(p.id)).map((p) => p.id);
  const level = {};
  const lv = (id) => {
    if (level[id] !== undefined) return level[id];
    const ins = plan.productFlows.filter(([, t]) => t === id).map(([s]) => s);
    return (level[id] = ins.length ? 1 + Math.max(...ins.map(lv)) : 0);
  };
  ids.forEach(lv);
  const cols = {};
  ids.forEach((id) => (cols[level[id]] ||= []).push(id));
  Object.entries(cols).forEach(([l, list]) => list.forEach((id, i) => {
    const p = plan.products.find((x) => x.id === id);
    cells.push(box(id, `<b>${id}</b><br>${p.name}`, Number(l) * 230, i * 90, 180, 60, prodStyle(p)));
  }));
  plan.productFlows.forEach(([s, t]) => cells.push(edge(s, t)));
  write('02-pfd.drawio', cells);
}

// ---------- 03 activity network (ideal, layered by dependency depth) & 05 CPM ----------
const net = sched.activities.filter((a) => !a.fixed);
const depth = {};
const dp = (id) => depth[id] ?? (depth[id] = Math.max(0, ...byId[id].pred.filter((p) => !byId[p].fixed).map((p) => dp(p) + 1)));
net.forEach((a) => dp(a.id));
const layers = {};
net.forEach((a) => (layers[depth[a.id]] ||= []).push(a));
// order each layer by the barycentre of its predecessors' rows to reduce edge crossings
const rowOf = {};
Object.keys(layers).map(Number).sort((a, b) => a - b).forEach((d) => {
  const list = layers[d];
  const key = (a) => {
    const ps = a.pred.filter((p) => !byId[p].fixed && rowOf[p] !== undefined);
    return ps.length ? ps.reduce((s, p) => s + rowOf[p], 0) / ps.length : a.ES;
  };
  list.sort((x, y) => key(x) - key(y) || x.ES - y.ES);
  list.forEach((a, i) => (rowOf[a.id] = i));
});
const f = (x) => (Math.round(x * 100) / 100).toString().replace('.', ',');
const straight = 'edgeStyle=none;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;';
function network(name, labelFn, styleFn, edgeStyleFn) {
  eid = 0;
  const cells = [];
  Object.entries(layers).forEach(([d, list]) => list.forEach((a, i) => {
    cells.push(box(a.id, labelFn(a), Number(d) * 290, i * 120, 190, 84, styleFn(a)));
  }));
  net.forEach((a) => a.pred.filter((p) => !byId[p].fixed).forEach((p) => cells.push(edge(p, a.id, straight + 'opacity=70;' + edgeStyleFn(byId[p], a)))));
  const ly = Math.max(...Object.values(layers).map((l) => l.length)) * 120 + 20;
  cells.push(box('lgA', 'Hoạt động thường', 0, ly, 150, 30, C.normal));
  cells.push(box('lgB', 'Checkpoint (CP)', 160, ly, 150, 30, C.cp));
  cells.push(box('lgC', 'Đường găng', 320, ly, 150, 30, C.crit));
  write(name, cells);
}
network('03-activity-network.drawio',
  (a) => `<b>${a.id}</b>${a.cp ? ` [${a.cp}]` : ''}<br>${a.name}<br><i>E = ${f(a.E)} h</i>`,
  (a) => (a.cp ? C.cp : C.normal), () => '');
network('05-critical-path.drawio',
  (a) => `<b>${a.id}</b> (${f(a.dur)} ngày)<br>ES ${f(a.ES)} | EF ${f(a.EF)}<br>LS ${f(a.LS)} | LF ${f(a.LF)}<br>Float ${f(a.TF)}`,
  (a) => (a.critical ? C.crit : C.normal),
  (p, a) => (p.critical && a.critical && Math.abs(p.EF - a.ES) < 1e-6 ? 'strokeColor=#DC2626;strokeWidth=2;' : ''));

// ---------- 04 Gantt (levelled, day grid) ----------
{
  eid = 0;
  const cells = [];
  const LW = 330, DW = 38, RH = 24, TOP = 50;
  const days = sched.days;
  days.forEach((d, i) => {
    cells.push(box(`d${i}`, d.date, LW + i * DW, 24, DW, 24, 'fillColor=#F3F4F6;strokeColor=#D1D5DB;fontSize=9;'));
  });
  [...new Set(days.map((d) => d.week))].forEach((w) => {
    const first = days.findIndex((d) => d.week === w);
    cells.push(box(`w${w}`, w, LW + first * DW, 0, DW * 5, 24, 'fillColor=#E5E7EB;strokeColor=#9CA3AF;fontStyle=1;fontSize=10;'));
  });
  const rows = [...sched.activities].sort((x, y) => x.lvStart - y.lvStart || x.lvFinish - y.lvFinish);
  rows.forEach((a, i) => {
    const y = TOP + i * RH;
    cells.push(box(`l${a.id}`, `${a.id} ${a.name}`, 0, y, LW, RH, 'fillColor=none;strokeColor=#E5E7EB;align=left;spacingLeft=4;fontSize=9;'));
    const x = LW + a.lvStart * DW;
    const w = Math.max(6, (a.lvFinish - a.lvStart) * DW);
    const st = a.fixed ? 'fillColor=#D1D5DB;strokeColor=#9CA3AF;' : a.critical ? 'fillColor=#DC2626;strokeColor=#991B1B;' : 'fillColor=#2563EB;strokeColor=#1E40AF;';
    cells.push(box(`b${a.id}`, '', x, y + 5, w, RH - 10, st + 'rounded=1;'));
  });
  const y0 = TOP + rows.length * RH + 8;
  plan.milestones.forEach((m, i) => {
    const y = y0 + i * RH;
    const dl = m.date ? `${m.date.slice(8, 10)}/${m.date.slice(5, 7)}` : null;
    const fin = m.after.length ? Math.max(...m.after.map((x) => byId[x].lvFinish)) : 0;
    const idx = dl ? days.findIndex((d) => d.date === dl) : Math.ceil(fin) - 1;
    const x = idx >= 0 ? LW + idx * DW + DW / 2 - 8 : LW + days.length * DW + 4;
    cells.push(box(`lm${m.id}`, `${m.id} ${m.name}${idx < 0 ? ` (${dl})` : ''}`, 0, y, LW, RH, 'fillColor=none;strokeColor=#E5E7EB;align=left;spacingLeft=4;fontSize=9;fontStyle=1;'));
    cells.push(box(`m${m.id}`, '', x, y + 4, 16, 16, 'rhombus;fillColor=#111827;strokeColor=#111827;'));
  });
  const ly = y0 + plan.milestones.length * RH + 16;
  cells.push(box('g1', 'Hoạt động găng', 0, ly, 120, 22, 'fillColor=#DC2626;fontColor=#FFFFFF;strokeColor=none;fontSize=10;'));
  cells.push(box('g2', 'Hoạt động có float', 130, ly, 130, 22, 'fillColor=#2563EB;fontColor=#FFFFFF;strokeColor=none;fontSize=10;'));
  cells.push(box('g3', 'Việc định kỳ', 270, ly, 110, 22, 'fillColor=#D1D5DB;strokeColor=none;fontSize=10;'));
  cells.push(box('g4', '◆ Mốc', 390, ly, 70, 22, 'fillColor=none;strokeColor=none;fontSize=10;'));
  write('04-gantt.drawio', cells);
}

// ---------- 06 risk matrix ----------
{
  eid = 0;
  const cells = [];
  const S = 110;
  const color = (s) => (s >= 15 ? '#FCA5A5' : s >= 10 ? '#FDBA74' : s >= 5 ? '#FDE68A' : '#BBF7D0');
  for (let L = 5; L >= 1; L--) {
    cells.push(box(`L${L}`, `L = ${L}`, 0, (5 - L) * S + 30, 60, S, 'fillColor=none;strokeColor=none;fontStyle=1;'));
    for (let I = 1; I <= 5; I++) {
      const ids = plan.risks.filter((r) => r.L === L && r.I === I).map((r) => r.id);
      cells.push(box(`c${L}${I}`, `<font color="#6B7280">${L * I}</font><br>${ids.join('<br>')}`, 60 + (I - 1) * S, (5 - L) * S + 30, S, S, `fillColor=${color(L * I)};strokeColor=#FFFFFF;verticalAlign=top;fontSize=10;`));
    }
  }
  for (let I = 1; I <= 5; I++) cells.push(box(`I${I}`, `I = ${I}`, 60 + (I - 1) * S, 5 * S + 30, S, 26, 'fillColor=none;strokeColor=none;fontStyle=1;'));
  cells.push(box('t', 'Ma trận rủi ro mức hoạt động (L × I)', 60, 0, 5 * S, 26, 'fillColor=none;strokeColor=none;fontStyle=1;fontSize=13;'));
  write('06-risk-matrix.drawio', cells);
}
