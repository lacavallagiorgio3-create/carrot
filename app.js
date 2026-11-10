'use strict';
(function () {

/* ============ DATI DAL PIANO (PDF) ============ */
const SLOTS = [
  { id: 'colazione', name: 'Colazione', short: 'Col', type: 'colazione' },
  { id: 'sp_mattina', name: 'Spuntino mattina', short: 'Sp.M', type: 'spuntino' },
  { id: 'pranzo', name: 'Pranzo', short: 'Pra', type: 'main' },
  { id: 'merenda', name: 'Merenda', short: 'Mer', type: 'spuntino' },
  { id: 'cena', name: 'Cena', short: 'Cen', type: 'main' },
  { id: 'sp_sera', name: 'Spuntino sera (opzionale)', short: 'Sp.S', type: 'spuntino', optional: true }
];

const COLAZ = [
  { id: 'c1', name: 'Opz. 1 – Latte e cereali', items: ['Latte 250 ml', 'Cereali 40-50 g', 'Frutta fresca', 'Frutta secca 10-15 g'] },
  { id: 'c2', name: 'Opz. 2 – Pane e crema alla nocciola', items: ['Pane 80 g', 'Crema alla nocciola 20 g', 'Latte 200-250 ml', 'Un frutto'] },
  { id: 'c3', name: 'Opz. 3 – Pancake', items: ['2-3 pancake (farina, uova, latte)', 'Marmellata o miele', 'Un bicchiere di latte', 'Frutta fresca'], tags: ['Uova'] },
  { id: 'c4', name: 'Opz. 4 – Pane e marmellata', items: ['Pane 80-100 g', 'Marmellata 25-30 g', 'Latte 250 ml', 'Mandorle o noci 15 g'] },
  { id: 'c5', name: 'Opz. 5 – Colazione salata', items: ['Pane 80 g', '2 uova', 'Una piccola porzione di formaggio', 'Un frutto'], salata: true, tags: ['Uova'] },
  { id: 'c6', name: 'Opz. 6 – Toast', items: ['Pane da toast 100 g', 'Prosciutto cotto 50 g', 'Formaggio 30 g', 'Un frutto'], salata: true }
];

const SPUNT = [
  { id: 's1', name: 'Opz. 1', items: ['Banana', 'Mandorle o noci 20 g'] },
  { id: 's2', name: 'Opz. 2', items: ['Panino 60-80 g', 'Prosciutto cotto o crudo 40-50 g'] },
  { id: 's3', name: 'Opz. 3', items: ['Yogurt da bere 200 ml', 'Un frutto', 'Eventualmente qualche biscotto'] },
  { id: 's4', name: 'Opz. 4', items: ['Pane 50-60 g', 'Crema 100% arachidi 15-20 g'] },
  { id: 's5', name: 'Opz. 5', items: ['Frullato con latte 200 ml', 'Una banana', 'Cacao'] },
  { id: 's6', name: 'Opz. 6', items: ['Pane 60 g', 'Mozzarella 60-80 g'], tags: ['Mozzarella'] }
];
const OPT_BY_ID = {};
COLAZ.concat(SPUNT).forEach(o => OPT_BY_ID[o.id] = o);

const CARBS = [
  ['Pasta', '80-100 g (a crudo)'], ['Riso', '80-100 g (a crudo)'], ['Cous cous', '80-100 g (a crudo)'],
  ['Farro', '80-100 g (a crudo)'], ['Pane', '100-120 g'], ['Patate', '250-350 g'], ['Gnocchi', '180-220 g']
];
const PROTS = [
  ['Pollo', '150-180 g', 'Carne bianca'], ['Tacchino', '150-180 g', 'Carne bianca'],
  ['Carne rossa', '150-180 g', 'Carne rossa'], ['Pesce', '180-200 g', 'Pesce'],
  ['Tonno al naturale', '120-150 g sgocciolato', 'Pesce'], ['Uova', '2 uova', 'Uova'],
  ['Mozzarella', '100-125 g', 'Latticini'], ['Ricotta', '100-150 g', 'Latticini'],
  ['Ceci', '150-200 g cotti', 'Legumi'], ['Lenticchie', '150-200 g cotte', 'Legumi'], ['Fagioli', '150-200 g cotti', 'Legumi']
];
const GROUPS = ['Carne bianca', 'Carne rossa', 'Pesce', 'Uova', 'Latticini', 'Legumi'];
const VEG = ['Zucchine', 'Carote', 'Melanzane', 'Fagiolini', 'Pomodori', 'Peperoni', 'Lattuga', 'Zucca'];
const VEG_QTY = '150-200 g a pasto';
const FATS = [['Olio extravergine', '1-2 cucchiai'], ['Frutta secca', '20-30 g'], ['Avocado', '50-80 g'], ['Parmigiano', '20-30 g']];

const COMBOS = [
  { l: 'Pasta al pomodoro + pollo + zucchine', s: 'pranzo', carb: 'Pasta', prot: 'Pollo', veg: ['Zucchine'] },
  { l: 'Pasta al pesto + mozzarella + pomodori', s: 'pranzo', carb: 'Pasta', prot: 'Mozzarella', veg: ['Pomodori'] },
  { l: 'Riso + tonno + zucchine', s: 'pranzo', carb: 'Riso', prot: 'Tonno al naturale', veg: ['Zucchine'] },
  { l: 'Cous cous + ceci + carote', s: 'pranzo', carb: 'Cous cous', prot: 'Ceci', veg: ['Carote'] },
  { l: 'Pasta al ragù + verdure', s: 'pranzo', carb: 'Pasta', prot: 'Carne rossa', veg: [] },
  { l: 'Gnocchi al pomodoro + parmigiano', s: 'pranzo', carb: 'Gnocchi', fat: ['Parmigiano'] },
  { l: 'Riso + salmone + carote', s: 'cena', carb: 'Riso', prot: 'Pesce', veg: ['Carote'] },
  { l: 'Patate + tacchino + fagiolini', s: 'cena', carb: 'Patate', prot: 'Tacchino', veg: ['Fagiolini'] },
  { l: 'Pane + uova + verdure', s: 'cena', carb: 'Pane', prot: 'Uova', veg: [] },
  { l: 'Pasta + ricotta + melanzane', s: 'cena', carb: 'Pasta', prot: 'Ricotta', veg: ['Melanzane'] },
  { l: 'Pesce + patate + zucchine', s: 'cena', carb: 'Patate', prot: 'Pesce', veg: ['Zucchine'] },
  { l: 'Pane + carne + peperoni', s: 'cena', carb: 'Pane', prot: 'Carne rossa', veg: ['Peperoni'] },
  { l: 'Piatto unico: pasta con ragù', s: 'unico', carb: 'Pasta', prot: 'Carne rossa', veg: [] },
  { l: 'Piatto unico: riso con pollo e verdure', s: 'unico', carb: 'Riso', prot: 'Pollo', veg: [] },
  { l: 'Piatto unico: pasta con tonno e zucchine', s: 'unico', carb: 'Pasta', prot: 'Tonno al naturale', veg: ['Zucchine'] },
  { l: 'Piatto unico: cous cous con ceci e verdure', s: 'unico', carb: 'Cous cous', prot: 'Ceci', veg: [] },
  { l: 'Piatto unico: pasta con ricotta e pomodoro', s: 'unico', carb: 'Pasta', prot: 'Ricotta', veg: ['Pomodori'] }
];

const PRE_TRAIN = ['Pane e marmellata', 'Banana e frutta secca', 'Panino con prosciutto cotto', 'Latte e biscotti', 'Frullato di latte e banana'];
const TRAIN_TIPS = ['Non arrivare all\'allenamento a digiuno', 'Merenda prima dell\'attività', 'Pasto completo dopo l\'allenamento', 'Bere regolarmente acqua durante la giornata'];
const TRAIN_WEEK = 2, SALATA_MAX = 2, PIZZA_MAX = 1;

/* Alimenti esclusi dal piano */
const EXCL = [
  ['Philadelphia', /\bphiladelphia\b|\bphila\b/],
  ['Feta', /\bfeta\b/],
  ['Rucola', /\brucola\b|\brughetta\b/],
  ['Valeriana', /\bvaleriana\b|\bsongino\b/],
  ['Funghi', /\bfung(o|hi)\b|\bchampignon\b|\bporcin[oi]\b|\bpleurot\w*|\bprataiol\w*/],
  ['Carciofi', /\bcarciof(o|i)\b/],
  ['Broccoli', /\bbroccol(o|i|etti)\b/],
  ['Rape', /\brap(a|e)\b/],
  ['Cavolfiore', /\bcavolfior(e|i)\b/],
  ['Bietole', /\bbiet(a|e|ola|ole)\b/],
  ['Cicorie', /\bcicori(a|e)\b/],
  ['Spinaci', /\bspinac(io|i)\b/],
  ['Kiwi', /\bkiwi\b/],
  ['Yogurt al cucchiaio', /(yogurt|iogurt).*(cucchiaio|greco|denso)|(cucchiaio|greco).*(yogurt|iogurt)/]
];
const EXCL_LABELS = EXCL.map(e => e[0]);

/* ============ UTILITÀ ============ */
/* localStorage serve SOLO a ricordare chi è questo telefono (profilo + stanza)
   e le modifiche non ancora inviate. I dati del piano stanno nel cloud. */
const KEY_CFG = 'dieta.cfg.v3', KEY_PEND = 'dieta.pend.v3', KEY_DEV = 'dieta.dev.v3', OLD_KEY = 'dieta.pwa.v1';
const PEOPLE = ['Giorgio', 'Lucia'];
const DAYN = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(2, '0');
const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = k => { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const wstart = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const weekKeys = k => { const s = wstart(parse(k)); return Array.from({ length: 7 }, (_, i) => dkey(addDays(s, i))); };
const today = () => dkey(new Date());
const fmtShort = k => parse(k).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
const excluded = txt => { const s = norm(txt); for (const e of EXCL) if (e[1].test(s)) return e[0]; return null; };
const qtyOf = (arr, n) => { const f = arr.find(x => x[0] === n); return f ? f[1] : ''; };
const ls = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const rnd = n => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; return Array.from(crypto.getRandomValues(new Uint8Array(n)), x => a[x % a.length]).join(''); };
const CHECK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

/* ============ STATO ============ */
let dev = ls.get(KEY_DEV); if (!dev) { dev = rnd(20); ls.set(KEY_DEV, dev); }
let cfg = ls.get(KEY_CFG);               // { me, room }
let pend = ls.get(KEY_PEND) || [];       // modifiche in attesa: { o, k, v }
let store = { plans: {} };               // piano letto dal cloud: plans[owner][data].meals[slot].{sel,done,prop}
const sync = { loaded: false, err: false, busy: false, pulling: false, gen: 0 };
const ui = { tab: 'week', wk: today(), date: today(), view: cfg ? cfg.me : null, sheet: null, lock: false, setup: { role: '', code: rnd(10), force: false, err: '' } };

const other = () => cfg.me === PEOPLE[0] ? PEOPLE[1] : PEOPLE[0];
const isMine = () => ui.view === cfg.me;
const getDay = (k, o) => { const p = store.plans[o || ui.view]; return (p && p[k]) || null; };
const getMeal = (k, s, o) => { const d = getDay(k, o); return (d && d.meals && d.meals[s]) || null; };
const hasSel = s => !!(s && (s.opt || s.carb || s.prot || s.pizza || (s.veg && s.veg.length) || (s.fat && s.fat.length) || (s.free && s.free.length)));
const mealKey = (k, s, f) => k + '/meals/' + s + '/' + f;

function setAt(o, parts, val) {
  const h = parts[0];
  if (parts.length === 1) { if (val == null) delete o[h]; else o[h] = val; return; }
  if (o[h] == null || typeof o[h] !== 'object') o[h] = {};
  setAt(o[h], parts.slice(1), val);
  if (val == null && !Object.keys(o[h]).length) delete o[h];
}
function cleanSel(s) {
  const o = {};
  ['opt', 'carb', 'prot'].forEach(f => { if (s[f]) o[f] = s[f]; });
  if (s.pizza) o.pizza = true;
  ['veg', 'fat', 'free'].forEach(f => { if (s[f] && s[f].length) o[f] = s[f].slice(); });
  return hasSel(o) ? o : null;
}

/* ============ SINCRONIZZAZIONE (Vercel /api/sync → Supabase) ============ */
async function api(body, room, devId) {
  const r = await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({ room: room || cfg.room, dev: devId || dev }, body))
  });
  let j = {}; try { j = await r.json(); } catch (e) {}
  j.status = r.status;
  if (r.status >= 500) throw new Error(j.error || 'server');
  return j;
}

