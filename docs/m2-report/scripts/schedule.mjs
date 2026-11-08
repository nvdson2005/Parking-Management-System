// Validates plan.mjs, runs CPM on the ideal network, levels resources day by day,
// and writes markdown tables + schedule.json into ../generated.
// Usage: node docs/m2-report/scripts/schedule.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as plan from '../data/plan.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'generated');
mkdirSync(outDir, { recursive: true });

const r2 = (x) => Math.round(x * 100) / 100;
const fmt = (x) => r2(x).toString().replace('.', ',');
const errors = [];

// ---------- effort ----------
const acts = plan.activities.map((a) => {
  let E, sigma = null;
  if (a.est) {
    E = (a.est.o + 4 * a.est.m + a.est.p) / 6;
    sigma = (a.est.p - a.est.o) / 6;
  } else E = a.allowance;
  return { ...a, E, sigma };
});
const byId = Object.fromEntries(acts.map((a) => [a.id, a]));
const resIds = plan.resources.map((r) => r.id);
const prodIds = new Set(plan.products.map((p) => p.id));
const cpIds = new Set(plan.checkpoints.map((c) => c.id));

// ---------- validation ----------
for (const a of acts) {
  if (!prodIds.has(a.product)) errors.push(`${a.id}: unknown product ${a.product}`);
  for (const p of a.pred) if (!byId[p]) errors.push(`${a.id}: unknown predecessor ${p}`);
  if (a.cp && !cpIds.has(a.cp)) errors.push(`${a.id}: unknown checkpoint ${a.cp}`);
  if (!a.fixed) {
    const s = Object.values(a.assign || {}).reduce((x, y) => x + y, 0);
    if (Math.abs(s - 1) > 1e-6) errors.push(`${a.id}: assignment shares sum to ${s}`);
    for (const r of Object.keys(a.assign)) if (!resIds.includes(r)) errors.push(`${a.id}: unknown resource ${r}`);
  } else {
    const per = Object.values(a.fixed.hoursPerWeek).reduce((x, y) => x + y, 0) * a.fixed.weeks.length;
    if (Math.abs(per - a.E) > 1e-6) errors.push(`${a.id}: fixed bookings ${per}h != allowance ${a.E}h`);
  }
  if (a.E > 24) errors.push(`${a.id}: E=${a.E} exceeds 24h controllability threshold`);
}
for (const c of plan.checkpoints) if (!byId[c.activity]) errors.push(`${c.id}: unknown activity ${c.activity}`);
for (const r of plan.risks) {
  if (!resIds.includes(r.owner)) errors.push(`${r.id}: unknown owner`);
  for (const a of r.acts) if (!byId[a] && !/^W\d/.test(a)) errors.push(`${r.id}: unknown activity ${a}`);
}
for (const o of plan.objectives) for (const p of o.products) if (!prodIds.has(p)) errors.push(`${o.id}: unknown product ${p}`);
for (const p of plan.products.filter((p) => p.status === 'planned' && p.id !== 'P00' && p.id !== 'P24'))
  if (!acts.some((a) => a.product === p.id)) errors.push(`${p.id}: planned product without activity`);

// topological order + cycle check
const order = [];
const state = {};
const visit = (id, stack = []) => {
  if (state[id] === 2) return;
  if (state[id] === 1) { errors.push(`cycle: ${[...stack, id].join(' -> ')}`); return; }
  state[id] = 1;
  for (const p of byId[id].pred) visit(p, [...stack, id]);
  state[id] = 2;
  order.push(id);
};
acts.forEach((a) => visit(a.id));

// ---------- calendar ----------
const W = plan.calendar.weeks;
const days = [];
W.forEach((w, wi) => {
  for (let d = 0; d < plan.calendar.workdaysPerWeek; d++) {
    const dt = new Date(w.start + 'T00:00:00Z');
    dt.setUTCDate(dt.getUTCDate() + d);
    days.push({ week: w.id, wi, date: dt });
  }
});
const ddmm = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
const cap = {}; // cap[res][day] remaining hours
for (const r of resIds) cap[r] = days.map((d) => W[d.wi].hoursPerPerson / plan.calendar.workdaysPerWeek);
const load = {}; // load[res][weekId]
for (const r of resIds) load[r] = Object.fromEntries(W.map((w) => [w.id, 0]));

