// ---------- Plima in oseka ----------
function drawBulge() {
  let g = "";
  g += `<ellipse cx="130" cy="100" rx="86" ry="58" fill="#2A9D8F" fill-opacity="0.55"/>`;
  g += `<circle cx="130" cy="100" r="54" fill="#3D7DC4"/>`;
  g += `<circle cx="318" cy="100" r="14" fill="#F3EFE2"/>`;
  g += `<line x1="226" y1="100" x2="296" y2="100" stroke="#A9B1C4" stroke-dasharray="4 4"/>`;
  g += `<text x="318" y="132" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" fill="#A9B1C4">Luna</text>`;
  [["plima", 222, 100, "start"], ["plima", 38, 100, "end"]].forEach(([t, x, y, a]) => {
    g += `<text x="${x + (a === "start" ? 6 : -6)}" y="${y - 12}" text-anchor="${a}" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#4CC2B3">${t}</text>`;
  });
  g += `<text x="130" y="30" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#A9B1C4">oseka</text>`;
  g += `<text x="130" y="180" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#A9B1C4">oseka</text>`;
  g += `<text x="350" y="194" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="#7D869B">izboklina močno povečana</text>`;
  $("tideBulge").innerHTML = g;
}

function drawSpringNeap() {
  let g = "";
  const T = (x, y, s, f = "#A9B1C4", sz = 10.5, an = "middle") => `<text x="${x}" y="${y}" text-anchor="${an}" font-family="Sora, sans-serif" font-size="${sz}" fill="${f}">${s}</text>`;
  // skočna
  g += T(16, 24, "Skočna plima · ob mlaju ali ščipu", "#E9ECF3", 12, "start");
  g += `<circle cx="40" cy="70" r="20" fill="#F2B33D"/>`;
  g += `<ellipse cx="210" cy="70" rx="38" ry="22" fill="#2A9D8F" fill-opacity="0.6"/><circle cx="210" cy="70" r="18" fill="#3D7DC4"/>`;
  g += `<circle cx="286" cy="70" r="7" fill="#F3EFE2"/>`;
  g += `<line x1="64" x2="168" y1="70" y2="70" stroke="#F2B33D" stroke-opacity="0.4" stroke-dasharray="3 4"/>`;
  g += T(40, 104, "Sonce") + T(210, 104, "Zemlja") + T(286, 92, "Luna");
  // mrtva
  g += T(16, 136, "Mrtva plima · ob krajcu", "#E9ECF3", 12, "start");
  g += `<circle cx="40" cy="196" r="20" fill="#F2B33D"/>`;
  g += `<ellipse cx="210" cy="196" rx="28" ry="25" fill="#2A9D8F" fill-opacity="0.45"/><ellipse cx="210" cy="196" rx="22" ry="30" fill="#2A9D8F" fill-opacity="0.5"/><circle cx="210" cy="196" r="18" fill="#3D7DC4"/>`;
  g += `<circle cx="210" cy="148" r="7" fill="#F3EFE2"/>`;
  g += `<line x1="64" x2="178" y1="196" y2="196" stroke="#F2B33D" stroke-opacity="0.4" stroke-dasharray="3 4"/>`;
  g += T(40, 230, "Sonce") + T(256, 200, "Zemlja", "#A9B1C4", 10.5, "start") + T(226, 152, "Luna", "#A9B1C4", 10.5, "start");
  g += `<text x="350" y="242" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="#7D869B">razmerja niso v merilu</text>`;
  $("springNeap").innerHTML = g;
}

// shematska moč plimovanja: 1 ob mlaju/ščipu (+1,5 dneva zamika), 0 ob krajcih
const LAG = 1.5 / 29.53 * 360;
const strength = el => (1 + cosd(2 * (el - LAG))) / 2;

function drawTideNow() {
  const now = Date.now(), el = moonAt(now).elong, s = strength(el);
  $("tideNow").textContent = s > 0.75 ? "Skočna plima" : s < 0.25 ? "Mrtva plima" : (sind(2 * (el - LAG)) < 0 ? "Plimovanje se krepi" : "Plimovanje slabi");
  const nextNew = nextElong(now, 0), nextFull = nextElong(now, 180);
  const nxt = Math.min(nextNew, nextFull), what = nxt === nextNew ? "mlaj" : "ščip";
  $("tideNowSub").textContent = `Luna: ${phaseName(el).toLowerCase()}. Naslednji ${what} bo ${fmtDayLong.format(new Date(nxt))}, največje plime dan ali dva pozneje.`;

  const X0 = 14, X1 = 346, Y0 = 34, Y1 = 128;
  const cx = e => X0 + e / 360 * (X1 - X0), cy = v => Y1 - v * (Y1 - Y0);
  const pts = [];
  for (let e = 0; e <= 360; e += 3) pts.push([cx(e), cy(strength(e))]);
  let g = `<path d="${ptsToD(pts)} L${X1},${Y1} L${X0},${Y1} Z" fill="var(--sea)" fill-opacity="0.18"/>`;
  g += `<path d="${ptsToD(pts)}" fill="none" stroke="var(--sea)" stroke-width="2.5"/>`;
  g += `<line x1="${X0}" x2="${X1}" y1="${Y1}" y2="${Y1}" stroke="var(--line)"/>`;
  [[0, "mlaj"], [90, "prvi krajec"], [180, "ščip"], [270, "zadnji krajec"], [360, "mlaj"]].forEach(([e, l]) => {
    g += `<g transform="translate(${cx(e)},${Y1 + 18})">${moonSVG(8, e % 360, 0, 0, false)}</g>`;
    g += `<text x="${Math.min(Math.max(cx(e), 24), 336)}" y="${Y1 + 40}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${l}</text>`;
  });
  g += `<text x="${X0}" y="${Y0 - 14}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--sea)">večja razlika med plimo in oseko ↑</text>`;
  g += `<line x1="${cx(el)}" x2="${cx(el)}" y1="${Y0 - 4}" y2="${Y1}" stroke="var(--ink)" stroke-width="1.5"/>`;
  g += `<circle cx="${cx(el)}" cy="${cy(s)}" r="5" fill="var(--ink)"/>`;
  g += `<text x="${cx(el) + (el > 260 ? -7 : 7)}" y="${Y0 + 4}" text-anchor="${el > 260 ? "end" : "start"}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--ink)">zdaj</text>`;
  $("tideCycle").innerHTML = g;
}

drawBulge();
drawSpringNeap();
drawTideNow();
