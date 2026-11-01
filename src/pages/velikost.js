// [površina km², obala km (CIA), povprečna višina m, gozd % kopnega]
const DZ = {
  "Slovenija": [20273, 46.6, 492, 61.3], "Avstrija": [83878, 0, 910, 47.2], "Hrvaška": [56594, 5835, 331, 34.7],
  "Madžarska": [93025, 0, 143, 22.5], "Italija": [302068, 7600, 538, 32.7], "Švica": [41291, 0, 1350, 32.3],
  "Nemčija": [357581, 2389, 263, 32.7], "Francija": [643801, 4853, 375, 31.8], "Španija": [505370, 4964, 660, 37.2],
  "Norveška": [386224, 83281, 460, 33.5], "Nizozemska": [41865, null, 30, 11.0], "Črna gora": [13888, 293.5, 1086, 61.5],
  "Bosna in Hercegovina": [51209, 20, 500, 42.7], "Grčija": [131957, 13676, null, 30.3], "Združeno kraljestvo": [244376, 12429, null, 13.3],
  "Islandija": [103000, null, null, 0.5], "Rusija": [17098246, 37653, null, 49.8], "Kanada": [9984670, 202080, null, 39.5],
  "Japonska": [377915, 29751, null, 68.4], "Kitajska": [9596960, null, 1840, null], "Srbija": [88499, 0, null, null],
};
const fmtN = (v, d = 0) => v == null ? "–" : v.toLocaleString("sl-SI", { maximumFractionDigits: d });
function hbars(items, { X0 = 118, X1 = 300, rowH = 26, max, unit = "", hl = "Slovenija", dec = 0, col = "var(--sea)" } = {}) {
  const m = max ?? Math.max(...items.map(i => i[1]));
  let g = "";
  items.forEach(([n, v], k) => {
    const y = 6 + k * rowH, w = Math.max(v / m * (X1 - X0), 1.5), on = n === hl;
    g += `<text x="${X0 - 8}" y="${y + 14}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12" fill="var(--ink)" ${on ? 'font-weight="700"' : ""}>${n}</text>`;
    g += `<rect x="${X0}" y="${y + 3}" width="${w}" height="15" rx="3" fill="${on ? "var(--sun)" : col}" fill-opacity="${on ? 1 : 0.75}"/>`;
    g += `<text x="${X0 + w + 6}" y="${y + 14}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${fmtN(v, dec)}${unit}</text>`;
  });
  return { g, h: 12 + items.length * rowH };
}

// ---------- Velikost držav ----------
function drawBig() {
  const items = [["Rusija", 17.10], ["Kanada", 9.98], ["Kitajska", 9.60], ["ZDA", 9.53], ["Brazilija", 8.51]];
  const { g } = hbars(items, { unit: " mio km²", dec: 2, X0: 84 });
  $("vBig").innerHTML = g;
}
function initSel() {
  const names = Object.keys(DZ).filter(n => n !== "Slovenija").sort((a, b) => DZ[b][0] - DZ[a][0]);
  $("vSel").innerHTML = names.map(n => `<option ${n === "Italija" ? "selected" : ""}>${n}</option>`).join("");
  $("vSel").addEventListener("change", drawSq);
}
function drawSq() {
  const n = $("vSel").value, A = DZ[n][0], S = DZ["Slovenija"][0], r = A / S;
  $("vAns").textContent = r >= 1 ? `${n} je ${fmtN(r, r < 10 ? 1 : 0)}-krat večja od Slovenije` : `Slovenija je ${fmtN(1 / r, 1)}-krat večja od države ${n}`;
  const big = Math.max(A, S), side = 220, sA = Math.sqrt(A / big) * side, sS = Math.sqrt(S / big) * side;
  let g = `<rect x="10" y="${230 - sA}" width="${sA}" height="${sA}" fill="var(--sea)" fill-opacity="0.35" stroke="var(--sea)"/>`;
  g += `<rect x="10" y="${230 - sS}" width="${Math.max(sS, 1.5)}" height="${Math.max(sS, 1.5)}" fill="var(--sun)"/>`;
  g += `<text x="${Math.min(10 + sA + 8, 250)}" y="${230 - sA + 14}" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">${n}</text>`;
  g += `<text x="${10 + Math.max(sS, 2) + 8}" y="226" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--sun)">Slovenija</text>`;
  $("vSq").innerHTML = g;
}
drawBig();
initSel();
drawSq();
