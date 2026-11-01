// ---------- Prebivalstvo Slovenije ----------
const SPOP = [[1857, 1101854], [1869, 1128768], [1880, 1182223], [1890, 1234056], [1900, 1268055], [1910, 1321098], [1921, 1304800],
  [1931, 1397650], [1948, 1439800], [1953, 1504427], [1961, 1591523], [1971, 1727137], [1981, 1891864], [1991, 1913355],
  [2002, 1964036], [2011, 2050189], [2021, 2108977], [2025, 2130850]];
const SBD = [[1950, 35992, 17335], [1960, 27825, 15145], [1970, 27432, 17354], [1979, 30604, 18148], [1990, 22368, 18555],
  [2000, 18180, 18588], [2010, 22343, 18609], [2020, 18767, 24016], [2021, 18984, 23261], [2022, 17627, 22492], [2023, 16989, 21540], [2024, 16875, 21506]];

function drawSlo() {
  const X0 = 38, X1 = 352, Y0 = 14, Y1 = 186, T0 = 1850, T1 = 2030, MAX = 2.4e6;
  const cx = t => X0 + (t - T0) / (T1 - T0) * (X1 - X0), cy = v => Y1 - v / MAX * (Y1 - Y0);
  let g = "";
  [0, 0.5e6, 1e6, 1.5e6, 2e6].forEach(v => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)"/><text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${String(v / 1e6).replace(".", ",")}</text>`;
  });
  [1850, 1900, 1950, 2000].forEach(t => { g += `<text x="${cx(t)}" y="${Y1 + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${t}</text>`; });
  g += `<text x="${X0}" y="${Y1 + 30}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">milijoni prebivalcev</text>`;
  SPOP.forEach(([t, v], k) => {
    const last = k === SPOP.length - 1;
    g += `<rect x="${cx(t) - 3.5}" y="${cy(v)}" width="7" height="${Y1 - cy(v)}" rx="1.5" fill="${last ? "var(--sun)" : "var(--sea)"}" fill-opacity="${last ? 1 : 0.7}"/>`;
  });
  g += `<rect x="${cx(1914)}" y="${Y0}" width="${cx(1918) - cx(1914)}" height="${Y1 - Y0}" fill="var(--muted)" fill-opacity="0.1"/><rect x="${cx(1941)}" y="${Y0}" width="${cx(1945) - cx(1941)}" height="${Y1 - Y0}" fill="var(--muted)" fill-opacity="0.1"/>`;
  g += `<text x="${cx(1916)}" y="${Y0 + 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="var(--muted)">vojna</text><text x="${cx(1943)}" y="${Y0 + 10}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="var(--muted)">vojna</text>`;
  $("sChart").innerHTML = g;
}

function drawBD() {
  const X0 = 40, X1 = 352, Y0 = 14, Y1 = 186, T0 = 1950, T1 = 2024, MAX = 40000;
  const cx = t => X0 + (t - T0) / (T1 - T0) * (X1 - X0), cy = v => Y1 - v / MAX * (Y1 - Y0);
  let g = "";
  [0, 10000, 20000, 30000, 40000].forEach(v => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)"/><text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v / 1000}k</text>`;
  });
  [1950, 1970, 1990, 2010].forEach(t => { g += `<text x="${cx(t)}" y="${Y1 + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${t}</text>`; });
  const b = SBD.map(([t, x]) => [cx(t), cy(x)]), d = SBD.map(([t, , y]) => [cx(t), cy(y)]);
  g += `<path d="${ptsToD(b)}" fill="none" stroke="var(--sea)" stroke-width="2.5"/><path d="${ptsToD(d)}" fill="none" stroke="var(--temp)" stroke-width="2.5"/>`;
  SBD.forEach(([t, x, y]) => { g += `<circle cx="${cx(t)}" cy="${cy(x)}" r="2.5" fill="var(--sea)"/><circle cx="${cx(t)}" cy="${cy(y)}" r="2.5" fill="var(--temp)"/>`; });
  g += `<rect x="${cx(2020)}" y="${Y0}" width="${cx(2024) - cx(2020)}" height="${Y1 - Y0}" fill="var(--temp)" fill-opacity="0.08"/>`;
  g += `<text x="${cx(2024)}" y="${cy(16875) + 16}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--sea)">16.875</text>`;
  g += `<text x="${cx(2024)}" y="${cy(21506) - 8}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--temp)">21.506</text>`;
  $("sBD").innerHTML = g;
}

drawSlo();
drawBD();
