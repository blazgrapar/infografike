// ---------- Imena in priimki ----------
const FEM = [["Marija", 41402], ["Ana", 21605], ["Maja", 13800], ["Sara", 9231]];
const MAL = [["Franc", 17590], ["Marko", 17158], ["Janez", 17077]];
const BABY = [["Mark", "Ema"], ["Jakob", "Mia"], ["Filip", "Julija"], ["Luka", "Hana"], ["Nik", "Zala"],
  ["Liam", "Ajda"], ["Oliver", "Vita"], ["Lovro", "Sofija"], ["Oskar", "Ela"], ["Lan", "Lara"]];

function drawNames() {
  const X0 = 74, X1 = 300, MAX = 42000, rowH = 26;
  const bar = (n, v, y, col) => {
    const w = v / MAX * (X1 - X0);
    return `<text x="${X0 - 8}" y="${y + 14}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12.5" fill="var(--ink)">${n}</text>` +
      `<rect x="${X0}" y="${y + 2}" width="${w}" height="16" rx="3" fill="${col}"/>` +
      `<text x="${X0 + w + 6}" y="${y + 14}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${v.toLocaleString("sl-SI")}</text>`;
  };
  let g = `<text x="0" y="12" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">Ženska</text>`;
  FEM.forEach(([n, v], k) => { g += bar(n, v, 20 + k * rowH, "var(--temp)"); });
  const y2 = 20 + FEM.length * rowH + 20;
  g += `<text x="0" y="${y2 - 8}" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">Moška</text>`;
  MAL.forEach(([n, v], k) => { g += bar(n, v, y2 + k * rowH, "var(--sea)"); });
  g += `<text x="0" y="${y2 + MAL.length * rowH + 16}" font-family="Source Sans 3, sans-serif" font-size="11" fill="var(--muted)">Sledijo Andrej, Luka, Ivan in Anton, vsak z več kot 13.000 nosilci.</text>`;
  $("iNames").innerHTML = g;
}
function renderBaby() {
  $("iBaby").innerHTML = `<thead><tr><th>Mesto</th><th>Dečki</th><th>Deklice</th></tr></thead><tbody>` +
    BABY.map(([b, d], k) => `<tr><td class="num">${k + 1}.</td><td>${b}</td><td>${d}</td></tr>`).join("") + `</tbody>`;
}
drawNames();
renderBaby();
