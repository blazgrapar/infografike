const mins = (ms, st) => (ms - st) / 60000;
// podatki za vse leto (enkrat)
const SUNYEAR = [];
for (let i = 0; i < 365; i++) {
  const st = dayStart(i), e = events(sunAt, st);
  SUNYEAR.push({ st, e, r: mins(e.rise.t, st), s: mins(e.set.t, st) });
}

// ---------- Letni časi ----------
const TEMP = [0.3, 1.9, 6.5, 10.8, 15.8, 19.1, 21.3, 20.6, 16.0, 11.2, 5.6, 1.2];
function drawBeams() {
  const G = 182, W = 40, LEN = 118;
  const panels = [[92, SUNYEAR[doy(6, 21)].e.top.alt, "21. junij"], [262, SUNYEAR[doy(12, 21)].e.top.alt, "21. december"]];
  let g = `<line x1="6" x2="354" y1="${G}" y2="${G}" stroke="var(--ink)" stroke-width="1.5"/>`;
  panels.forEach(([x0, alt, lbl]) => {
    const L = W / sind(alt), xa = x0 - L / 2, xb = x0 + L / 2;
    const dx = -cosd(alt) * LEN, dy = -sind(alt) * LEN;
    g += `<path d="M${xa},${G} L${xb},${G} L${xb + dx},${G + dy} L${xa + dx},${G + dy} Z" fill="var(--sun)" fill-opacity="0.28"/>`;
    for (let k = 0; k <= 4; k++) {
      const x = xa + L * k / 4;
      g += `<line x1="${x + dx}" y1="${G + dy}" x2="${x}" y2="${G}" stroke="var(--sun)" stroke-width="1.4"/>`;
    }
    g += `<circle cx="${x0 + dx * 1.12}" cy="${G + dy * 1.12}" r="9" fill="var(--sun)"/>`;
    g += `<line x1="${xa}" x2="${xb}" y1="${G + 8}" y2="${G + 8}" stroke="var(--ink)" stroke-width="1"/>` +
      `<line x1="${xa}" x2="${xa}" y1="${G + 4}" y2="${G + 12}" stroke="var(--ink)"/><line x1="${xb}" x2="${xb}" y1="${G + 4}" y2="${G + 12}" stroke="var(--ink)"/>`;
    g += `<text x="${x0}" y="${G + 26}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="var(--ink)">${(1 / sind(alt)).toFixed(1).replace(".", ",")} m²</text>`;
    g += `<text x="${x0 + 12}" y="22" text-anchor="middle" font-family="Sora, sans-serif" font-size="12.5" font-weight="600" fill="var(--ink)">${lbl}</text>` +
      `<text x="${x0 + 12}" y="38" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="var(--muted)">Sonce ${Math.round(alt)}° visoko</text>`;
  });
  $("beams").innerHTML = g;
}

function drawLag() {
  const X0 = 34, X1 = 326, Y0 = 40, Y1 = 210, bw = (X1 - X0) / 12;
  const ty = t => Y1 - t / 25 * (Y1 - Y0), hy = h => Y1 - (h - 6) / 12 * (Y1 - Y0);
  let g = "";
  [0, 5, 10, 15, 20, 25].forEach(t => {
    g += `<line x1="${X0}" x2="${X1}" y1="${ty(t)}" y2="${ty(t)}" stroke="var(--line)"/>` +
      `<text x="${X0 - 5}" y="${ty(t) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--temp)">${t}°</text>`;
  });
  [8, 10, 12, 14, 16].forEach(h => {
    g += `<text x="${X1 + 5}" y="${hy(h) + 3.5}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--sun)">${h} h</text>`;
  });
  TEMP.forEach((t, m) => {
    const x = X0 + m * bw;
    g += `<rect x="${x + 3}" y="${ty(t)}" width="${bw - 6}" height="${Y1 - ty(t)}" rx="2" fill="var(--temp)" fill-opacity="${m === 6 || m === 0 ? 0.95 : 0.55}"/>`;
    g += `<text x="${x + bw / 2}" y="${Y1 + 16}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${"JFMAMJJASOND"[m]}</text>`;
  });
  const pts = SUNYEAR.map((d, i) => [X0 + (i + 0.5) / 365 * (X1 - X0), hy((d.s - d.r) / 60)]);
  g += `<path d="${ptsToD(pts)}" fill="none" stroke="var(--sun)" stroke-width="2.5"/>`;
  const xs = X0 + (doy(6, 21) + 0.5) / 365 * (X1 - X0), xt = X0 + 6.5 * bw;
  g += `<line x1="${xs}" x2="${xs}" y1="${Y0 - 6}" y2="${Y1}" stroke="var(--sun)" stroke-dasharray="3 3"/>`;
  g += `<text x="${xs - 4}" y="${Y0 - 12}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--sun)">najdaljši dan</text>`;
  g += `<text x="${xt + 2}" y="${ty(21.3) - 7}" text-anchor="start" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--temp)">najtopleje</text>`;
  $("lagChart").innerHTML = g;
}
drawBeams();
drawLag();

