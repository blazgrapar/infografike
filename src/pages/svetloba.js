// ---------- Svetloba ----------
function drawScatter() {
  let g = "";
  // Zemlja kot lok, ozračje
  g += `<path d="M-20,200 Q180,120 380,200 Z" fill="#3D7DC4"/>`;
  g += `<path d="M-40,200 Q180,60 400,200" fill="none" stroke="#6FA8DC" stroke-opacity="0.35" stroke-width="44"/>`;
  const obs = [180, 158];
  g += `<circle cx="${obs[0]}" cy="${obs[1]}" r="3.5" fill="#E9ECF3"/>`;
  // opoldne: kratka pot od zgoraj
  g += `<line x1="180" y1="10" x2="${obs[0]}" y2="${obs[1] - 6}" stroke="#FFF4D6" stroke-width="3"/>`;
  g += `<text x="188" y="30" font-family="Sora, sans-serif" font-size="11" fill="#E9ECF3">opoldne: kratka pot</text>`;
  // zahod: dolga pot od strani
  g += `<line x1="350" y1="128" x2="${obs[0] + 6}" y2="${obs[1] - 2}" stroke="url(#sg)" stroke-width="3"/>`;
  g += `<defs><linearGradient id="sg" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#E07A5F"/></linearGradient></defs>`;
  g += `<text x="352" y="150" text-anchor="end" font-family="Sora, sans-serif" font-size="11" fill="#E9ECF3">ob zahodu: dolga pot</text>`;
  // razpršeni modri žarki
  [[210, 140], [250, 136], [290, 132]].forEach(([x, y]) => {
    g += `<line x1="${x}" y1="${y}" x2="${x - 10}" y2="${y - 22}" stroke="#6FA8DC" stroke-width="1.5"/><line x1="${x}" y1="${y}" x2="${x + 8}" y2="${y - 20}" stroke="#6FA8DC" stroke-width="1.5"/>`;
  });
  g += `<text x="262" y="100" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#6FA8DC">modra se razprši</text>`;
  g += `<text x="${obs[0]}" y="${obs[1] + 18}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#E9ECF3">ti</text>`;
  $("sScatter").innerHTML = g;
}
function drawRainbow() {
  const gx = 230, gy = 160, R = 120;
  let g = `<line x1="0" x2="360" y1="${gy}" y2="${gy}" stroke="var(--ink)" stroke-width="1.5"/>`;
  const cols = ["#E07A5F", "#F2B33D", "#E8D28A", "#2A9D8F", "#3F7FB8", "#5E6FA8"];
  cols.forEach((c, k) => {
    const r = R - k * 5;
    g += `<path d="M${gx - r},${gy} A${r},${r} 0 0,1 ${gx + r},${gy}" fill="none" stroke="${c}" stroke-width="5"/>`;
  });
  g += `<circle cx="20" cy="${gy - 50}" r="12" fill="var(--sun)"/><text x="20" y="${gy - 68}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" fill="var(--ink)">Sonce</text>`;
  g += `<circle cx="70" cy="${gy - 6}" r="5" fill="var(--ink)"/><text x="70" y="${gy + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">ti</text>`;
  g += `<line x1="30" y1="${gy - 46}" x2="${gx}" y2="${gy}" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
  g += `<line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - R}" stroke="var(--muted)" stroke-dasharray="2 3"/>`;
  g += `<text x="${gx + 6}" y="${gy - R / 2}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">42°</text>`;
  g += `<text x="${gx}" y="${gy + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">točka nasproti Sonca</text>`;
  $("sRainbow").innerHTML = g;
}
const R_ = Math.PI / 180;
function rainbowToday() {
  const [y, m, d] = todayLocal(), st = localMidnight(y, m, d), e = events(sunAt, st);
  const ok = t => { const a = sunAt(t).alt; return a > 0 && a < 42; };
  const spans = []; let cur = null;
  for (let t = e.rise.t; t <= e.set.t; t += 5 * 60000) {
    if (ok(t)) { if (!cur) cur = [t, t]; else cur[1] = t; } else if (cur) { spans.push(cur); cur = null; }
  }
  if (cur) spans.push(cur);
  if (e.top.alt < 42) {
    $("sRbWhen").textContent = "Ves dan";
    $("sRbTxt").textContent = `Sonce danes ne preseže 42°, zato je mavrica mogoča od vzhoda ob ${hm(e.rise.t)} do zahoda ob ${hm(e.set.t)}.`;
  } else {
    $("sRbWhen").textContent = spans.map(([a, b]) => `${hm(a)}–${hm(b)}`).join(" in ");
    $("sRbTxt").textContent = "Okoli poldneva je Sonce previsoko in mavrica bi bila pod obzorjem. Dopoldne jo išči na zahodu, popoldne na vzhodu.";
  }
}
function drawSpec() {
  const X0 = 20, X1 = 340, L0 = 330, L1 = 800, cx = l => X0 + (l - L0) / (L1 - L0) * (X1 - X0);
  const stops = [[380, "#7A3FB8"], [450, "#3F5FD8"], [495, "#2AA6C4"], [530, "#3BB54A"], [580, "#F2D33D"], [610, "#F28A2D"], [700, "#D8342E"], [750, "#8A1E1E"]];
  let g = `<defs><linearGradient id="spec" x1="0" x2="1">${stops.map(([l, c]) => `<stop offset="${(l - 380) / 370}" stop-color="${c}"/>`).join("")}</linearGradient></defs>`;
  g += `<rect x="${cx(380)}" y="14" width="${cx(750) - cx(380)}" height="34" rx="4" fill="url(#spec)"/>`;
  g += `<rect x="${X0}" y="14" width="${cx(380) - X0}" height="34" rx="4" fill="var(--line)"/><rect x="${cx(750)}" y="14" width="${X1 - cx(750)}" height="34" rx="4" fill="var(--line)"/>`;
  g += `<text x="${(X0 + cx(380)) / 2}" y="36" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">UV</text>`;
  g += `<text x="${(cx(750) + X1) / 2}" y="36" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">IR</text>`;
  [380, 500, 600, 750].forEach(l => { g += `<text x="${cx(l)}" y="66" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${l} nm</text>`; });
  $("sSpec").innerHTML = g;
}
drawScatter();
drawRainbow();
rainbowToday();
drawSpec();
