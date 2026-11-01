// ---------- Vreme ----------
const ST = [
  { n: "Ljubljana", Y: 1362, c: "var(--ink)", T: [0.3, 1.9, 6.5, 10.8, 15.8, 19.1, 21.3, 20.6, 16.0, 11.2, 5.6, 1.2], P: [69, 70, 88, 99, 109, 144, 115, 137, 147, 147, 129, 107] },
  { n: "Bovec", Y: 2602, c: "var(--rain)", T: [0.4, 1.7, 5.5, 9.8, 14.2, 17.4, 19.6, 19.0, 14.6, 10.3, 5.0, 0.8], P: [141, 106, 163, 203, 221, 203, 187, 200, 267, 324, 331, 257] },
  { n: "Murska Sobota", Y: 798, c: "var(--sun)", T: [-1.1, 0.8, 5.5, 10.5, 15.7, 18.8, 20.6, 19.7, 15.2, 10.2, 4.6, 0.1], P: [31, 34, 49, 52, 75, 103, 86, 102, 89, 66, 62, 50] },
  { n: "Portorož", Y: 968, c: "var(--sea)", T: [4.3, 4.6, 7.9, 11.9, 16.9, 20.5, 22.9, 22.3, 18.1, 14.0, 9.3, 5.6], P: [60, 54, 62, 66, 75, 86, 56, 86, 118, 112, 106, 88] },
];
const SEA = [8.7, 8.1, 8.9, 12.0, 16.7, 20.9, 23.8, 24.1, 22.0, 19.2, 15.0, 10.9];
const MON = "JFMAMJJASOND".split("");
const on = ST.map(() => true);

function axes(X0, X1, Y0, Y1, vals, fmt) {
  const lo = vals[0], hi = vals[vals.length - 1];
  const cy = v => Y1 - (v - lo) / (hi - lo) * (Y1 - Y0);
  const bw = (X1 - X0) / 12, cx = m => X0 + (m + 0.5) * bw;
  let g = "";
  vals.forEach(v => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)" ${v === 0 ? 'stroke-width="1.5"' : ""}/>` +
      `<text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${fmt(v)}</text>`;
  });
  MON.forEach((l, m) => {
    g += `<text x="${cx(m)}" y="${Y1 + 18}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${l}</text>`;
  });
  return { g, cx, cy, bw };
}

function drawTemp() {
  const { g: base, cx, cy } = axes(34, 350, 14, 196, [-5, 0, 5, 10, 15, 20, 25], v => v + "°");
  let g = base;
  ST.forEach((s, k) => {
    if (!on[k]) return;
    g += `<path d="${ptsToD(s.T.map((t, m) => [cx(m), cy(t)]))}" fill="none" stroke="${s.c}" stroke-width="2.5" stroke-linejoin="round"/>`;
    s.T.forEach((t, m) => { g += `<circle cx="${cx(m)}" cy="${cy(t)}" r="2.6" fill="${s.c}"/>`; });
  });
  $("tChart").innerHTML = g;
}

function chips() {
  $("tChips").innerHTML = ST.map((s, k) => `<button type="button" id="chip${k}" aria-pressed="true" style="--c:${s.c}">${s.n}</button>`).join("");
  ST.forEach((s, k) => $("chip" + k).addEventListener("click", e => {
    on[k] = !on[k]; e.currentTarget.setAttribute("aria-pressed", on[k]); drawTemp();
  }));
}

function drawSea() {
  const air = ST[3].T;
  const { g: base, cx, cy } = axes(34, 350, 14, 196, [0, 5, 10, 15, 20, 25], v => v + "°");
  let g = base;
  g += `<path d="${ptsToD(air.map((t, m) => [cx(m), cy(t)]))}" fill="none" stroke="var(--temp)" stroke-width="2.5"/>`;
  g += `<path d="${ptsToD(SEA.map((t, m) => [cx(m), cy(t)]))}" fill="none" stroke="var(--sea)" stroke-width="3"/>`;
  SEA.forEach((t, m) => { g += `<circle cx="${cx(m)}" cy="${cy(t)}" r="3" fill="var(--sea)"/>`; });
  g += `<text x="${cx(7)}" y="${cy(SEA[7]) - 9}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--sea)">24,1°</text>`;
  g += `<text x="${cx(1)}" y="${cy(SEA[1]) - 9}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--sea)">8,1°</text>`;
  $("seaChart").innerHTML = g;
}

function drawRain() {
  const order = [1, 0, 3, 2], MAX = 350;
  let html = "";
  order.forEach(k => {
    const s = ST[k], sum = s.Y;
    const X0 = 6, X1 = 354, Y0 = 4, Y1 = 64, bw = (X1 - X0) / 12;
    const peak = s.P.indexOf(Math.max(...s.P));
    let g = `<line x1="${X0}" x2="${X1}" y1="${Y1}" y2="${Y1}" stroke="var(--line)"/>`;
    s.P.forEach((p, m) => {
      const h = p / MAX * (Y1 - Y0);
      g += `<rect x="${X0 + m * bw + 3}" y="${Y1 - h}" width="${bw - 6}" height="${h}" rx="2" fill="var(--rain)" fill-opacity="${m === peak ? 1 : 0.55}"/>`;
      g += `<text x="${X0 + (m + 0.5) * bw}" y="${Y1 + 13}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${MON[m]}</text>`;
    });
    html += `<div style="display:grid;gap:4px;padding-block:6px">
      <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-family:var(--font-display)">${s.n}</b><span style="font-family:var(--font-data);font-size:0.9rem">${sum.toLocaleString("sl-SI")} mm/leto</span></div>
      <svg class="chart" viewBox="0 0 360 80" aria-label="Mesečne padavine, ${s.n}" role="img">${g}</svg></div>`;
  });
  $("rainPanel").innerHTML = html;
}