/* scrive in locale subito, poi manda al cloud */
function put(owner, k, v) {
  if (ui.lock) return;
  v = v == null ? null : v;
  setAt(store.plans, [owner].concat(k.split('/')), v);
  pend = pend.filter(w => !(w.o === owner && w.k === k));
  pend.push({ o: owner, k, v });
  ls.set(KEY_PEND, pend);
  sync.gen++;
  flush();
}

async function flush() {
  if (sync.busy || !pend.length || !cfg || ui.lock) return;
  sync.busy = true;
  try {
    while (pend.length) {
      const o = pend[0].o, batch = pend.filter(w => w.o === o).slice(0, 50);
      const r = await api({ a: 'write', owner: o, ops: batch.map(w => ({ k: w.k, v: w.v })) });
      if (r.status === 403) { verifyClaim(); throw new Error('403'); }
      if (r.status !== 200) throw new Error('write');
      pend = pend.filter(w => batch.indexOf(w) < 0);
      ls.set(KEY_PEND, pend);
      sync.gen++;
    }
    sync.err = false;
  } catch (e) { sync.err = true; setTimeout(flush, 6000); }
  sync.busy = false;
  paint();
}

async function pull() {
  if (!cfg || ui.lock || sync.pulling) return;
  sync.pulling = true;
  const g = sync.gen;
  try {
    const r = await api({ a: 'read', since: dkey(addDays(new Date(), -42)) });
    if (r.status === 403) { verifyClaim(); throw new Error('403'); }
    if (r.status !== 200) throw new Error('read');
    sync.err = false;
    if (g === sync.gen && !sync.busy) {
      const p = {};
      r.rows.forEach(x => setAt(p, [x.owner].concat(x.k.split('/')), x.v));
      pend.forEach(w => setAt(p, [w.o].concat(w.k.split('/')), w.v));
      const changed = JSON.stringify(p) !== JSON.stringify(store.plans) || !sync.loaded;
      store.plans = p; sync.loaded = true;
      if (changed) later();
    }
  } catch (e) { sync.err = true; }
  sync.pulling = false;
  paint();
}

