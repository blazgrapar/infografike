// ---------- Planeti (Schlyter) ----------
const PL = {
  Merkur: [48.3313, 3.24587e-5, 7.0047, 5.00e-8, 29.1241, 1.01444e-5, 0.387098, 0.205635, 5.59e-10, 168.6562, 4.0923344368],
  Venera: [76.6799, 2.46590e-5, 3.3946, 2.75e-8, 54.8910, 1.38374e-5, 0.723330, 0.006773, -1.302e-9, 48.0052, 1.6021302244],
  Mars: [49.5574, 2.11081e-5, 1.8497, -1.78e-8, 286.5016, 2.92961e-5, 1.523688, 0.093405, 2.516e-9, 18.6021, 0.5240207766],
  Jupiter: [100.4542, 2.76854e-5, 1.3030, -1.557e-7, 273.8777, 1.64505e-5, 5.20256, 0.048498, 4.469e-9, 19.8950, 0.0830853001],
  Saturn: [113.6634, 2.38980e-5, 2.4886, -1.081e-7, 339.3939, 2.97661e-5, 9.55475, 0.055546, -9.499e-9, 316.9670, 0.0334442282],
};
function helio(name, d) {
  const p = PL[name];
  const N = p[0] + p[1] * d, i = p[2] + p[3] * d, w = p[4] + p[5] * d, a = p[6], e = p[7] + p[8] * d, M = rev(p[9] + p[10] * d);
  let E = M + D * e * sind(M) * (1 + e * cosd(M));
  for (let k = 0; k < 10; k++) E = E - (E - D * e * sind(E) - M) / (1 - e * cosd(E));
  const xv = a * (cosd(E) - e), yv = a * Math.sqrt(1 - e * e) * sind(E);
  const v = Math.atan2(yv, xv) * D, r = Math.hypot(xv, yv), vw = v + w;
  const xh = r * (cosd(N) * cosd(vw) - sind(N) * sind(vw) * cosd(i));
  const yh = r * (sind(N) * cosd(vw) + cosd(N) * sind(vw) * cosd(i));
  const zh = r * sind(vw) * sind(i);
  let lon = Math.atan2(yh, xh) * D, lat = Math.atan2(zh, Math.hypot(xh, yh)) * D;
  if (name === "Jupiter" || name === "Saturn") {
    const Mj = rev(19.8950 + 0.0830853001 * d), Ms = rev(316.9670 + 0.0334442282 * d);
    if (name === "Jupiter") lon += -0.332 * sind(2 * Mj - 5 * Ms - 67.6) - 0.056 * sind(2 * Mj - 2 * Ms + 21) + 0.042 * sind(3 * Mj - 5 * Ms + 21)
      - 0.036 * sind(Mj - 2 * Ms) + 0.022 * cosd(Mj - Ms) + 0.023 * sind(2 * Mj - 3 * Ms + 52) - 0.016 * sind(Mj - 5 * Ms - 69);
    else {
      lon += 0.812 * sind(2 * Mj - 5 * Ms - 67.6) - 0.229 * cosd(2 * Mj - 4 * Ms - 2) + 0.119 * sind(Mj - 2 * Ms - 3)
        + 0.046 * sind(2 * Mj - 6 * Ms - 69) + 0.014 * sind(Mj - 3 * Ms + 32);
      lat += -0.020 * cosd(2 * Mj - 4 * Ms - 2) + 0.018 * sind(2 * Mj - 6 * Ms - 49);
    }
  }
  return { lon, lat, r };
}
function sunRect(d) {
  const w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, M = rev(356.0470 + 0.9856002585 * d);
  const E = M + D * e * sind(M) * (1 + e * cosd(M));
  const xv = cosd(E) - e, yv = Math.sqrt(1 - e * e) * sind(E);
  const v = Math.atan2(yv, xv) * D, rs = Math.hypot(xv, yv), lon = v + w;
  return { x: rs * cosd(lon), y: rs * sind(lon), rs, lon: rev(lon), L: rev(M + w) };
}
function planetAt(name, ms) {
  const d = dayNum(ms), h = helio(name, d), s = sunRect(d);
  const xh = h.r * cosd(h.lon) * cosd(h.lat), yh = h.r * sind(h.lon) * cosd(h.lat), zh = h.r * sind(h.lat);
  const xg = xh + s.x, yg = yh + s.y, zg = zh;
  const lon = rev(Math.atan2(yg, xg) * D), lat = Math.atan2(zg, Math.hypot(xg, yg)) * D;
  const R = Math.hypot(xg, yg, zg);
  const hz = eclToHoriz(lon, lat, d, ms, s.L);
  let el = Math.acos(cosd(lat) * cosd(lon - s.lon)) * D;
  const side = rev(lon - s.lon) < 180 ? "vzhodno" : "zahodno"; // vzhodno od Sonca = zvečer
  const FV = Math.acos(Math.max(-1, Math.min(1, (h.r * h.r + R * R - s.rs * s.rs) / (2 * h.r * R)))) * D;
  const base = { Merkur: [-0.36, 0.027], Venera: [-4.34, 0.013], Mars: [-1.51, 0.016], Jupiter: [-9.25, 0.014], Saturn: [-9.0, 0.044] }[name];
  const mag = base[0] + 5 * Math.log10(h.r * R) + base[1] * FV;
  return { ...hz, elong: el, side, mag, lon };
}

