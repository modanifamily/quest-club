// Quest Club — weekly email report (add as a SECOND file next to Code.gs)
// After saving: choose "setupWeeklyEmail" in the function menu and press Run once.

const REPORT_TO = 'amodani@tataadvancedsystems.com'; // weekly report goes here
const APP_URL = 'https://modanifamily.github.io/quest-club/';
const TZ = 'Asia/Kolkata';

function readKids_() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const kids = {};
  rows.forEach(r => {
    if (r[0]) kids[r[0]] = { updated: Number(r[1]) || 0, data: JSON.parse(r[3] || '{}') };
  });
  return kids;
}

// ===================== WEEKLY EMAIL =====================
// Run this ONCE: schedules the email for every Sunday ~7 pm IST and sends a test copy now.
function setupWeeklyEmail() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'weeklyReport') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('weeklyReport').timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(19).inTimezone(TZ).create();
  weeklyReport();
}

const KIDS = [
  { id: 'avanya', name: 'Avanya', em: '🦋', age: 11 },
  { id: 'aaranya', name: 'Aaranya', em: '🦄', age: 8 },
];
const RANKS = [['Pawn', 0], ['Knight', 200], ['Bishop', 500], ['Rook', 1000], ['Queen', 2000], ['King', 3500], ['Grandmaster', 6000]];
const SPRINT_BENCH = { 1: 20, 2: 25, 3: 18, 4: 15 };
const SPRINT_NAME = { 1: 'Class 3', 2: 'Explorer', 3: 'Olympiad', 4: 'Champion' };
const TIPS = {
  'Maths & Logic': 'a daily Math Sprint plus Maths and Reasoning rounds in Quiz Master',
  'Science': 'a Physics, Chemistry or Biology round a few times a week',
  'General Knowledge': 'one Mixed Quiz Master round a day',
  'Geography': 'World Explorer in Capital mode',
  'Memory': 'one Memory Grid game a day',
  'Chess': 'chess puzzles, aiming to solve them on the first try',
  'Coding & AI': 'the next Code-a-Bot level in Robo Lab',
};

function rankOf_(xp) { let r = RANKS[0][0]; RANKS.forEach(x => { if (xp >= x[1]) r = x[0]; }); return r; }
function days_(n, offset) {
  const out = [];
  for (let i = n - 1 + offset; i >= offset; i--) out.push(Utilities.formatDate(new Date(Date.now() - i * 86400000), TZ, 'yyyy-MM-dd'));
  return out;
}
const sumMap_ = (m, ds) => ds.reduce((a, d) => a + ((m || {})[d] || 0), 0);
const sumPair_ = (m, ds) => ds.reduce((a, d) => { const v = (m || {})[d]; return v ? [a[0] + v[0], a[1] + v[1]] : a; }, [0, 0]);
function acc_(qs, cats) { let r = 0, t = 0; cats.forEach(c => { const v = (qs || {})[c]; if (v) { r += v.r; t += v.t; } }); return t >= 5 ? Math.round(r / t * 100) : null; }
const avg_ = a => { a = a.filter(x => x !== null && x !== undefined); return a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null; };
const cnt_ = o => Object.keys(o || {}).length;