async function verifyClaim() {
  if (!cfg) return;
  try {
    const r = await api({ a: 'claim', role: cfg.me });
    ui.lock = !r.ok;
    render();
    if (r.ok) pull();
  } catch (e) {}
}

let rq = 0;
const later = () => { cancelAnimationFrame(rq); rq = requestAnimationFrame(render); };
let lastSt = '';
const paint = () => { const s = [sync.err, pend.length, sync.loaded].join(); if (s !== lastSt) { lastSt = s; later(); } };

/* ============ CONTEGGI ============ */
function tagsOf(sel) {
  const t = [];
  if (sel.carb) t.push(sel.carb);
  if (sel.prot) t.push(sel.prot);
  if (sel.opt) { const o = OPT_BY_ID[sel.opt]; if (o && o.tags) t.push.apply(t, o.tags); }
  return t;
}
function weekCounts(date, skip) {
  const out = {};
  weekKeys(date).forEach(k => {
    if (k > date) return;
    const d = getDay(k); if (!d || !d.meals) return;
    Object.keys(d.meals).forEach(sid => {
      if (skip && skip.date === k && skip.slot === sid) return;
      const m = d.meals[sid];
      if (!m.sel || !hasSel(m.sel)) return;
      tagsOf(m.sel).forEach(t => out[t] = (out[t] || 0) + 1);
    });
  });
  return out;
}
function weekTotals(date, skip) {
  const r = { salata: 0, pizza: 0, train: 0 };
  weekKeys(date).forEach(k => {
    const d = getDay(k); if (!d) return;
    if (d.train) r.train++;
    Object.keys(d.meals || {}).forEach(sid => {
      if (skip && skip.date === k && skip.slot === sid) return;
      const s = d.meals[sid].sel; if (!s) return;
      if (s.pizza) r.pizza++;
      if (s.opt && OPT_BY_ID[s.opt] && OPT_BY_ID[s.opt].salata) r.salata++;
    });
  });
  return r;
}
function groupCounts(counts) {
  const g = {}; GROUPS.forEach(n => g[n] = 0);
  PROTS.forEach(p => g[p[2]] += counts[p[0]] || 0);
  return g;
}
function advice(counts) {
  if (!Object.keys(counts).length) return '';
  const g = groupCounts(counts);
  const rep = Object.keys(counts).filter(n => counts[n] >= 2).map(n => n.toLowerCase() + ' ' + counts[n] + '×');
  const miss = GROUPS.filter(n => !g[n]).map(n => n.toLowerCase());
  let t = 'Finora questa settimana' + (rep.length ? ': ' + rep.join(', ') + '.' : ': nessuna ripetizione.');
  if (miss.length) t += ' Non ancora: ' + miss.join(', ') + '.';
  return `<p class="note">${esc(t)}</p>`;
}
function tally(counts) {
  const c = CARBS.filter(x => counts[x[0]]).map(x => `${esc(x[0])} ${counts[x[0]]}`).join(' · ');
  const g = groupCounts(counts);
  const p = GROUPS.filter(n => g[n]).map(n => `${esc(n)} ${g[n]}`).join(' · ');
  return `<div class="kv"><span>Carboidrati</span><span>${c || '—'}</span></div><div class="kv"><span>Proteine</span><span>${p || '—'}</span></div>`;
}
function shortLine(sel) {
  if (!hasSel(sel)) return '';
  if (sel.pizza) return 'Pizza';
  const p = [];
  if (sel.opt) p.push(OPT_BY_ID[sel.opt].items.slice(0, 3).join(', '));
  if (sel.carb) p.push(sel.carb);
  if (sel.prot) p.push(sel.prot);
  if (sel.veg && sel.veg.length) p.push(sel.veg.join(', '));
  if (sel.fat && sel.fat.length) p.push(sel.fat.join(', '));
  (sel.free || []).forEach(f => p.push(f));
  return esc(p.join(' · '));
}

