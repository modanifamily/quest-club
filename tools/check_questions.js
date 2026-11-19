// Validates the Quiz Master question bank in index.html.
// Usage: node tools/check_questions.js [expectedMinimumCount]
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const start = html.indexOf('const COUNTRY_RAW'), end = html.indexOf('const BOT_LEVELS');
if (start < 0 || end < 0) { console.error('Could not find question data'); process.exit(1); }
eval(html.slice(start, end).replace(/^const /gm, 'var '));
const CATS = ['India','History','World','Nature','Animals','Space','Physics','Chemistry','Biology','Maths','Reasoning'];
let errors = 0; const seen = new Set(); const byCat = {}; const hard = {};
OLY.forEach((q, i) => {
  const where = '#' + i + ' "' + (q.q || '').slice(0, 60) + '"';
  if (!CATS.includes(q.c)) { console.error('Bad category', where, q.c); errors++; }
  if (!q.q || !q.e) { console.error('Missing question/explanation', where); errors++; }
  if (!Array.isArray(q.o) || q.o.length !== 4 || new Set(q.o).size !== 4) { console.error('Need 4 unique options', where); errors++; }
  if (!(q.a >= 0 && q.a <= 3)) { console.error('Bad answer index', where); errors++; }
  if (q.d !== undefined && q.d !== 2) { console.error('d must be 2 or absent', where); errors++; }
  const key = (q.q || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seen.has(key)) { console.error('Duplicate question', where); errors++; }
  seen.add(key);
  byCat[q.c] = (byCat[q.c] || 0) + 1; if (q.d === 2) hard[q.c] = (hard[q.c] || 0) + 1;
});
const min = Number(process.argv[2] || 0);
if (OLY.length < min) { console.error('Expected at least', min, 'questions, found', OLY.length); errors++; }
console.log('Total', OLY.length, '| Challenge', Object.values(hard).reduce((a, b) => a + b, 0));
console.log('By topic', JSON.stringify(byCat));
console.log('Challenge by topic', JSON.stringify(hard));
if (errors) { console.error(errors, 'problem(s) found'); process.exit(1); }
console.log('OK');
