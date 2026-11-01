// ---------- Somrak ----------
const TW = [
  { h: -0.833, name: "Sončni zahod", mname: "Sončni vzhod" },
  { h: -6, name: "Konec civilnega somraka", mname: "Začetek civilnega somraka", d: "Brez svetilke ne gre več. Vidne so prve svetle zvezde in planeti." },
  { h: -12, name: "Konec navtičnega somraka", mname: "Začetek navtičnega somraka", d: "Obzorja ne ločiš več od neba." },
  { h: -18, name: "Začetek prave noči", mname: "Konec prave noči", d: "Nebo je povsem temno, vidne so tudi najšibkejše zvezde." },
];

function drawBands() {
  const top = 44, deg = 12; // px na stopinjo
  const y = a => top + (-a) * deg; // a: 0 .. -20
  const bands = [
    [2.5, 0, "var(--tw-day)", "Dan", "Sonce je nad obzorjem"],
    [0, -6, "var(--tw-civil)", "Civilni somrak", "0–6° · še dovolj svetlo za hojo"],
    [-6, -12, "var(--tw-naut)", "Navtični somrak", "6–12° · obzorje še vidno"],
    [-12, -18, "var(--tw-astro)", "Astronomski somrak", "12–18° · nebo še ni povsem temno"],
    [-18, -20.5, "var(--tw-night)", "Noč", "več kot 18° pod obzorjem"],
  ];
  let g = "";
  bands.forEach(([a, b, c, n, d]) => {
    const y0 = a > 0 ? 0 : y(a), y1 = y(b);
    g += `<rect x="0" y="${y0}" width="360" height="${y1 - y0}" fill="${c}"/>`;
    const light = c.includes("day") || c.includes("civil");
    const fill = light ? "#1C2436" : "#E9ECF3", sub = light ? "#3A4458" : "#A9B1C4";
    const ym = (y0 + y1) / 2;
    g += `<text x="16" y="${ym - 1}" font-family="Sora, sans-serif" font-size="13" font-weight="600" fill="${fill}">${n}</text>`;
    g += `<text x="16" y="${ym + 14}" font-family="Source Sans 3, sans-serif" font-size="11.5" fill="${sub}">${d}</text>`;
  });
  g += `<line x1="0" x2="360" y1="${y(0)}" y2="${y(0)}" stroke="#1C2436" stroke-width="2"/>`;
  g += `<text x="352" y="${y(0) - 6}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#1C2436">obzorje</text>`;
  [-6, -12, -18].forEach(a => {
    g += `<text x="352" y="${y(a) - 5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="#C9D1E3">${a}°</text>`;
  });
  // Sonce, ki tone
  const sx = 300;
  [[1.2, 1], [-3, 0.85], [-9, 0.6], [-15, 0.35]].forEach(([a, o]) => {
    g += `<circle cx="${sx}" cy="${y(a)}" r="7" fill="#F2B33D" fill-opacity="${o}"/>`;
  });
  g += `<path d="M${sx},${y(1.2) + 10} L${sx},${y(-15) - 10}" stroke="#F2B33D" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  $("twBands").innerHTML = g;
}

const twEvents = start => TW.map(t => events(sunAtH(t.h), start));
const minOfDay = (ms, st) => (ms - st) / 60000;

function renderTw(a) {
  const st = localMidnight(a[0], a[1], a[2]);
  const ev = twEvents(st);
  // časovna črta: segmenti po minutah dneva
  const marks = [];
  ev.forEach((e, k) => {
    if (e.rise) marks.push([minOfDay(e.rise.t, st), k, "up"]);
    if (e.set) marks.push([minOfDay(e.set.t, st), k, "down"]);
  });
  marks.sort((x, y) => x[0] - y[0]);
  const lvlAt = m => { const alt = sunAt(st + m * 60000).alt; return alt > -0.833 ? 0 : alt > -6 ? 1 : alt > -12 ? 2 : alt > -18 ? 3 : 4; };
  const cols = ["var(--tw-day)", "var(--tw-civil)", "var(--tw-naut)", "var(--tw-astro)", "var(--tw-night)"];
  let segs = "", prev = 0;
  const pts = [0, ...marks.map(m => m[0]), 1440];
  for (let k = 0; k < pts.length - 1; k++) {
    const a0 = pts[k], a1 = pts[k + 1];
    if (a1 - a0 <= 0) continue;
    segs += `<span style="width:${(a1 - a0) / 14.4}%;background:${cols[lvlAt((a0 + a1) / 2)]}"></span>`;
  }
  $("twTimeline").innerHTML = segs;
  let ax = "";
  [0, 6, 12, 18, 24].forEach(h => {
    const x = h / 24 * 360;
    ax += `<text x="${Math.min(Math.max(x, 8), 352)}" y="13" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${h}h</text>`;
  });
  $("twAxis").innerHTML = ax;

  const sunset = ev[0].set, sunrise = ev[0].rise;
  const row = (k, v, d) => `<div><span class="k">${k}</span><span class="v">${v}</span>${d ? `<span class="d">${d}</span>` : ""}</div>`;
  let eve = "", mor = "";
  ev.forEach((e, k) => {
    const t = TW[k];
    const after = e.set && sunset ? ` · +${Math.round((e.set.t - sunset.t) / 60000)} min` : "";
    eve += row(t.name, e.set ? hm(e.set.t) + (k ? after : "") : "—", k ? (e.set ? t.d : "Sonce ne pade tako globoko, prave noči ni.") : "");
    const before = e.rise && sunrise ? ` · −${Math.round((sunrise.t - e.rise.t) / 60000)} min` : "";
    mor = row(t.mname, e.rise ? hm(e.rise.t) + (k ? before : "") : "—", "") + mor;
  });
  $("twEvening").innerHTML = eve;
  $("twMorning").innerHTML = mor;
}

function drawTwYear() {
  const X0 = 34, X1 = 350, Y0 = 16, Y1 = 170, M0 = 25, M1 = 45;
  const cx = i => X0 + i / 364 * (X1 - X0), cy = m => Y1 - (m - M0) / (M1 - M0) * (Y1 - Y0);
  const data = [];
  for (let i = 0; i < 365; i += 2) {
    const s = dayStart(i), a = events(sunAtH(-0.833), s).set, b = events(sunAtH(-6), s).set;
    if (a && b) data.push([i, (b.t - a.t) / 60000]);
  }
  let g = "";
  [25, 30, 35, 40, 45].forEach(m => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(m)}" y2="${cy(m)}" stroke="var(--line)"/>` +
      `<text x="${X0 - 5}" y="${cy(m) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${m}′</text>`;
  });
  "JFMAMJJASOND".split("").forEach((l, m) => {
    const a = doy(m + 1, 1), b = m < 11 ? doy(m + 2, 1) : 365;
    g += `<text x="${cx((a + b) / 2)}" y="${Y1 + 18}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${l}</text>`;
  });
  g += `<path d="${ptsToD(data.map(([i, m]) => [cx(i), cy(m)]))}" fill="none" stroke="var(--tw-civil)" stroke-width="3"/>`;
  const today = todayLocal(), ti = doy(today[1], today[2]);
  const near = data.reduce((p, q) => Math.abs(q[0] - ti) < Math.abs(p[0] - ti) ? q : p);
  g += `<circle cx="${cx(near[0])}" cy="${cy(near[1])}" r="5" fill="var(--ink)"/>` +
    `<text x="${cx(near[0]) + (near[0] > 280 ? -8 : 8)}" y="${cy(near[1]) - 8}" text-anchor="${near[0] > 280 ? "end" : "start"}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--ink)">danes ${Math.round(near[1])} min</text>`;
  $("twYear").innerHTML = g;
}

drawBands();
dayPicker("t", renderTw);
drawTwYear();