// ---------- Nočno nebo ----------
const PNAMES = ["Merkur", "Venera", "Mars", "Jupiter", "Saturn"];
const PCOL = { Merkur: "#C9C2B0", Venera: "#FFF4D6", Mars: "#E07A5F", Jupiter: "#F2D7A0", Saturn: "#E8D28A" };

function renderPlanets(a) {
  const st = localMidnight(a[0], a[1], a[2]), s = events(sunAt, st);
  const eve = s.set.t + 3600000, mor = events(sunAt, st + 86400000).rise.t - 3600000;
  $("nEveLbl").textContent = `Zvečer ob ${hm(eve)}, pogled po obzorju`;
  let rows = "", sky = "";
  // obzorje (azimut 45–315 → x)
  const px = az => 14 + (az - 45) / 270 * 332, py = alt => 140 - alt / 60 * 125;
  sky += `<line x1="8" x2="352" y1="${py(0)}" y2="${py(0)}" stroke="#56607A" stroke-width="1.5"/>`;
  [[90, "V"], [135, "JV"], [180, "J"], [225, "JZ"], [270, "Z"]].forEach(([az, l]) => {
    sky += `<text x="${px(az)}" y="${py(0) + 18}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="#A9B1C4">${l}</text>`;
  });
  [20, 40].forEach(h => { sky += `<line x1="14" x2="346" y1="${py(h)}" y2="${py(h)}" stroke="#2C364B" stroke-dasharray="2 4"/><text x="16" y="${py(h) - 3}" font-family="IBM Plex Mono, monospace" font-size="9" fill="#7D869B">${h}°</text>`; });
  let any = false;
  PNAMES.forEach(n => {
    const e = planetAt(n, eve), m = planetAt(n, mor), p = planetAt(n, st + 43200000);
    const vis = [];
    if (e.alt > 5) vis.push(`zvečer ${dir16(e.az)}, ${Math.round(e.alt)}°`);
    if (m.alt > 5) vis.push(`zjutraj ${dir16(m.az)}, ${Math.round(m.alt)}°`);
    const close = p.elong < 15;
    rows += `<div><span class="k">${n}</span><span class="v">${close ? "ni viden" : vis.length ? "viden" : "ni viden"}</span>` +
      `<span class="d">${close ? "preblizu Sonca" : vis.length ? vis.join(" · ") : "pod obzorjem zvečer in zjutraj"} · ${Math.round(p.elong)}° od Sonca</span></div>`;
    if (e.alt > 0 && e.az > 45 && e.az < 315 && !close) {
      any = true;
      sky += `<circle cx="${px(e.az)}" cy="${py(Math.min(e.alt, 60))}" r="${n === "Venera" || n === "Jupiter" ? 6 : 4.5}" fill="${PCOL[n]}"/>`;
      sky += `<text x="${px(e.az)}" y="${py(Math.min(e.alt, 60)) - 10}" text-anchor="middle" font-family="Sora, sans-serif" font-size="10.5" fill="#E9ECF3">${n}</text>`;
    }
  });
  if (!any) sky += `<text x="180" y="70" text-anchor="middle" font-family="Source Sans 3, sans-serif" font-size="13" fill="#A9B1C4">Zvečer na južnem nebu ni planetov.</text>`;
  // Luna
  const ml = moonAt(eve);
  if (ml.alt > 0 && ml.az > 45 && ml.az < 315) sky += `<g transform="translate(${px(ml.az)},${py(Math.min(ml.alt, 60))})">${moonSVG(7, ml.elong, 0, 0, false)}</g><text x="${px(ml.az)}" y="${py(Math.min(ml.alt, 60)) + 20}" text-anchor="middle" font-family="Sora, sans-serif" font-size="10" fill="#A9B1C4">Luna</text>`;
  $("nSky").innerHTML = sky;
  $("nList").innerHTML = rows;
}