/* ============ VISTE ============ */
const view = $('view');

function who() {
  return '<div class="seg">' + [cfg.me, other()].map(n =>
    `<button class="${ui.view === n ? 'on' : ''}" data-a="view" data-n="${n}">${n}${n === cfg.me ? ' (tu)' : ''}</button>`).join('') + '</div>';
}
function statusLine() {
  if (!sync.loaded && !sync.err) return '<p class="note">Carico i dati…</p>';
  if (sync.err) return `<p class="note warn">Nessuna connessione${pend.length ? ' · ' + pend.length + ' modifiche da inviare' : ''}.</p>`;
  return '';
}
function advisorNote() {
  return isMine() ? '' : `<p class="note">Stai guardando il piano di ${esc(ui.view)}. Quello che scegli diventa un consiglio: lo conferma lui.</p>`;
}

function renderWeek() {
  const keys = weekKeys(ui.wk), t = today();
  let done = 0, nProp = 0, firstProp = null;
  keys.forEach(k => SLOTS.forEach(s => {
    const m = getMeal(k, s.id);
    if (m && m.done && !s.optional) done++;
    if (m && m.prop) { nProp++; firstProp = firstProp || k; }
  }));
  const total = keys.length * SLOTS.filter(s => !s.optional).length;
  const pct = Math.round(done / total * 100);
  const tot = weekTotals(ui.wk), counts = weekCounts(keys[6]);

  let grid = '<div class="wg"><div></div>' + SLOTS.map(s => `<div class="hd">${s.short}</div>`).join('');
  keys.forEach((k, i) => {
    const d = getDay(k);
    grid += `<div class="wr" data-a="goday" data-date="${k}"><div class="dl ${k === t ? 'today' : ''}">${DAYN[i]} ${parse(k).getDate()}<small>${d && d.train ? 'allenamento' : ''}</small></div>`;
    SLOTS.forEach(s => {
      const m = getMeal(k, s.id);
      const cls = (m && m.done) ? 'done' : (m && hasSel(m.sel)) ? 'sel' : '';
      grid += `<div class="wc"><span class="dot ${s.optional ? 'opt' : ''} ${cls} ${m && m.prop ? 'prop' : ''}"></span></div>`;
    });
    grid += '</div>';
  });
  grid += '</div>';

  return `<div class="head"><div><h1 class="title">Settimana</h1><p class="sub">${fmtShort(keys[0])} – ${fmtShort(keys[6])}</p></div>
    <div class="nav"><button data-a="wk" data-n="-1" aria-label="Settimana precedente">‹</button><button data-a="wk" data-n="0">oggi</button><button data-a="wk" data-n="1" aria-label="Settimana successiva">›</button></div></div>
    ${who()}${advisorNote()}${statusLine()}
    ${isMine() && nProp ? `<button class="banner" data-a="goday" data-date="${firstProp}">${nProp} ${nProp === 1 ? 'consiglio' : 'consigli'} di ${esc(other())} da vedere</button>` : ''}
    <div class="line"><span>Mangiato</span><b>${done}/${total}</b></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    ${grid}
    <div class="legend"><span><i class="dot done"></i>mangiato</span><span><i class="dot sel"></i>scelto</span><span><i class="dot opt"></i>opzionale</span><span><i class="dot prop"></i>consiglio</span></div>
    <h2 class="sec">Riepilogo</h2>
    <div class="kv"><span>Allenamenti</span><span class="${tot.train > TRAIN_WEEK ? 'warnt' : ''}">${tot.train}/${TRAIN_WEEK}</span></div>
    <div class="kv"><span>Colazioni salate</span><span class="${tot.salata > SALATA_MAX ? 'warnt' : ''}">${tot.salata}/${SALATA_MAX}</span></div>
    <div class="kv"><span>Pizza</span><span class="${tot.pizza > PIZZA_MAX ? 'warnt' : ''}">${tot.pizza}/${PIZZA_MAX}</span></div>
    ${tally(counts)}
    <p class="foot"><button class="lnk" data-a="settings">Profilo e sincronizzazione</button></p>`;
}