function streams_(p) {
  const out = [];
  const lv = [4, 3, 2, 1].find(l => p.sprintBest && p.sprintBest[l]);
  const sp = lv ? Math.min(100, Math.round(p.sprintBest[lv] / SPRINT_BENCH[lv] * 100)) : null;
  out.push(['Maths & Logic', avg_([acc_(p.qstats, ['Maths', 'Reasoning']), sp])]);
  out.push(['Science', acc_(p.qstats, ['Physics', 'Chemistry', 'Biology'])]);
  out.push(['General Knowledge', acc_(p.qstats, ['India', 'History', 'World', 'Nature', 'Animals', 'Space'])]);
  let wr = 0, wt = 0; Object.values(p.ws || {}).forEach(w => { wr += w.r; wt += w.t; });
  out.push(['Geography', wt >= 10 ? Math.round(wr / wt * 100) : null]);
  out.push(['Memory', p.memBest ? Math.min(100, Math.round(p.memBest / 8 * 100)) : null]);
  const sc = p.score || { w: 0, d: 0, l: 0 }, games = sc.w + sc.d + sc.l, L = cnt_(p.lessons), P = cnt_(p.puzzles), pz = p.pz || { s: 0, f: 0 };
  out.push(['Chess', (L || P || games) ? avg_([L * 10, pz.s >= 3 ? Math.round(pz.f / pz.s * 100) : (P ? P * 5 : null), games >= 3 ? Math.round((sc.w + 0.5 * sc.d) / games * 100) : null]) : null]);
  const bot = cnt_(p.bot), cards = cnt_(p.cardsSeen), teach = !!(p.badges || {}).teach;
  out.push(['Coding & AI', (bot || cards || teach) ? Math.round(bot / 8 * 60 + (teach ? 20 : 0) + cards / 12 * 20) : null]);
  return out;
}
function label_(v) {
  if (v === null || v === undefined) return ['Not tried yet', '#999999'];
  if (v >= 80) return ['Strong', '#1d9a5b'];
  if (v >= 60) return ['Good', '#6a4cf0'];
  if (v >= 40) return ['Developing', '#d98c00'];
  return ['Needs focus', '#d64545'];
}
const esc_ = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function kidSection_(kid, rec) {
  let h = '<div style="border:1px solid #e6e1ff;border-radius:14px;padding:16px;margin:16px 0;background:#ffffff">';
  h += '<h2 style="margin:0 0 6px;color:#2d2a4a">' + kid.em + ' ' + kid.name + ' <span style="font-weight:normal;font-size:14px;color:#777">(age ' + kid.age + ')</span></h2>';
  if (!rec || !rec.data || !rec.data.xp) return h + '<p>No activity synced yet.</p></div>';
  const p = rec.data, wk = days_(7, 0), pw = days_(7, 7);
  const minW = sumMap_(p.mins, wk), minP = sumMap_(p.mins, pw), xpW = sumMap_(p.dxp, wk), xpP = sumMap_(p.dxp, pw);
  const daysW = wk.filter(d => (p.mins || {})[d] || (p.dxp || {})[d]).length;
  const qW = sumPair_(p.dq, wk), qP = sumPair_(p.dq, pw);
  const badgesW = Object.entries(p.badges || {}).filter(([k, d]) => wk.includes(d)).length;
  const arrow = (a, b) => a > b ? '▲' : a < b ? '▼' : '•';

  h += '<p style="margin:4px 0 12px;color:#444">' + rankOf_(p.xp) + ' · <b>' + p.xp + ' XP</b> · 🔥 ' + (p.streak || 0) + '-day streak · 🏅 ' + cnt_(p.badges) + (cnt_(p.badges) === 1 ? ' badge' : ' badges') + ' · last played ' + (p.lastDay || '—') + '</p>';

  // This week table
  h += '<table style="border-collapse:collapse;width:100%;font-size:14px;margin-bottom:12px">';
  h += '<tr style="background:#f4f1ff"><th align="left" style="padding:6px">This week</th><th align="right" style="padding:6px">This week</th><th align="right" style="padding:6px">Last week</th></tr>';
  const row = (k, a, b, suf) => '<tr><td style="padding:6px;border-bottom:1px solid #eee">' + k + '</td><td align="right" style="padding:6px;border-bottom:1px solid #eee"><b>' + a + (suf || '') + '</b> ' + (typeof a === 'number' && typeof b === 'number' ? arrow(a, b) : '') + '</td><td align="right" style="padding:6px;border-bottom:1px solid #eee;color:#777">' + b + (suf || '') + '</td></tr>';
  h += row('Time played', minW, minP, ' min');
  h += row('Days active', daysW, pw.filter(d => (p.mins || {})[d] || (p.dxp || {})[d]).length, ' / 7');
  h += row('XP earned', xpW, xpP, '');
  h += row('Quiz accuracy', qW[1] ? Math.round(qW[0] / qW[1] * 100) : '—', qP[1] ? Math.round(qP[0] / qP[1] * 100) : '—', (qW[1] || qP[1]) ? '%' : '');
  h += row('Quiz questions answered', qW[1], qP[1], '');
  h += '</table>';

  // Time and score by subject: this week vs last week
  const SUBJ = ['Maths & Logic', 'Science', 'General Knowledge', 'Geography', 'Memory', 'Chess', 'Coding & AI'];
  const agg = (days, k) => { let m = 0, r = 0, t = 0; days.forEach(d => { m += ((p.dm || {})[d] || {})[k] || 0; const v = ((p.ds || {})[d] || {})[k]; if (v) { r += v[0]; t += v[1]; } }); return { m: m, s: t >= 3 ? Math.round(r / t * 100) : null }; };
  const subjRows = SUBJ.map(k => { const a = agg(wk, k), b = agg(pw, k); if (!a.m && !b.m && a.s === null && b.s === null) return ''; 
    const ar = (x, y) => (x === null || y === null) ? '' : x > y ? ' <span style="color:#1d9a5b">▲</span>' : x < y ? ' <span style="color:#d64545">▼</span>' : '';
    return '<tr><td style="padding:5px 6px;border-bottom:1px solid #eee">' + k + '</td><td align="right" style="padding:5px 6px;border-bottom:1px solid #eee"><b>' + a.m + ' min</b>' + ar(a.m, b.m) + '</td><td align="right" style="padding:5px 6px;border-bottom:1px solid #eee;color:#777">' + b.m + '</td><td align="right" style="padding:5px 6px;border-bottom:1px solid #eee"><b>' + (a.s === null ? '—' : a.s + '%') + '</b>' + ar(a.s, b.s) + '</td><td align="right" style="padding:5px 6px;border-bottom:1px solid #eee;color:#777">' + (b.s === null ? '—' : b.s + '%') + '</td></tr>'; }).join('');
  if (subjRows) {
    h += '<h3 style="margin:14px 0 6px;color:#2d2a4a">📚 By subject</h3><table style="border-collapse:collapse;width:100%;font-size:13px">';
    h += '<tr style="background:#f4f1ff"><th align="left" style="padding:5px 6px">Subject</th><th align="right" style="padding:5px 6px">Time</th><th align="right" style="padding:5px 6px">last wk</th><th align="right" style="padding:5px 6px">Score</th><th align="right" style="padding:5px 6px">last wk</th></tr>' + subjRows + '</table>';
  }

  // Insights
  const st = streams_(p), tried = st.filter(x => x[1] !== null && x[1] !== undefined).sort((a, b) => b[1] - a[1]);
  const tips = [];
  const top = tried.filter(x => x[1] >= 70).slice(0, 2);
  if (top.length) tips.push('💪 <b>Strengths:</b> ' + top.map(x => x[0] + ' (' + x[1] + ')').join(' and ') + '.');
  if (tried.length > 1 && tried[tried.length - 1][1] < 65) { const lo = tried[tried.length - 1]; tips.push('🎯 <b>Focus area:</b> ' + lo[0] + ' (' + lo[1] + '). Suggest ' + TIPS[lo[0]] + '.'); }
  const topics = Object.entries(p.qstats || {}).filter(([c, v]) => v.t >= 5).map(([c, v]) => [c, Math.round(v.r / v.t * 100), v.t]).sort((a, b) => b[1] - a[1]);
  if (topics.length >= 2) {
    const b = topics[0], w = topics[topics.length - 1];
    tips.push('📚 <b>Quiz topics:</b> best in ' + b[0] + ' (' + b[1] + '%)' + (w[1] < 70 ? '; weakest in ' + w[0] + ' (' + w[1] + '% over ' + w[2] + ' questions).' : '; no weak topic so far.'));
  }
  if (qW[1] >= 5 && qP[1] >= 5) { const a = Math.round(qW[0] / qW[1] * 100), b = Math.round(qP[0] / qP[1] * 100); tips.push((a >= b ? '📈' : '📉') + ' <b>Quiz accuracy</b> ' + (a >= b ? 'improved' : 'dipped') + ' from ' + b + '% to ' + a + '%.'); }
  const hst = p.hst || { r: 0, t: 0 };
  if (hst.t >= 5) { const r = hst.r / hst.t; tips.push('🔥 <b>Challenge questions:</b> ' + Math.round(r * 100) + '% over ' + hst.t + (r >= 0.75 ? ' — ready for harder material.' : r < 0.5 ? ' — a mix of Standard rounds would build confidence.' : ' — a good stretch level.')); }
  const spW = (p.sh || []).filter(x => wk.includes(x.d));
  if (spW.length) { const best = spW.reduce((a, x) => x.s > a.s ? x : a, spW[0]); tips.push('⚡ <b>Math Sprint:</b> ' + spW.length + ' sprint' + (spW.length > 1 ? 's' : '') + ' this week, best ' + best.s + ' on ' + SPRINT_NAME[best.l] + ' (all-time best ' + ((p.sprintBest || {})[best.l] || best.s) + ').'); }
  if (badgesW) tips.push('🏅 Earned <b>' + badgesW + ' new badge' + (badgesW > 1 ? 's' : '') + '</b> this week.');
  tips.push('🗓️ <b>Consistency:</b> ' + (daysW >= 5 ? 'excellent — played on ' + daysW + ' days.' : daysW >= 3 ? 'good — played on ' + daysW + ' days.' : daysW ? 'played on only ' + daysW + ' day' + (daysW > 1 ? 's' : '') + '; a short daily slot would help.' : 'no play this week.'));
  const ar = p.area || {}, at = Object.values(ar).reduce((a, b) => a + b, 0);
  if (at >= 15) tips.push('⚖️ <b>Time split (all time):</b> ' + ['Chess', 'Brain games', 'Robo Lab'].map(k => k + ' ' + Math.round((ar[k] || 0) / at * 100) + '%').join(', ') + '.');
  const untried = st.filter(x => x[1] === null || x[1] === undefined).map(x => x[0]);
  if (untried.length) tips.push('🆕 <b>Not tried yet:</b> ' + untried.join(', ') + '.');
  h += '<h3 style="margin:14px 0 6px;color:#2d2a4a">🔎 Key insights</h3><ul style="margin:0;padding-left:20px;line-height:1.55">' + tips.map(t => '<li>' + t + '</li>').join('') + '</ul>';

  // Scorecard
  h += '<h3 style="margin:14px 0 6px;color:#2d2a4a">📊 Stream scorecard</h3><table style="border-collapse:collapse;width:100%;font-size:14px">';
  st.forEach(x => {
    const L = label_(x[1]), w = x[1] || 0;
    h += '<tr><td style="padding:5px 6px;width:32%">' + x[0] + '</td><td style="padding:5px 6px;width:40%"><div style="background:#eeeeee;border-radius:6px;height:10px;width:100%"><div style="background:' + L[1] + ';height:10px;border-radius:6px;width:' + w + '%"></div></div></td><td align="right" style="padding:5px 6px;color:' + L[1] + ';white-space:nowrap"><b>' + (x[1] !== null && x[1] !== undefined ? x[1] + ' · ' : '') + L[0] + '</b></td></tr>';
  });
  h += '</table>';

  // Questions to revisit
  if (p.wq && p.wq.length) {
    h += '<h3 style="margin:14px 0 6px;color:#2d2a4a">❓ Questions to talk through with ' + kid.name + '</h3><ul style="margin:0;padding-left:20px;line-height:1.5">';
    p.wq.forEach(q => { h += '<li>' + esc_(q.q) + '<br><span style="color:#1d7a49">✅ ' + esc_(q.a) + '</span> <span style="color:#999">(' + esc_(q.c) + ')</span></li>'; });
    h += '</ul>';
  }
  return h + '</div>';
}

