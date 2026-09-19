const fs = require('fs');
const streets = JSON.parse(fs.readFileSync('./src/data/streets.json', 'utf8'));

const testCases = [
  "Амосова (Корчагинцева)",
  "Шевченка",
  "Героїв Праці",
  "Ювілейний",
  "Академіка Павлова"
];

for (const t of testCases) {
  const q = t.toLowerCase().replace(/вул\.|пров\.|просп\.|пр-т|м\.|пер\.|ул\.|проспект/g, '').trim();
  const stList = streets.filter(s => {
      const cur = s.current_name.toLowerCase();
      if (cur.length > 2 && (q.includes(cur) || cur.includes(q))) return true;
      if (s.old_names) {
          return s.old_names.some(o => {
              const old = o.toLowerCase();
              return old.length > 2 && (q.includes(old) || old.includes(q));
          });
      }
      return false;
  });
  console.log(`\nTest: ${t} -> ${stList.length} matches`);
  if (stList.length > 0) {
      console.log("  " + stList.map(s => s.current_name).slice(0, 5).join(', '));
  }
}