// fixed bookings: spread evenly over the week's days
for (const a of acts.filter((x) => x.fixed)) {
  for (const wk of a.fixed.weeks) {
    const idx = days.map((d, i) => (d.week === wk ? i : -1)).filter((i) => i >= 0);
    for (const [r, h] of Object.entries(a.fixed.hoursPerWeek)) {
      idx.forEach((i) => (cap[r][i] -= h / idx.length));
      load[r][wk] += h;
    }
  }
  const wkIdx = (wk) => days.findIndex((d) => d.week === wk);
  a.lvStart = wkIdx(a.fixed.weeks[0]);
  a.lvFinish = wkIdx(a.fixed.weeks.at(-1)) + plan.calendar.workdaysPerWeek;
}

// ---------- CPM on ideal network (nominal 2 h/day per assignee, no resource limits) ----------
const NOMINAL = 2;
const sched = acts.filter((a) => !a.fixed);
for (const a of sched) a.dur = Math.max(...Object.entries(a.assign).map(([, s]) => (s * a.E) / NOMINAL));
const topo = order.filter((id) => !byId[id].fixed);
for (const id of topo) {
  const a = byId[id];
  a.ES = Math.max(0, ...a.pred.filter((p) => !byId[p].fixed).map((p) => byId[p].EF));
  a.EF = a.ES + a.dur;
}
const projectEF = Math.max(...sched.map((a) => a.EF));
for (const id of [...topo].reverse()) {
  const a = byId[id];
  const succ = sched.filter((s) => s.pred.includes(id));
  a.LF = succ.length ? Math.min(...succ.map((s) => s.LS)) : projectEF;
  a.LS = a.LF - a.dur;
  a.TF = a.LS - a.ES;
}
const critical = topo.filter((id) => byId[id].TF < 1e-6);

// ---------- resource levelling: serial schedule generation scheme ----------
// Priority = LS (checkpoints first). A seeded random perturbation of the priorities is tried
// many times (multi-pass heuristic); the shortest schedule is kept. Days beyond the window are
// allowed during search only to measure overrun.
const dayCapAt = (d) => W[days[Math.min(d, days.length - 1)].wi].hoursPerPerson / plan.calendar.workdaysPerWeek;
const HORIZON = days.length * 2;
let seed = 20261109;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
function level(noise) {
  const c = {}, l = {}, st = {}, fi = {};
  for (const r of resIds) {
    c[r] = Array.from({ length: HORIZON }, (_, d) => (d < days.length ? cap[r][d] : dayCapAt(d)));
    l[r] = { ...load[r] };
  }
  const jitter = Object.fromEntries(topo.map((id) => [id, noise ? rnd() * noise : 0]));
  const done = new Set();
  const pending = new Set(topo);
  while (pending.size) {
    const ready = [...pending].filter((id) => byId[id].pred.every((p) => byId[p].fixed || done.has(p)));
    const prio = (id) => byId[id].LS - (byId[id].cp ? 100 : 0) - (byId[id].boost || 0) + jitter[id];
    ready.sort((x, y) => prio(x) - prio(y) || byId[x].ES - byId[y].ES);
    const a = byId[ready[0]];
    const t0 = Math.max(0, ...a.pred.filter((p) => !byId[p].fixed).map((p) => fi[p]));
    let finish = t0, firstDay = Infinity;
    for (const [r, s] of Object.entries(a.assign)) {
      let need = s * a.E;
      let d = Math.floor(t0 + 1e-9);
      while (need > 1e-9 && d < HORIZON) {
        const avail = Math.max(0, c[r][d]);
        if (avail > 1e-9) {
          const use = Math.min(avail, need);
          const usedBefore = dayCapAt(d) - c[r][d];
          c[r][d] -= use;
          if (d < days.length) l[r][days[d].week] += use;
          need -= use;
          firstDay = Math.min(firstDay, d);
          if (need <= 1e-9) finish = Math.max(finish, d + Math.min(1, (usedBefore + use) / dayCapAt(d)));
        }
        d++;
      }
    }
    st[a.id] = firstDay;
    fi[a.id] = finish;
    done.add(a.id);
    pending.delete(a.id);
  }
  return { makespan: Math.max(...Object.values(fi)), st, fi, l };
}
let best = level(0);
const deterministicMakespan = best.makespan;
for (let i = 0; i < 4000; i++) {
  const r = level(i < 2000 ? 3 : 8);
  if (r.makespan < best.makespan - 1e-9) best = r;
}
for (const id of topo) { byId[id].lvStart = best.st[id]; byId[id].lvFinish = best.fi[id]; }
for (const r of resIds) load[r] = best.l[r];
if (best.makespan > days.length + 1e-9) errors.push(`Levelled schedule ends on working day ${r2(best.makespan)} > ${days.length} (overruns ${ddmm(days.at(-1).date)})`);
const dayLabel = (t, isFinish) => {
  const i = isFinish ? Math.max(0, Math.ceil(t - 1e-9) - 1) : Math.floor(t + 1e-9);
  return ddmm(days[Math.min(i, days.length - 1)].date);
};
const lvEnd = Math.max(...sched.map((a) => a.lvFinish));