function weeklyReport() {
  const kids = readKids_();
  const wk = days_(7, 0);
  const range = Utilities.formatDate(new Date(wk[0] + 'T12:00:00'), TZ, 'd MMM') + ' – ' + Utilities.formatDate(new Date(wk[6] + 'T12:00:00'), TZ, 'd MMM yyyy');
  let html = '<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;background:#fbf8f2;padding:16px;color:#2d2a4a">';
  html += '<h1 style="margin:0;font-size:22px">♞ Quest Club — weekly report</h1><p style="margin:4px 0 0;color:#666">' + range + '</p>';
  KIDS.forEach(k => { html += kidSection_(k, kids[k.id]); });
  html += '<p style="font-size:12px;color:#888">Scores are out of 100: Strong 80+, Good 60–79, Developing 40–59. Based on quiz accuracy (5+ answers), Math Sprint against a benchmark for the level, best Memory Grid level, chess progress and Robo Lab progress. Live details: <a href="' + APP_URL + '">Parent board</a>.</p></div>';
  const text = 'Quest Club weekly report (' + range + '). Open this email in an HTML-capable mail app to see the full report, or visit ' + APP_URL;
  MailApp.sendEmail({ to: REPORT_TO, subject: '♞ Quest Club weekly report — Avanya & Aaranya (' + range + ')', body: text, htmlBody: html, name: 'Quest Club' });
}
