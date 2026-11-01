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

// ---------- Gore in gozdovi ----------
function drawElev() {
  const items = [["Butan", 3280], ["Nepal", 3265], ["Tadžikistan", 3186], ["Kirgizija", 2988], ["Kitajska", 1840], ["Švica", 1350], ["Črna gora", 1086],
    ["Avstrija", 910], ["Španija", 660], ["Italija", 538], ["Slovenija", 492], ["Hrvaška", 331], ["Madžarska", 143], ["Nizozemska", 30], ["Maldivi", 1.5]];
  const r = hbars(items, { unit: " m", X0: 92, rowH: 20 });
  $("gElev").innerHTML = r.g;
}
function drawForest() {
  const items = [["Surinam", 94.5], ["Gabon", 91.2], ["Finska", 73.7], ["Švedska", 68.7], ["Japonska", 68.4], ["Črna gora", 61.5], ["Slovenija", 61.3],
    ["Avstrija", 47.2], ["Hrvaška", 34.7], ["Italija", 32.7], ["Nemčija", 32.7], ["Francija", 31.8], ["Madžarska", 22.5], ["Velika Britanija", 13.3], ["Nizozemska", 11.0], ["Islandija", 0.5]];
  $("gForest").innerHTML = hbars(items, { unit: " %", X0: 102, rowH: 20, max: 100, dec: 1, col: "var(--sea)" }).g;
}
drawElev();
drawForest();
