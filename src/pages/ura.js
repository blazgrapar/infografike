// ---------- Ura in časovni pasovi ----------
const TOWNS = [
  ["Vigo, Španija", -8.72], ["Pariz", 2.35], ["Koper", 13.73], ["Ljubljana", 14.51],
  ["Celje", 15.27], ["Murska Sobota", 16.17], ["Lendava", 16.46], ["Varšava", 21.01],
];
const clock = m => { m = ((Math.round(m) % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}.${String(m % 60).padStart(2, "0")}`; };

function renderNoon(a) {
  const st = localMidnight(a[0], a[1], a[2]), e = events(sunAt, st);
  const t = e.top.t, base = (t - st) / 60000;
  const off = tzOffsetMin(t) === 120 ? " (poletni čas)" : "";
  const rows = [["Koper", 13.73], ["Ljubljana", 14.51], ["Lendava", 16.46]].map(([n, lon]) => {
    const m = base + (LON - lon) * 4;
    return `<div><span class="k">${n}</span><span class="v">${clock(m)}</span></div>`;
  }).join("");
  $("uNoon").innerHTML = rows + `<div><span class="d">Sonce je najvišje ${Math.round(e.top.alt)}° nad obzorjem${off}.</span></div>`;
}

function drawNoonChart() {
  const X0 = 40, X1 = 352, Y0 = 14, Y1 = 176, M0 = 11 * 60 + 30, M1 = 13 * 60 + 30;
  const cx = i => X0 + i / 364 * (X1 - X0), cy = m => Y1 - (m - M0) / (M1 - M0) * (Y1 - Y0);
  const pts = [];
  for (let i = 0; i < 365; i += 2) { const s = dayStart(i), e = events(sunAt, s); pts.push([i, (e.top.t - s) / 60000]); }
  let g = "";
  for (let m = M0; m <= M1; m += 30) {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(m)}" y2="${cy(m)}" stroke="var(--line)" ${m === 720 ? 'stroke-width="1.5" stroke="var(--muted)"' : ""}/>` +
      `<text x="${X0 - 5}" y="${cy(m) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${clock(m)}</text>`;
  }
  "JFMAMJJASOND".split("").forEach((l, m) => {
    const a = doy(m + 1, 1), b = m < 11 ? doy(m + 2, 1) : 365;
    g += `<text x="${cx((a + b) / 2)}" y="${Y1 + 18}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${l}</text>`;
  });
  // razdeli na odseke ob skokih
  let seg = [], segs = [];
  pts.forEach((p, k) => { if (k && Math.abs(p[1] - pts[k - 1][1]) > 30) { segs.push(seg); seg = []; } seg.push(p); });
  segs.push(seg);
  segs.forEach(s => { g += `<path d="${ptsToD(s.map(([i, m]) => [cx(i), cy(m)]))}" fill="none" stroke="var(--sun)" stroke-width="3"/>`; });
  const td = todayLocal(), ti = doy(td[1], td[2]), near = pts.reduce((p, q) => Math.abs(q[0] - ti) < Math.abs(p[0] - ti) ? q : p);
  g += `<circle cx="${cx(near[0])}" cy="${cy(near[1])}" r="5" fill="var(--ink)"/><text x="${cx(near[0]) + (near[0] > 280 ? -8 : 8)}" y="${cy(near[1]) - 9}" text-anchor="${near[0] > 280 ? "end" : "start"}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--ink)">danes ${clock(near[1])}</text>`;
  $("uChart").innerHTML = g;
}

function renderTowns() {
  $("uTowns").innerHTML = TOWNS.map(([n, lon]) => {
    const m = 720 + (15 - lon) * 4, diff = Math.round(m - 720);
    return `<div style="${n === "Ljubljana" ? "font-weight:600" : ""}"><span class="k">${n}</span><span class="v">${clock(m)}</span>` +
      `<span class="d">${lon.toFixed(1).replace(".", ",")}° vzhodne dolžine · ${diff === 0 ? "točno" : (diff > 0 ? "+" : "−") + Math.abs(diff) + " min"}</span></div>`;
  }).join("");
}

function renderDst() {
  let rMin = 1e9, rMax = -1e9, sMin = 1e9, sMax = -1e9;
  for (let i = 0; i < 365; i++) {
    const s = dayStart(i), e = events(sunAt, s), off = tzOffsetMin(e.rise.t) - 60; // 0 pozimi, 60 poleti
    const r = (e.rise.t - s) / 60000 - off, z = (e.set.t - s) / 60000 - tzOffsetMin(e.set.t) + 60; // v zimskem času
    rMin = Math.min(rMin, r); rMax = Math.max(rMax, r); sMin = Math.min(sMin, z); sMax = Math.max(sMax, z);
  }
  // sedanje: poleti +60
  const rows = [
    ["Najzgodnejši vzhod (junij)", rMin + 60, rMin, rMin + 60],
    ["Najkasnejši zahod (junij)", sMax + 60, sMax, sMax + 60],
    ["Najkasnejši vzhod (januar)", rMax, rMax, rMax + 60],
    ["Najzgodnejši zahod (december)", sMin, sMin, sMin + 60],
  ];
  $("uDst").innerHTML = `<thead><tr><th></th><th>Zdaj</th><th>Zimski</th><th>Poletni</th></tr></thead><tbody>` +
    rows.map(([n, a, b, c]) => `<tr><td style="white-space:normal">${n}</td><td class="num">${clock(a)}</td><td class="num">${clock(b)}</td><td class="num">${clock(c)}</td></tr>`).join("") + `</tbody>`;
}

dayPicker("u", renderNoon);
drawNoonChart();
renderTowns();
renderDst();
