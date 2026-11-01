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

const WORLD = [
  ["Ljubljana", "Europe/Ljubljana"], ["London", "Europe/London"], ["Reykjavik", "Atlantic/Reykjavik"],
  ["New York", "America/New_York"], ["Los Angeles", "America/Los_Angeles"], ["Honolulu", "Pacific/Honolulu"],
  ["Kiritimati, Kiribati", "Pacific/Kiritimati"], ["Delhi", "Asia/Kolkata"], ["Katmandu", "Asia/Kathmandu"],
  ["Peking", "Asia/Shanghai"], ["Tokio", "Asia/Tokyo"], ["Sydney", "Australia/Sydney"],
];
function renderWorld() {
  const now = new Date();
  const ymdIn = tz => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const here = ymdIn("Europe/Ljubljana");
  const rows = WORLD.map(([n, tz]) => {
    let t, off;
    try {
      t = new Intl.DateTimeFormat("sl-SI", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
      off = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(now).find(p => p.type === "timeZoneName").value.replace("GMT", "UTC");
    } catch (e) { return ""; }
    const d = ymdIn(tz), day = d > here ? " · jutri" : d < here ? " · včeraj" : "";
    return `<div style="${n === "Ljubljana" ? "font-weight:600" : ""}"><span class="k">${n}</span><span class="v">${t}</span><span class="d">${off === "UTC" ? "UTC+0" : off}${day}</span></div>`;
  }).join("");
  $("uWorld").innerHTML = rows;
}

const SKEW = [
  ["Kašgar, Kitajska", 8, 75.99], ["Vigo, Španija", 1, -8.72], ["Reykjavik, Islandija", 0, -21.94],
  ["Vladivostok, Rusija", 10, 131.89], ["Mumbaj, Indija", 5.5, 72.88], ["Pariz", 1, 2.35],
  ["Ljubljana", 1, 14.51], ["Katmandu, Nepal", 5.75, 85.32], ["Varšava", 1, 21.01], ["Tbilisi, Gruzija", 4, 44.79],
];
function drawSkew() {
  const data = SKEW.map(([n, o, lon]) => [n, Math.round(o * 60 - lon * 4)]).sort((a, b) => b[1] - a[1]);
  const X0 = 150, X1 = 350, Y0 = 16, rowH = 27, MIN = -60, MAX = 220;
  const cx = v => X0 + (v - MIN) / (MAX - MIN) * (X1 - X0);
  let g = "";
  [-60, 0, 60, 120, 180].forEach(v => {
    g += `<line x1="${cx(v)}" x2="${cx(v)}" y1="${Y0 - 4}" y2="${Y0 + data.length * rowH}" stroke="var(--line)" ${v === 0 ? 'stroke-width="1.5" stroke="var(--muted)"' : ""}/>` +
      `<text x="${cx(v)}" y="${Y0 + data.length * rowH + 14}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v / 60)} h</text>`;
  });
  data.forEach(([n, v], k) => {
    const y = Y0 + k * rowH, x0 = cx(Math.min(0, v)), x1 = cx(Math.max(0, v));
    g += `<text x="${X0 - 8}" y="${y + 15}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="11.5" fill="var(--ink)" ${n === "Ljubljana" ? 'font-weight="700"' : ""}>${n}</text>`;
    g += `<rect x="${x0}" y="${y + 5}" width="${Math.max(x1 - x0, 1.5)}" height="14" rx="2" fill="${n === "Ljubljana" ? "var(--sun)" : v > 45 ? "var(--temp)" : "var(--sea)"}"/>`;
    g += `<text x="${v >= 0 ? x1 + 4 : x0 - 4}" y="${y + 16}" text-anchor="${v >= 0 ? "start" : "end"}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v)}′</text>`;
  });
  $("uSkew").innerHTML = g;
}

dayPicker("u", renderNoon);
renderWorld();
drawSkew();
drawNoonChart();
renderTowns();
renderDst();
