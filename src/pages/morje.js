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

// ---------- Morje in obale ----------
function drawGrid() {
  let g = "";
  for (let k = 0; k < 100; k++) {
    const c = k % 25, r = Math.floor(k / 25);
    g += `<rect x="${8 + c * 13.8}" y="${8 + r * 27}" width="11" height="22" rx="2" fill="${k < 71 ? "var(--sea)" : "var(--sun)"}"/>`;
  }
  $("mGrid").innerHTML = g;
}
function drawPara() {
  // fraktalna obala (Kochova krivulja) in dva merila
  const koch = (p, q, n) => {
    if (!n) return [p];
    const [x1, y1] = p, [x5, y5] = q, dx = (x5 - x1) / 3, dy = (y5 - y1) / 3;
    const a = [x1 + dx, y1 + dy], b = [x1 + 2 * dx, y1 + 2 * dy];
    const c = [(a[0] + b[0]) / 2 - (b[1] - a[1]) * Math.sqrt(3) / 2, (a[1] + b[1]) / 2 + (b[0] - a[0]) * Math.sqrt(3) / 2];
    return [...koch(p, a, n - 1), ...koch(a, c, n - 1), ...koch(c, b, n - 1), ...koch(b, q, n - 1)];
  };
  const P = [20, 120], Q = [340, 120];
  const full = [...koch(P, Q, 4), Q], mid = [...koch(P, Q, 1), Q];
  let g = `<path d="${ptsToD(full)}" fill="none" stroke="var(--sea)" stroke-width="1.5"/>`;
  g += `<path d="${ptsToD(mid)}" fill="none" stroke="var(--sun)" stroke-width="2" stroke-dasharray="5 4"/>`;
  g += `<line x1="20" x2="340" y1="120" y2="120" stroke="var(--temp)" stroke-width="2" stroke-dasharray="2 4"/>`;
  g += `<text x="20" y="150" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--temp)">dolgo merilo: 320</text>`;
  g += `<text x="180" y="150" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--sun)">srednje: 427</text>`;
  g += `<text x="340" y="150" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--sea)">fino: 1.011</text>`;
  g += `<text x="20" y="166" font-family="Source Sans 3, sans-serif" font-size="11" fill="var(--muted)">Ista obala, izmerjena z različno dolgimi koraki.</text>`;
  $("mPara").innerHTML = g;
}
function drawLong() {
  const items = [["Kanada", 202080], ["Norveška", 83281], ["Indonezija", 54716], ["Rusija", 37653], ["Filipini", 36289], ["Japonska", 29751]];
  $("mLong").innerHTML = hbars(items, { unit: " km", X0: 84 }).g;
}
drawGrid();
drawPara();
drawLong();