const SEASONS = [
  ["Zima", [12, 1, 2], "Orion z rdečkasto Betelgezo in modro Rigel, Plejade v Biku, Sirij, najsvetlejša zvezda neba, ter Dvojčka."],
  ["Pomlad", [3, 4, 5], "Lev z zvezdo Regul, Veliki voz visoko nad glavo, Arktur v Volarju in Spika v Devici."],
  ["Poletje", [6, 7, 8], "Poletni trikotnik iz Vege, Deneba in Altaira, nizko na jugu Škorpijon z rdečim Antaresom in Rimska cesta proti Strelcu."],
  ["Jesen", [9, 10, 11], "Jesenski kvadrat Pegaza, Kasiopeja v obliki črke W in Andromedina galaksija, najbolj oddaljena stvar, ki jo vidiš s prostim očesom."],
];
function renderSeasons() {
  const m = todayLocal()[1];
  $("nSeasons").innerHTML = SEASONS.map(([n, ms, t]) =>
    `<div class="card" style="grid-template-columns:1fr;${ms.includes(m) ? "border-color:var(--sun);border-width:2px" : ""}"><span class="ct">` +
    `<span class="n">${ms.includes(m) ? "Zdaj" : "Zvečer"}</span><h2>${n}</h2><p>${t}</p></span></div>`).join("");
}

function drawPolaris() {
  const dip = [[20, 150], [65, 140], [100, 150], [135, 165], [190, 172], [205, 128], [150, 118]];
  let g = "";
  g += `<path d="${ptsToD(dip.slice(0, 5))} L205,128 L150,118 L135,165" fill="none" stroke="#56607A" stroke-width="1.2"/>`;
  dip.forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="3.6" fill="#E9ECF3"/>`; });
  // kazalca: (230,172) → (245,128) → podaljšek
  const ax = 190, ay = 172, bx = 205, by = 128, dx = bx - ax, dy = by - ay, k = 2.35;
  const pxl = bx + dx * k, pyl = by + dy * k;
  g += `<line x1="${bx}" y1="${by}" x2="${pxl}" y2="${pyl}" stroke="#F2B33D" stroke-width="1.5" stroke-dasharray="4 4"/>`;
  g += `<circle cx="${pxl}" cy="${pyl}" r="5" fill="#F2B33D"/>`;
  g += `<text x="${pxl + 10}" y="${pyl + 4}" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="#F2B33D">Severnica</text>`;
  g += `<text x="80" y="196" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" fill="#A9B1C4">Veliki voz</text>`;
  g += `<text x="${bx + 14}" y="${(by + ay) / 2 + 6}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">kazalca</text>`;
  g += `<text x="${pxl + 10}" y="${pyl + 18}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">pod njo je sever</text>`;
  $("nPolaris").innerHTML = g;
}

const SHOWERS = [
  ["Kvadrantidi", 1, 3, 110, "kratek in močan vrh, mrzle noči"],
  ["Liridi", 4, 22, 18, "zmeren roj"],
  ["Perzeidi", 8, 12, 100, "najbolj priljubljen, tople poletne noči"],
  ["Drakonidi", 10, 8, 10, "najlepše zvečer"],
  ["Orionidi", 10, 21, 20, "prah Halleyjevega kometa"],
  ["Leonidi", 11, 17, 15, "občasno izbruhne v pravi dež utrinkov"],
  ["Geminidi", 12, 14, 150, "najmočnejši roj v letu"],
];
function renderShowers() {
  const [y, m, d] = todayLocal(), today = Date.UTC(y, m - 1, d);
  const items = SHOWERS.map(([n, mm, dd, z, t]) => {
    let yy = Date.UTC(y, mm - 1, dd) < today - 86400000 ? y + 1 : y;
    const st = localMidnight(yy, mm, dd) + 86400000 + 2 * 3600000; // ob 2.00 ponoči po vrhu
    const il = Math.round(illum(moonAt(st).elong) * 100);
    return { n, z, t, ms: Date.UTC(yy, mm - 1, dd), il };
  }).sort((a, b) => a.ms - b.ms);
  $("nShowers").innerHTML = items.map((o, k) =>
    `<div style="${k === 0 ? "background:color-mix(in srgb, var(--sun) 12%, transparent);border-radius:8px;padding-inline:8px" : ""}">` +
    `<span class="k">${o.n}${k === 0 ? ' <span class="badge">naslednji</span>' : ""}</span>` +
    `<span class="v">${fmtDM2.format(new Date(o.ms))} · ${o.z}/h</span>` +
    `<span class="d">${o.t}. Luna ob vrhu: ${o.il} % ${o.il < 30 ? "(dobro)" : o.il > 70 ? "(moti)" : ""}</span></div>`).join("");
}
const fmtDM2 = new Intl.DateTimeFormat("sl-SI", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });

dayPicker("n", renderPlanets);
renderSeasons();
drawPolaris();
renderShowers();
