// Vercel Serverless Function: /api/sync
// Le credenziali stanno nelle variabili d'ambiente di Vercel, mai nel browser.
const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
const ROLES = ['Giorgio', 'Lucia'];
const enc = encodeURIComponent;

const RE_ID = /^[a-z0-9]{8,40}$/;
const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_KEY = /^\d{4}-\d{2}-\d{2}\/(train|meals\/[a-z_]+\/(sel|done|prop))$/;

async function sb(path, opt = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opt,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...(opt.headers || {})
    }
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Variabili SUPABASE_URL / SUPABASE_SERVICE_KEY mancanti' });

  const b = req.body || {};
  const { a, room, dev } = b;
  if (!RE_ID.test(room || '') || !RE_ID.test(dev || '')) return res.status(400).json({ error: 'bad request' });

  try {
    const claims = await sb(`diet_devices?room=eq.${enc(room)}&select=role,dev`);
    const mine = claims.filter(c => c.dev === dev).map(c => c.role);

    /* --- Profilo: uno solo per telefono, uno solo per ruolo --- */
    if (a === 'claim') {
      const role = b.role;
      if (!ROLES.includes(role)) return res.status(400).json({ error: 'role' });
      const cur = claims.find(c => c.role === role);
      if (cur && cur.dev !== dev && !b.force) return res.status(200).json({ ok: false, taken: true });
      await sb(`diet_devices?room=eq.${enc(room)}&dev=eq.${enc(dev)}&role=neq.${enc(role)}`, { method: 'DELETE' });
      await sb('diet_devices?on_conflict=room,role', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ room, role, dev, claimed_at: new Date().toISOString() })
      });
      return res.status(200).json({ ok: true });
    }

    if (a === 'release') {
      await sb(`diet_devices?room=eq.${enc(room)}&role=eq.${enc(b.role || '')}&dev=eq.${enc(dev)}`, { method: 'DELETE' });
      return res.status(200).json({ ok: true });
    }

    /* Da qui in poi serve un profilo reclamato da questo telefono */
    if (!mine.length) return res.status(403).json({ error: 'noclaim', noclaim: true });

    if (a === 'read') {
      const since = RE_DATE.test(b.since || '') ? b.since : '0000-00-00';
      let rows = [];
      for (let off = 0; off < 5000; off += 1000) {
        const page = await sb(`diet_cells?room=eq.${enc(room)}&k=gte.${enc(since)}&select=owner,k,v&order=owner,k&limit=1000&offset=${off}`);
        rows = rows.concat(page);
        if (page.length < 1000) break;
      }
      return res.status(200).json({ ok: true, rows });
    }

    if (a === 'write') {
      const owner = b.owner;
      const ops = Array.isArray(b.ops) ? b.ops : [];
      if (!ROLES.includes(owner) || !ops.length || ops.length > 60) return res.status(400).json({ error: 'bad write' });
      const isOwner = mine.includes(owner);
      const isAdvisor = mine.some(r => r !== owner);
      for (const o of ops) {
        if (!RE_KEY.test(o.k || '')) return res.status(400).json({ error: 'bad key' });
        if (o.v !== null && JSON.stringify(o.v).length > 3000) return res.status(400).json({ error: 'too big' });
        const field = o.k.split('/').pop();
        if (!(isOwner || (isAdvisor && field === 'prop'))) return res.status(403).json({ error: 'forbidden' });
      }
      const now = new Date().toISOString();
      const up = ops.filter(o => o.v !== null).map(o => ({ room, owner, k: o.k, v: o.v, updated_at: now }));
      if (up.length) {
        await sb('diet_cells?on_conflict=room,owner,k', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(up)
        });
      }
      await Promise.all(ops.filter(o => o.v === null).map(o =>
        sb(`diet_cells?room=eq.${enc(room)}&owner=eq.${enc(owner)}&k=eq.${enc(o.k)}`, { method: 'DELETE' })));
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'action' });
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
};