chips();
drawTemp();
drawSea();
drawRain();

// ---------- Padavine skozi leta ----------
const YR = {"Y0": 1961, "Kredarica": [2345, 2114, 2800, 2015, 2862, 2247, 2140, 2301, 2180, 1973, 1436, 1972, 2413, 2030, 2318, 1974, 1971, 2429, 2566, 2011, 1523, 2228, 1574, 2353, 1795, 1992, 2682, 2162, 1821, 2439, 2058, 2066, 1802, 1769, 1680, 1951, 1800, 2157, 2376, 2573, 2230, 2093, 1623, 2241, 1752, 1887, 1761, 2180, 2259, 2343, 1497, 2204, 2176, 2449, 1755, 2290, 2230, 1740, 2440, 2376, 1939, 1719], "Rateče": [1532, 1768, 1870, 1553, 2374, 1744, 1570, 1717, 1872, 1744, 1319, 1753, 1730, 1408, 1701, 1534, 1549, 1799, 1961, 1697, 1359, 1588, 1243, 1662, 1698, 1323, 1837, 1323, 1464, 1724, 1599, 1646, 1606, 1473, 1253, 1773, 1328, 1556, 1579, 1891, 1440, 1458, 1652, 1638, 1239, 1175, 1310, 1910, 1782, 1703, 1293, 1700, 1598, 2084, 1233, 1666, 1966, 1504, 1869, 1839, 1501, 1158], "Murska Sobota": [786, 931, 832, 876, 1067, 970, 784, 612, 787, 761, 563, 1033, 809, 912, 805, 751, 718, 676, 912, 862, 768, 864, 634, 741, 883, 788, 982, 722, 776, 900, 804, 689, 687, 989, 924, 1026, 692, 839, 772, 651, 643, 754, 515, 804, 869, 852, 817, 708, 989, 876, 693, 782, 912, 1093, 690, 787, 930, 825, 896, 849, 825, 704], "Novo mesto": [1025, 1261, 1229, 1371, 1370, 1141, 1040, 900, 1204, 1184, 872, 1416, 855, 1275, 1047, 1060, 1132, 967, 1276, 1274, 1224, 1205, 964, 1322, 1283, 1121, 1143, 1031, 1135, 1102, 1054, 1168, 1098, 1120, 1299, 1152, 991, 1041, 1299, 827, 1053, 1379, 886, 1196, 1382, 1084, 1114, 1134, 1066, 1278, 834, 1147, 1259, 1482, 1084, 1146, 1120, 1165, 1214, 1049, 1022, 1142]};
const YST = ["Kredarica", "Rateče", "Novo mesto", "Murska Sobota"];
let ySel = 0;
function drawYears() {
  const name = YST[ySel], v = YR[name], n = v.length, y0 = YR.Y0;
  const mx = Math.ceil(Math.max(...v) / 500) * 500;
  const X0 = 40, X1 = 352, Y0 = 12, Y1 = 196, bw = (X1 - X0) / n;
  const cy = p => Y1 - p / mx * (Y1 - Y0);
  let g = "";
  for (let t = 0; t <= mx; t += mx > 2000 ? 500 : 250) {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(t)}" y2="${cy(t)}" stroke="var(--line)"/>` +
      `<text x="${X0 - 5}" y="${cy(t) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${t}</text>`;
  }
  const hi = v.indexOf(Math.max(...v)), lo = v.indexOf(Math.min(...v));
  v.forEach((p, i) => {
    const op = i === hi || i === lo ? 1 : 0.5;
    g += `<rect x="${X0 + i * bw + 0.6}" y="${cy(p)}" width="${bw - 1.2}" height="${Y1 - cy(p)}" fill="var(--rain)" fill-opacity="${op}"/>`;
  });
  const ma = [];
  for (let i = 9; i < n; i++) { const s = v.slice(i - 9, i + 1).reduce((a, b) => a + b, 0) / 10; ma.push([X0 + (i - 4) * bw, cy(s)]); }
  g += `<path d="${ptsToD(ma)}" fill="none" stroke="var(--ink)" stroke-width="2.5"/>`;
  [1970, 1980, 1990, 2000, 2010, 2020].forEach(y => {
    const x = X0 + (y - y0 + 0.5) * bw;
    g += `<text x="${x}" y="${Y1 + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${y}</text>`;
  });
  g += `<text x="${X0}" y="${Y1 + 30}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">mm na leto</text>`;
  $("yChart").innerHTML = g;
  const mean = v.reduce((a, b) => a + b, 0) / n;
  $("yFacts").innerHTML =
    `<div><span class="k">Povprečje ${y0}–${y0 + n - 1}</span><span class="v">${Math.round(mean).toLocaleString("sl-SI")} mm</span></div>` +
    `<div><span class="k">Najbolj mokro leto</span><span class="v">${y0 + hi} · ${v[hi].toLocaleString("sl-SI")} mm</span></div>` +
    `<div><span class="k">Najbolj suho leto</span><span class="v">${y0 + lo} · ${v[lo].toLocaleString("sl-SI")} mm</span></div>`;
}
function yChips() {
  $("yChips").innerHTML = YST.map((s, k) => `<button type="button" id="ychip${k}" aria-pressed="${k === ySel}" style="--c:var(--rain)">${s}</button>`).join("");
  YST.forEach((s, k) => $("ychip" + k).addEventListener("click", () => {
    ySel = k; YST.forEach((_, j) => $("ychip" + j).setAttribute("aria-pressed", j === k)); drawYears();
  }));
}
yChips();
drawYears();