function renderToday() {
  const k = ui.date, t = today(), keys = weekKeys(k), d = getDay(k) || { meals: {} };
  const title = k === t ? 'Oggi' : cap(parse(k).toLocaleDateString('it-IT', { weekday: 'long' }));
  const sub = parse(k).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  const req = SLOTS.filter(s => !s.optional);
  const meals = d.meals || {};
  const planned = req.filter(s => meals[s.id] && (meals[s.id].done || hasSel(meals[s.id].sel))).length;
  const done = req.filter(s => meals[s.id] && meals[s.id].done).length;
  const tot = weekTotals(k), mine = isMine();

  const strip = '<div class="strip">' + keys.map((x, i) =>
    `<button class="sday ${x === k ? 'on' : ''} ${x === t ? 't' : ''}" data-a="pickday" data-date="${x}">${DAYN[i]}<b>${parse(x).getDate()}</b></button>`).join('') + '</div>';

  const train = `<div class="trow"><div class="grow"><div>Allenamento</div><div class="small muted">${tot.train}/${TRAIN_WEEK} questa settimana</div></div>
    ${mine ? `<button class="switch ${d.train ? 'on' : ''}" data-a="train" data-date="${k}" aria-label="Allenamento"></button>` : `<span class="muted">${d.train ? 'sì' : 'no'}</span>`}</div>
    ${d.train ? `<ul class="tips">${TRAIN_TIPS.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`;

  const rows = SLOTS.map(s => {
    const m = meals[s.id], line = shortLine(m && m.sel), dn = m && m.done;
    let prop = '';
    if (m && m.prop) {
      const pl = shortLine(m.prop.sel);
      prop = mine
        ? `<div class="prop"><div class="plabel">Consiglio di ${esc(m.prop.by || other())}</div><div class="sline">${pl}</div>
            <div class="pbtn"><button class="lnk" data-a="accept" data-date="${k}" data-slot="${s.id}">Accetta</button><button class="lnk mute" data-a="reject" data-date="${k}" data-slot="${s.id}">Rifiuta</button></div></div>`
        : `<div class="prop"><div class="plabel">Il tuo consiglio</div><div class="sline">${pl}</div>
            <div class="pbtn"><button class="lnk mute" data-a="withdraw" data-date="${k}" data-slot="${s.id}">Ritira</button></div></div>`;
    }
    return `<div class="meal ${dn ? 'isdone' : ''}">
      <div class="mrow" data-a="edit" data-date="${k}" data-slot="${s.id}">
        <div class="grow"><div class="mname">${s.name}</div><div class="sline ${line ? '' : 'none'}">${line || (mine ? 'Da pianificare' : 'Nessuna scelta')}</div></div>
        ${mine ? `<button class="eat ${dn ? 'on' : ''}" data-a="done" data-date="${k}" data-slot="${s.id}" aria-label="Segna come mangiato">${CHECK}</button>` : (dn ? `<span class="muted small">mangiato</span>` : '')}
      </div>${prop}</div>`;
  }).join('');

  const excl = `<details class="fold"><summary>Alimenti esclusi dal piano</summary><p class="small muted" style="margin:8px 0 0">${EXCL_LABELS.join(', ')}.</p></details>`;

  return `<h1 class="title">${title}</h1><p class="sub">${sub}</p>${who()}${advisorNote()}${statusLine()}${strip}
    <div class="line"><span>${planned}/${req.length} pianificati</span><b>${done}/${req.length} mangiati</b></div>
    ${train}<div class="meals">${rows}</div>${excl}`;
}

function renderSettings() {
  return `<div class="head"><h1 class="title">Profilo</h1><button class="lnk" data-a="back">Indietro</button></div>
    <div class="kv"><span>Questo telefono è</span><span>${esc(cfg.me)}</span></div>
    <div class="kv"><span>Codice stanza</span><span class="mono">${esc(cfg.room)}</span></div>
    <div class="kv"><span>Sincronizzazione</span><span>${sync.err ? 'offline' : (sync.loaded ? 'ok' : '…')}${pend.length ? ' · ' + pend.length + ' in attesa' : ''}</span></div>
    <p class="note">Per collegare l'altro telefono: apri l'app, scegli l'altro profilo e inserisci questo codice. Chi conosce il codice può leggere e scrivere i dati, quindi non diffonderlo.</p>
    <div class="actions"><button class="btn" data-a="copycode">Copia codice</button><button class="btn danger" data-a="leave">Cambia profilo su questo telefono</button></div>`;
}

function renderSetup() {
  const s = ui.setup;
  return `<h1 class="title">Dieta</h1><p class="sub" style="text-transform:none">Scegli chi sei su questo telefono. Lo fai una volta sola e non puoi sbagliare telefono per errore: il profilo resta legato a questo dispositivo.</p>
    <div class="choice">${PEOPLE.map(n => `<button class="big ${s.role === n ? 'on' : ''}" data-a="role" data-n="${n}">${n}</button>`).join('')}</div>
    <label class="lab" for="codeIn">Codice stanza</label>
    <input class="field mono" id="codeIn" value="${esc(s.code)}" autocomplete="off" autocapitalize="none" spellcheck="false">
    <p class="note">Sul primo telefono lascia il codice generato. Sul secondo inserisci lo stesso codice. Chi lo conosce può leggere e scrivere i dati.</p>
    ${s.err ? `<p class="note bad">${esc(s.err)}</p>` : ''}
    ${s.conflict ? '<button class="btn" data-a="setupforce">È il mio telefono: usa comunque questo profilo</button>' : ''}
    <button class="btn primary" data-a="setupgo">Continua</button>`;
}
function renderLock() {
  return `<h1 class="title">Profilo già in uso</h1><p class="sub" style="text-transform:none">Il profilo ${esc(cfg.me)} risulta collegato a un altro telefono. Per non mescolare i dati, qui è tutto bloccato.</p>
    <div class="actions"><button class="btn primary" data-a="claimhere">È il mio telefono: usa questo</button><button class="btn" data-a="leave">Scegli un altro profilo</button></div>`;
}

/* ============ SHEET: PIANIFICA PASTO ============ */
const root = $('sheet-root');

function pk(a, name, qty, on, cnt, cat) {
  return `<button class="pk cat-${cat} ${on ? 'on' : ''}" data-a="${a}" data-n="${esc(name)}"><span class="n"><span class="nm">${esc(name)}</span>${cnt ? `<span class="cnt">${cnt}×</span>` : ''}</span><span class="q">${esc(qty)}</span></button>`;
}
const tick = on => on ? '<span class="tick">scelto</span>' : '';
const BOLT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>';
function step(l, t, sub, cat) {
  return `<div class="step cat-${cat}"><span class="bdg">${l}</span><div><div class="stt">${t}</div><div class="sts">${sub}</div></div></div>`;
}
function preview(sel) {
  const cells = [['A', 'Carboidrato', 'carb', sel.carb], ['B', 'Proteina', 'prot', sel.prot], ['C', 'Verdura', 'veg', (sel.veg || []).join(', ')], ['D', 'Grassi', 'fat', (sel.fat || []).join(', ')]];
  return '<div class="pv">' + cells.map(c => `<div class="pvc cat-${c[2]} ${c[3] ? 'full' : ''}"><b>${c[0]}</b><span class="pl">${c[1]}</span><span class="pn">${c[3] ? esc(c[3]) : '–'}</span></div>`).join('') + '</div>';
}
function dots(c) {
  const d = [];
  if (c.carb) d.push('carb');
  if (c.prot) d.push('prot');
  if ((c.veg && c.veg.length) || /verdur/i.test(c.l)) d.push('veg');
  if (c.fat && c.fat.length) d.push('fat');
  return '<span class="cdots">' + d.map(x => `<i class="cat-${x}"></i>`).join('') + '</span>';
}

function renderSheet() {
  const sh = ui.sheet;
  if (!sh) { root.innerHTML = ''; document.body.classList.remove('noscroll'); return; }
  const slot = SLOTS.find(s => s.id === sh.slot), sel = sh.sel, mine = isMine();
  const prev = root.querySelector('.sheet-body');
  const st = prev ? prev.scrollTop : 0, anim = prev ? '' : ' anim';
  const skip = { date: sh.date, slot: sh.slot };
  const counts = weekCounts(sh.date, skip), tot = weekTotals(sh.date, skip);
  const day = getDay(sh.date);
  let b = '';

  if (slot.type !== 'main') {
    const list = slot.type === 'colazione' ? COLAZ : SPUNT;
    b += advice(counts);
    if (day && day.train && slot.id !== 'colazione') {
      b += `<p class="note">Giorno di allenamento, idee per la merenda:</p><div class="tags">${PRE_TRAIN.map(x => `<button class="tag" data-a="addpre" data-n="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;
    }
    b += `<div class="step cat-combo"><span class="bdg">${slot.type === 'colazione' ? 'C' : 'S'}</span><div><div class="stt">${slot.type === 'colazione' ? 'Colazione' : 'Spuntino'}</div><div class="sts">${slot.type === 'colazione' ? 'prevalentemente dolce, salata max 2 a settimana' : 'scegli un\'opzione, un tocco e salvi'}</div></div></div>`;
    b += list.map((o, i) => {
      const full = o.salata && tot.salata >= SALATA_MAX, on = sel.opt === o.id;
      const title = (o.name.split(' – ')[1]) || ('Opzione ' + (i + 1));
      return `<button class="optc ${on ? 'on' : ''}" style="--h:${(i * 57 + 12) % 360}" data-a="opt" data-id="${o.id}"><span class="no">${i + 1}</span><span class="ob"><span class="t"><span>${esc(title)}${o.salata ? ` <span class="sal${full ? ' max' : ''}">salata${full ? ' · limite raggiunto' : ''}</span>` : ''}</span>${tick(on)}</span><ul class="l">${o.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></span></button>`;
    }).join('');
  } else {
    if (!sel.pizza) b += preview(sel);
    b += advice(counts);
    if (slot.id === 'cena') {
      const used = tot.pizza >= PIZZA_MAX && !sel.pizza;
      b += `<button class="optc pizza ${sel.pizza ? 'on' : ''}" data-a="pizza"><span class="no">P</span><span class="ob"><span class="t"><span>Pizza ${used ? '<span class="sal max">già fatta questa settimana</span>' : '<span class="small" style="font-weight:400;opacity:.8">1 a settimana</span>'}</span>${tick(sel.pizza)}</span><span class="l2">Al posto della cena, senza compensazioni</span></span></button>`;
    }
    if (!sel.pizza) {
      const combos = COMBOS.map((c, i) => [c, i]).filter(x => x[0].s === slot.id || x[0].s === 'unico');
      b += `<div class="step cat-combo"><span class="bdg">${BOLT}</span><div><div class="stt">Scelta rapida</div><div class="sts">un tocco e il pasto è salvato</div></div></div>`;
      b += '<div class="combos">' + combos.map(x => `<button class="combo" data-a="combo" data-i="${x[1]}">${dots(x[0])}<span class="ct">${esc(x[0].l.replace('Piatto unico: ', ''))}${x[0].s === 'unico' ? ' <span class="small muted">piatto unico</span>' : ''}</span></button>`).join('') + '</div>';
      b += step('A', 'Carboidrati', 'scegline uno', 'carb') + '<div class="pick">' + CARBS.map(c => pk('carb', c[0], c[1], sel.carb === c[0], counts[c[0]] || 0, 'carb')).join('') + '</div>';
      b += step('B', 'Proteine', 'scegline una, il numero è quante volte l\'hai già scelta', 'prot') + '<div class="pick">' + PROTS.map(p => pk('prot', p[0], p[1], sel.prot === p[0], counts[p[0]] || 0, 'prot')).join('') + '</div>';
      b += step('C', 'Verdure', VEG_QTY + ', anche più di una', 'veg') + `<div class="tags">${VEG.map(v => `<button class="tag cat-veg ${(sel.veg || []).indexOf(v) > -1 ? 'on' : ''}" data-a="veg" data-n="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
      b += step('D', 'Grassi', 'per condire e completare', 'fat') + `<div class="tags">${FATS.map(f => `<button class="tag cat-fat ${(sel.fat || []).indexOf(f[0]) > -1 ? 'on' : ''}" data-a="fat" data-n="${esc(f[0])}">${esc(f[0])} <span class="tq">${esc(f[1])}</span></button>`).join('')}</div>`;
      if (sel.prot && (counts[sel.prot] || 0) >= 2) b += `<p class="note warn">${esc(sel.prot)} già scelto ${counts[sel.prot]}× questa settimana.</p>`;
      if (sel.carb && (counts[sel.carb] || 0) >= 3) b += `<p class="note warn">${esc(sel.carb)} già scelto ${counts[sel.carb]}× questa settimana.</p>`;
    }
  }

  b += `<details class="fold"${(sel.free && sel.free.length) || sh.err ? ' open' : ''}><summary>Aggiunta libera</summary>
    <div class="tags" style="margin-top:10px">${(sel.free || []).map((f, i) => `<span class="tag on">${esc(f)}<button class="x" data-a="rmfree" data-i="${i}" aria-label="Rimuovi">×</button></span>`).join('')}</div>
    ${sh.err ? `<p class="note bad">${esc(sh.err)}</p>` : ''}
    <div class="freewrap"><input id="freeIn" placeholder="Es. biscotti" value="${esc(sh.draft || '')}" autocomplete="off" autocapitalize="none" enterkeyhint="done"><button data-a="addfree">Aggiungi</button></div>
    <p class="small muted" style="margin:6px 0 0">Gli alimenti esclusi dal piano vengono bloccati.</p></details>`;

  root.innerHTML = `<div class="sheet-back${anim}" data-a="close"></div>
    <div class="sheet${anim}" role="dialog" aria-label="${esc(slot.name)}">
      <div class="sheet-head"><button data-a="close">Annulla</button><span>${mine ? '' : 'Consiglia · '}${esc(slot.name)}</span><button data-a="clear">Svuota</button></div>
      <div class="sheet-body">${b}</div>
      <div class="sheet-foot"><button class="btn primary" data-a="save">${mine ? 'Fatto' : 'Invia consiglio'}</button></div>
    </div>`;
  root.querySelector('.sheet-body').scrollTop = st;
  document.body.classList.add('noscroll');
}

function commit() {
  const sh = ui.sheet; if (!sh) return;
  const sel = cleanSel(sh.sel);
  if (isMine()) put(ui.view, mealKey(sh.date, sh.slot, 'sel'), sel);       // "Mangiato" resta sempre manuale
  else put(ui.view, mealKey(sh.date, sh.slot, 'prop'), sel ? { sel, by: cfg.me, ts: Date.now() } : null);
  ui.sheet = null;
  renderSheet(); render();
}

/* ============ RENDER & EVENTI ============ */
function render() {
  const y = window.scrollY, tb = $('tabbar');
  if (!cfg) { tb.hidden = true; view.innerHTML = renderSetup(); return; }
  if (ui.lock) { tb.hidden = true; view.innerHTML = renderLock(); return; }
  tb.hidden = ui.tab === 'settings';
  $('tab-week').classList.toggle('on', ui.tab === 'week');
  $('tab-today').classList.toggle('on', ui.tab === 'today');
  view.innerHTML = ui.tab === 'week' ? renderWeek() : ui.tab === 'today' ? renderToday() : renderSettings();
  window.scrollTo(0, y);
}
const toggleIn = (arr, v) => { const i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); return arr; };

function importOld(me) {
  const old = ls.get(OLD_KEY); if (!old || !old.days) return;
  Object.keys(old.days).forEach(k => {
    const d = old.days[k];
    if (d.train) put(me, k + '/train', true);
    Object.keys(d.meals || {}).forEach(s => {
      const m = d.meals[s], sel = m.sel && cleanSel(m.sel);
      if (sel) put(me, mealKey(k, s, 'sel'), sel);
      if (m.done) put(me, mealKey(k, s, 'done'), true);
    });
  });
  ls.del(OLD_KEY);
}

function boot() {
  ui.view = cfg.me; ui.lock = false; sync.loaded = false;
  render(); pull(); flush(); verifyClaim();
}

const H = {
  tab: ds => { ui.tab = ds.tab; render(); window.scrollTo(0, 0); },
  view: ds => { ui.view = ds.n; render(); },
  wk: ds => { const n = +ds.n; ui.wk = n === 0 ? today() : dkey(addDays(parse(ui.wk), 7 * n)); render(); },
  goday: ds => { ui.date = ds.date; ui.tab = 'today'; render(); window.scrollTo(0, 0); },
  pickday: ds => { ui.date = ds.date; render(); },
  settings: () => { ui.tab = 'settings'; render(); window.scrollTo(0, 0); },
  back: () => { ui.tab = 'week'; render(); },
  train: ds => { if (!isMine()) return; const d = getDay(ds.date); put(ui.view, ds.date + '/train', d && d.train ? null : true); render(); },
  done: ds => { if (!isMine()) return; const m = getMeal(ds.date, ds.slot); put(ui.view, mealKey(ds.date, ds.slot, 'done'), m && m.done ? null : true); render(); },
  edit: ds => {
    const m = getMeal(ds.date, ds.slot);
    const base = isMine() ? (m && m.sel) : ((m && m.prop && m.prop.sel) || (m && m.sel));
    ui.sheet = { date: ds.date, slot: ds.slot, sel: JSON.parse(JSON.stringify(base || {})), err: '', draft: '' };
    renderSheet();
  },
  accept: ds => { if (!isMine()) return; const m = getMeal(ds.date, ds.slot); if (!m || !m.prop) return; put(ui.view, mealKey(ds.date, ds.slot, 'sel'), m.prop.sel); put(ui.view, mealKey(ds.date, ds.slot, 'prop'), null); render(); },
  reject: ds => { if (!isMine()) return; put(ui.view, mealKey(ds.date, ds.slot, 'prop'), null); render(); },
  withdraw: ds => { if (isMine()) return; put(ui.view, mealKey(ds.date, ds.slot, 'prop'), null); render(); },
  close: () => { ui.sheet = null; renderSheet(); },
  clear: () => { ui.sheet.sel = {}; ui.sheet.err = ''; renderSheet(); },
  save: () => commit(),
  opt: ds => { const s = ui.sheet.sel; s.opt = s.opt === ds.id ? undefined : ds.id; commit(); },
  pizza: () => { const s = ui.sheet.sel; const on = !s.pizza; ui.sheet.sel = on ? { pizza: true, free: s.free || [] } : { free: s.free || [] }; commit(); },
  carb: ds => { const s = ui.sheet.sel; delete s.pizza; s.carb = s.carb === ds.n ? undefined : ds.n; renderSheet(); },
  prot: ds => { const s = ui.sheet.sel; delete s.pizza; s.prot = s.prot === ds.n ? undefined : ds.n; renderSheet(); },
  veg: ds => { const s = ui.sheet.sel; delete s.pizza; s.veg = toggleIn(s.veg || [], ds.n); renderSheet(); },
  fat: ds => { const s = ui.sheet.sel; delete s.pizza; s.fat = toggleIn(s.fat || [], ds.n); renderSheet(); },
  combo: ds => {
    const c = COMBOS[+ds.i], s = ui.sheet.sel;
    ui.sheet.sel = { carb: c.carb, prot: c.prot, veg: (c.veg || []).slice(), fat: (c.fat || []).slice(), free: s.free || [] };
    commit();
  },
  addpre: ds => { const s = ui.sheet.sel; s.free = s.free || []; if (s.free.indexOf(ds.n) < 0) s.free.push(ds.n); renderSheet(); },
  rmfree: ds => { ui.sheet.sel.free.splice(+ds.i, 1); renderSheet(); },
  addfree: () => {
    const inp = $('freeIn'), sh = ui.sheet; if (!inp || !sh) return;
    const txt = inp.value.trim(); if (!txt) return;
    const ex = excluded(txt);
    if (ex) { sh.err = '"' + txt + '" contiene un alimento escluso dal tuo piano (' + ex + ').'; sh.draft = txt; }
    else { sh.sel.free = sh.sel.free || []; sh.sel.free.push(txt); sh.err = ''; sh.draft = ''; }
    renderSheet();
  },

  /* --- profilo / setup --- */
  role: ds => { ui.setup.role = ds.n; ui.setup.err = ''; ui.setup.conflict = false; render(); },
  setupforce: () => { ui.setup.force = true; H.setupgo(); },
  setupgo: async () => {
    const s = ui.setup, inp = $('codeIn');
    if (inp) s.code = inp.value;
    const code = norm(s.code).replace(/[^a-z0-9]/g, '');
    if (!s.role) { s.err = 'Scegli chi sei.'; render(); return; }
    if (code.length < 8) { s.err = 'Il codice deve avere almeno 8 caratteri (lettere e numeri).'; render(); return; }
    s.err = 'Collego…'; render();
    try {
      const r = await api({ a: 'claim', role: s.role, force: s.force }, code, dev);
      if (r.status !== 200) throw new Error(r.error || 'errore');
      if (!r.ok) { s.err = 'Il profilo ' + s.role + ' è già usato da un altro telefono.'; s.conflict = true; render(); return; }
    } catch (e) { s.err = 'Server non raggiungibile o database non configurato (' + e.message + ').'; render(); return; }
    cfg = { me: s.role, room: code }; ls.set(KEY_CFG, cfg);
    ui.setup = { role: '', code: rnd(10), force: false, err: '' };
    ui.view = cfg.me;
    importOld(cfg.me);
    boot();
  },
  claimhere: async () => {
    try { const r = await api({ a: 'claim', role: cfg.me, force: true }); if (r.ok) { ui.lock = false; boot(); } } catch (e) {}
  },
  copycode: () => { try { navigator.clipboard.writeText(cfg.room); } catch (e) {} },
  leave: async () => {
    const msg = 'Questo telefono non sarà più collegato al profilo ' + cfg.me + '. I dati restano nel cloud.' + (pend.length ? ' Hai ' + pend.length + ' modifiche non ancora inviate che andranno perse.' : '') + ' Continuare?';
    if (!window.confirm(msg)) return;
    try { await api({ a: 'release', role: cfg.me }); } catch (e) {}
    ls.del(KEY_CFG); ls.del(KEY_PEND);
    cfg = null; pend = []; store = { plans: {} }; ui.lock = false; ui.tab = 'week'; ui.sheet = null; renderSheet();
    ui.setup = { role: '', code: rnd(10), force: false, err: '' };
    render();
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (el && H[el.dataset.a]) H[el.dataset.a](el.dataset, el);
});
document.addEventListener('input', e => {
  if (e.target.id === 'freeIn' && ui.sheet) ui.sheet.draft = e.target.value;
  if (e.target.id === 'codeIn') ui.setup.code = e.target.value;
});
document.addEventListener('keydown', e => { if (e.target.id === 'freeIn' && e.key === 'Enter') { e.preventDefault(); H.addfree(); } });

/* aggiornamento continuo: ogni pochi secondi e quando l'app torna in primo piano */
setInterval(() => { if (cfg && !document.hidden) { flush(); pull(); } }, 4000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && cfg) { flush(); pull(); } });
window.addEventListener('online', () => { if (cfg) { flush(); pull(); } });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

if (cfg) boot(); else render();
})();
