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

// ---------- Primerjava ----------
const METRICS = [
  ["Površina", 0, " km²", 0], ["Dolžina obale", 1, " km", 1], ["Povprečna višina", 2, " m", 0], ["Gozd", 3, " % kopnega", 1],
];
function renderCmp() {
  const n = $("pSel").value, A = DZ[n], S = DZ["Slovenija"];
  $("pCards").innerHTML = METRICS.map(([t, i, u, d]) => {
    const a = A[i], s = S[i];
    let note = "";
    if (a != null && s != null && s > 0) {
      const r = a / s;
      note = a === 0 ? "nima morja" : r >= 1.05 ? `${fmtN(r, r < 10 ? 1 : 0)}-krat več kot Slovenija` : r <= 0.95 ? `${fmtN(1 / r, 1)}-krat manj kot Slovenija` : "približno enako kot Slovenija";
    }
    const max = Math.max(a ?? 0, s ?? 0) || 1, X0 = 92, X1 = 300;
    const bar = (lbl, v, y, c) => v == null ? `<text x="${X0}" y="${y + 13}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">ni podatka</text><text x="${X0 - 8}" y="${y + 13}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12" fill="var(--ink)">${lbl}</text>` :
      `<text x="${X0 - 8}" y="${y + 13}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12" fill="var(--ink)">${lbl}</text><rect x="${X0}" y="${y + 2}" width="${Math.max(v / max * (X1 - X0), 1.5)}" height="14" rx="3" fill="${c}"/><text x="${X0 + Math.max(v / max * (X1 - X0), 1.5) + 6}" y="${y + 13}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${fmtN(v, d)}</text>`;
    const svg = `<svg class="chart" style="width:100%;height:auto;border-radius:0" viewBox="0 0 360 48" aria-hidden="true">${bar(n.length > 13 ? n.slice(0, 12) + "…" : n, a, 4, "var(--sea)")}${bar("Slovenija", s, 26, "var(--sun)")}</svg>`;
    return `<div class="card" style="grid-template-columns:1fr"><span class="ct"><span class="n">${t}${u ? " ·" + u : ""}</span>${svg}<p>${note}</p></span></div>`;
  }).join("");
}
const names = Object.keys(DZ).filter(n => n !== "Slovenija").sort((a, b) => a.localeCompare(b, "sl"));
$("pSel").innerHTML = names.map(n => `<option ${n === "Hrvaška" ? "selected" : ""}>${n}</option>`).join("");
$("pSel").addEventListener("change", renderCmp);
renderCmp();