// ---------- totals ----------
const baseEffort = acts.reduce((s, a) => s + a.E, 0);
const capacityTotal = resIds.length * W.reduce((s, w) => s + w.hoursPerPerson, 0);
const workRisks = plan.risks.filter((r) => !r.capacityRisk);
const exposure = workRisks.reduce((s, r) => s + (r.prob / 100) * r.hours, 0);
const reserve = workRisks.reduce((s, r) => s + (r.residual / 100) * r.hours, 0);
const responseActs = acts.filter((a) => a.response);
const responseEffort = responseActs.reduce((s, a) => s + a.E, 0);
const resLoad = Object.fromEntries(resIds.map((r) => [r, Object.values(load[r]).reduce((x, y) => x + y, 0)]));
const resCap = W.reduce((s, w) => s + w.hoursPerPerson, 0);

// ---------- markdown output ----------
const name = (r) => plan.resources.find((x) => x.id === r).name;
const table = (head, rows) =>
  [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
const files = {};

files['products.md'] = table(['P-ID', 'P-ID cha', 'Sản phẩm', 'Loại', 'Trạng thái', 'Nghiệm thu / sử dụng'],
  plan.products.map((p) => [p.id, p.group ? `${p.group} (${plan.productGroups.find((g) => g.id === p.group).name})` : '—', p.name,
    p.type === 'D' ? 'Bàn giao' : 'Trung gian',
    { planned: 'Lập kế hoạch' + (p.inc ? ` (Inc ${p.inc})` : ''), done: 'Đã hoàn thành', deferred: 'Hoãn (Q22)' }[p.status], p.acceptance]));

files['activities.md'] = table(['A-ID', 'Hoạt động', 'Sản phẩm', 'Hoạt động trước', 'Phụ trách', 'CP'],
  acts.map((a) => [a.id, a.name, a.product, a.pred.join(', ') || '—',
    a.fixed ? Object.keys(a.fixed.hoursPerWeek).join(', ') : Object.keys(a.assign).join(', '), a.cp || '']));

files['estimates.md'] = table(['A-ID', 'Hoạt động', 'Căn cứ (sub-task)', 'O', 'M', 'P', 'E (giờ)', 'σ'],
  acts.filter((a) => a.est).map((a) => [a.id, a.name, a.basis, fmt(a.est.o), fmt(a.est.m), fmt(a.est.p), fmt(a.E), fmt(a.sigma)])
    .concat([['', '**Tổng**', '', '', '', '', `**${fmt(acts.filter((a) => a.est).reduce((s, a) => s + a.E, 0))}**`, '']]));

files['allowances.md'] = table(['A-ID', 'Hoạt động', 'Effort (giờ)', 'Căn cứ'],
  acts.filter((a) => !a.est).map((a) => [a.id, a.name, fmt(a.E), a.basis])
    .concat([['', '**Tổng**', `**${fmt(acts.filter((a) => !a.est).reduce((s, a) => s + a.E, 0))}**`, '']]));

files['duration.md'] = table(['A-ID', 'Effort (giờ)', 'Người làm', 'Năng lực (giờ/ngày)', 'Thời gian tối thiểu (ngày)', 'Lịch thực tế (ngày làm việc) và lý do'],
  sched.map((a) => {
    const n = Object.keys(a.assign).length;
    const lv = a.lvFinish - a.lvStart;
    return [a.id, fmt(a.E), Object.keys(a.assign).join(', '), `${n} × 2`, fmt(a.dur),
      `${fmt(lv)} (${dayLabel(a.lvStart)} → ${dayLabel(a.lvFinish, true)})${lv - a.dur > 1 ? '; chờ nguồn lực/phụ thuộc' : ''}`];
  }));

files['cpm.md'] = table(['A-ID', 'Thời gian (ngày)', 'ES', 'EF', 'LS', 'LF', 'Float', 'Găng'],
  topo.map((id) => { const a = byId[id]; return [id, fmt(a.dur), fmt(a.ES), fmt(a.EF), fmt(a.LS), fmt(a.LF), fmt(a.TF), a.TF < 1e-6 ? '●' : '']; }));

files['schedule.md'] = table(['A-ID / mốc', 'Hoạt động trước', 'Phụ trách', 'Effort (giờ)', 'Bắt đầu', 'Kết thúc', 'Thời gian (ngày)'],
  [...sched].sort((x, y) => x.lvStart - y.lvStart || x.lvFinish - y.lvFinish).map((a) => [a.id, a.pred.join(', ') || '—', Object.keys(a.assign).join(', '), fmt(a.E),
    dayLabel(a.lvStart), dayLabel(a.lvFinish, true), fmt(a.lvFinish - a.lvStart)])
    .concat(acts.filter((a) => a.fixed).map((a) => [a.id, '—', Object.keys(a.fixed.hoursPerWeek).join(', '), fmt(a.E), `${a.fixed.weeks[0]}`, `${a.fixed.weeks.at(-1)}`, 'định kỳ'])));

const msDate = (m) => m.date ? `${m.date.slice(8, 10)}/${m.date.slice(5, 7)}` : dayLabel(Math.max(...m.after.map((x) => byId[x].lvFinish)), true);
files['milestones.md'] = table(['Mốc', 'Ngày dự kiến', 'Điều kiện vào', 'Phê duyệt / minh chứng'],
  plan.milestones.map((m) => [m.id + ' ' + m.name, msDate(m), m.after.join(', ') || 'Báo cáo M2 hoàn tất', m.id === 'M-01' ? 'Email gửi khách hàng (Q19)' : m.id === 'M-05' ? 'Nộp LMS' : 'Video demo qua email (Q23)']));

files['gantt.md'] = table(['A-ID / hoạt động', ...W.map((w) => `${w.id} (${ddmm(days.find((d) => d.week === w.id).date)})`)],
  [...acts].sort((x, y) => x.lvStart - y.lvStart || x.lvFinish - y.lvFinish).map((a) => [`${a.id} ${a.name}`, ...W.map((w) => {
    const idx = days.map((d, i) => (d.week === w.id ? i : -1)).filter((i) => i >= 0);
    const on = idx.some((i) => i + 1 > a.lvStart + 1e-9 && i < a.lvFinish - 1e-9);
    return on ? (a.fixed ? '▒' : critical.includes(a.id) ? '■ găng' : '■') : '';
  })]).concat(plan.milestones.map((m) => {
    const dl = msDate(m);
    return [`${m.id} ${m.name}`, ...W.map((w) => {
      const s = days.find((d) => d.week === w.id).date;
      const e = new Date(s); e.setUTCDate(e.getUTCDate() + 6);
      const [dd, mm] = dl.split('/').map(Number);
      const md = new Date(Date.UTC(2026, mm - 1, dd));
      return md >= s && md <= e ? `◆ ${dl}` : '';
    })];
  })));

files['resource-capacity.md'] = table(['RES-ID / vai trò', 'Thành viên', 'Kỹ năng / trách nhiệm', 'Giờ/tuần (W9 / W10-W12)', 'Giờ khả dụng W9-W12', 'Ghi chú'],
  plan.resources.map((r) => [`${r.id} / ${r.role}`, r.name, r.skill, `${W[0].hoursPerPerson} / ${W[1].hoursPerPerson}`, resCap, r.note]));

files['resource-load.md'] = table(['RES-ID', 'Thành viên', ...W.map((w) => `${w.id} (giờ / ${w.hoursPerPerson})`), 'Tổng giao', 'Khả dụng', 'Dư'],
  resIds.map((r) => [r, name(r), ...W.map((w) => fmt(load[r][w.id])), fmt(resLoad[r]), resCap, fmt(resCap - resLoad[r])]));

files['allocation.md'] = table(['A-ID', 'RES-ID', 'Giờ theo người', 'Cửa sổ làm việc'],
  sched.map((a) => [a.id, Object.keys(a.assign).join(', '), Object.entries(a.assign).map(([r, s]) => `${r}: ${fmt(s * a.E)}`).join('; '), `${dayLabel(a.lvStart)} → ${dayLabel(a.lvFinish, true)}`]));

files['risks.md'] = table(['R-ID / A-ID', 'Sự kiện rủi ro', 'Xác suất', 'Ảnh hưởng', 'L × I', 'Mức', 'Phụ trách', 'Giảm thiểu', 'Dự phòng', 'Phơi nhiễm (giờ)'],
  plan.risks.map((r) => {
    const s = r.L * r.I;
    const lvl = s >= 15 ? 'Nghiêm trọng' : s >= 10 ? 'Cao' : s >= 5 ? 'Trung bình' : 'Thấp';
    return [`${r.id} / ${r.acts.join(', ')}`, r.event, `${r.prob}%`, `${r.hours ? '+' + r.hours + 'h; ' : ''}${r.delay}`, `${r.L} × ${r.I} = ${s}`, lvl, r.owner, r.reduce, r.contingency,
      r.capacityRisk ? 'Không tính (rủi ro năng lực)' : fmt((r.prob / 100) * r.hours)];
  }));

files['reserve.md'] = table(['R-ID', 'Xác suất trước', 'Xác suất sau ứng phó', 'Giờ nếu xảy ra', 'Dự phòng (giờ)'],
  workRisks.map((r) => [r.id, `${r.prob}%`, `${r.residual}%`, r.hours, fmt((r.residual / 100) * r.hours)])
    .concat([['**Tổng**', '', '', '', `**${fmt(reserve)}**`]]));

files['checkpoints.md'] = table(['CP-ID', 'Kích hoạt / sản phẩm', 'Tiêu chí đạt và minh chứng', 'Người review / phê duyệt', 'Nếu không đạt'],
  plan.checkpoints.map((c) => [c.id, `${c.trigger} (${c.activity})`, c.criteria, c.approver, c.fail]));

files['traceability.md'] = table(['Mục tiêu', 'Sản phẩm', 'Hoạt động', 'Nguồn lực', 'Rủi ro', 'Kiểm chứng', 'Checkpoint'],
  plan.objectives.map((o) => {
    const oa = acts.filter((a) => o.products.includes(a.product) && !a.fixed);
    const res = [...new Set(oa.flatMap((a) => Object.keys(a.assign)))].sort();
    const rk = plan.risks.filter((r) => r.acts.some((x) => oa.some((a) => a.id === x))).map((r) => r.id);
    return [`${o.id} ${o.name}`, o.products.join(', '), oa.map((a) => a.id).join(', '), res.join(', '), rk.join(', '), o.tests.join(', '), o.cps.join(', ')];
  }));

const totals = {
  baseEffort: r2(baseEffort), capacityTotal, reserve: r2(reserve), exposure: r2(exposure), responseEffort: r2(responseEffort),
  totalWithReserve: r2(baseEffort + reserve), loading: r2(((baseEffort + reserve) / capacityTotal) * 100),
  costBase: Math.round(baseEffort * plan.calendar.rateVND), costReserve: Math.round(reserve * plan.calendar.rateVND),
  costTotal: Math.round((baseEffort + reserve) * plan.calendar.rateVND),
  idealDurationDays: r2(projectEF), levelledFinish: dayLabel(lvEnd, true), levelledDays: r2(lvEnd), critical,
  resLoad: Object.fromEntries(Object.entries(resLoad).map(([k, v]) => [k, r2(v)])),
};
files['totals.md'] = table(['Chỉ số', 'Giá trị'], [
  ['Tổng effort cơ sở (người-giờ)', fmt(totals.baseEffort)],
  ['Trong đó hoạt động ứng phó rủi ro', fmt(totals.responseEffort)],
  ['Dự phòng làm lại (Σ phơi nhiễm còn lại)', fmt(totals.reserve)],
  ['Tổng effort baseline', fmt(totals.totalWithReserve)],
  ['Năng lực W9-W12', totals.capacityTotal],
  ['Mức sử dụng năng lực', `${fmt(totals.loading)}%`],
  ['Đường găng (mạng lý tưởng)', `${critical.join(' → ')} = ${fmt(projectEF)} ngày`],
  ['Kết thúc theo lịch đã cân bằng nguồn lực', `${totals.levelledFinish} (ngày làm việc thứ ${fmt(lvEnd)} / ${days.length})`],
  ['Chi phí nhân công quy đổi (cơ sở)', `${totals.costBase.toLocaleString('vi-VN')} VNĐ`],
  ['Chi phí dự phòng', `${totals.costReserve.toLocaleString('vi-VN')} VNĐ`],
  ['Tổng chi phí baseline', `${totals.costTotal.toLocaleString('vi-VN')} VNĐ`],
]);

for (const [f, c] of Object.entries(files)) writeFileSync(join(outDir, f), c + '\n');
writeFileSync(join(outDir, 'schedule.json'), JSON.stringify({
  days: days.map((d) => ({ week: d.week, date: ddmm(d.date) })), totals,
  activities: acts.map((a) => ({ id: a.id, name: a.name, product: a.product, pred: a.pred, E: r2(a.E), dur: a.dur && r2(a.dur), ES: a.ES, EF: a.EF, LS: a.LS, LF: a.LF, TF: a.TF, lvStart: a.lvStart, lvFinish: a.lvFinish, critical: critical.includes(a.id), fixed: !!a.fixed, cp: a.cp, assign: a.assign || a.fixed?.hoursPerWeek })),
}, null, 2));

console.log(JSON.stringify(totals, null, 2));
if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; } else console.log('OK: no validation errors');
