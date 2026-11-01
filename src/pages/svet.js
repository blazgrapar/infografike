// ---------- Prebivalstvo sveta ----------
// [leto, milijarde]
const WPOP = [[0, 0.23], [500, 0.21], [1000, 0.28], [1200, 0.39], [1340, 0.44], [1400, 0.37], [1500, 0.46], [1600, 0.55], [1700, 0.60], [1750, 0.79],
  [1804, 1.0], [1850, 1.26], [1900, 1.65], [1927, 2.0], [1950, 2.5], [1960, 3.0], [1974, 4.0], [1987, 5.0], [1999, 6.0], [2011, 7.0], [2022, 8.0], [2024, 8.16]];
const WPROJ = [[2024, 8.16], [2030, 8.55], [2040, 9.19], [2050, 9.66], [2060, 9.98], [2070, 10.18], [2084, 10.29], [2100, 10.18]];
const MIL = [[1, 1804], [2, 1927], [3, 1960], [4, 1974], [5, 1987], [6, 1999], [7, 2011], [8, 2022]];

function drawWorld() {
  const X0 = 30, X1 = 352, Y0 = 14, Y1 = 196, T0 = 0, T1 = 2100, MAX = 11;
  const cx = t => X0 + (t - T0) / (T1 - T0) * (X1 - X0), cy = v => Y1 - v / MAX * (Y1 - Y0);
  let g = "";
  [0, 2, 4, 6, 8, 10].forEach(v => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)"/><text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v}</text>`;
  });
  [0, 500, 1000, 1500, 2000].forEach(t => {
    g += `<text x="${cx(t)}" y="${Y1 + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${t}</text>`;
  });
  g += `<text x="${X0}" y="${Y1 + 30}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">milijarde ljudi</text>`;
  const pts = WPOP.map(([t, v]) => [cx(t), cy(v)]);
  g += `<path d="${ptsToD(pts)} L${cx(2024)},${Y1} L${cx(0)},${Y1} Z" fill="var(--sea)" fill-opacity="0.18"/>`;
  g += `<path d="${ptsToD(pts)}" fill="none" stroke="var(--sea)" stroke-width="2.5"/>`;
  g += `<path d="${ptsToD(WPROJ.map(([t, v]) => [cx(t), cy(v)]))}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/>`;
  g += `<circle cx="${cx(2084)}" cy="${cy(10.29)}" r="3.5" fill="var(--muted)"/><text x="${cx(2084) - 6}" y="${cy(10.29) - 8}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">vrh ~2084</text>`;
  g += `<text x="${cx(1350)}" y="${cy(0.44) - 8}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">kuga</text>`;
  $("wChart").innerHTML = g;
  let prev = null;
  $("wMilestones").innerHTML = MIL.map(([b, y]) => {
    const gap = prev ? `${y - prev} let po prejšnji` : "po več deset tisoč letih";
    prev = y;
    return `<div><span class="k">${b}. milijarda</span><span class="v">${y}</span><span class="d">${gap}</span></div>`;
  }).join("");
}

const W0 = Date.UTC(2024, 6, 1), P0 = 8.161e9, RATE = 69.5e6 / (365.25 * 86400000);
function tick() {
  const n = Math.round(P0 + (Date.now() - W0) * RATE);
  $("wCounter").textContent = n.toLocaleString("sl-SI");
}

function drawCont() {
  const C = [["Azija", 59.1], ["Afrika", 18.6], ["Evropa", 9.0], ["Latinska Amerika", 8.2], ["Severna Amerika", 4.6], ["Oceanija", 0.6]];
  const X0 = 120, X1 = 320, rowH = 32;
  let g = "";
  C.forEach(([n, v], k) => {
    const y = 10 + k * rowH, w = v / 60 * (X1 - X0);
    g += `<text x="${X0 - 8}" y="${y + 15}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12" fill="var(--ink)">${n}</text>`;
    g += `<rect x="${X0}" y="${y + 3}" width="${Math.max(w, 2)}" height="16" rx="3" fill="var(--sea)" fill-opacity="${k ? 0.6 : 1}"/>`;
    g += `<text x="${X0 + w + 6}" y="${y + 15}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${String(v).replace(".", ",")} %</text>`;
  });
  $("wCont").innerHTML = g;
}

drawWorld();
drawCont();
tick();
setInterval(tick, 250);
