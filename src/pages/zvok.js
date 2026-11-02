// ---------- Zvok ----------
function drawSpeed() {
  const D = [["Zrak", 343, "var(--muted)"], ["Voda", 1480, "var(--rain)"], ["Jeklo", 5900, "var(--ink)"]];
  const X0 = 64, X1 = 290;
  let g = "";
  D.forEach(([n, v, c], k) => {
    const y = 12 + k * 38, w = v / 5900 * (X1 - X0);
    g += `<text x="${X0 - 8}" y="${y + 15}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="13" fill="var(--ink)">${n}</text>`;
    g += `<rect x="${X0}" y="${y + 3}" width="${Math.max(w, 2)}" height="17" rx="3" fill="${c}"/>`;
    g += `<text x="${X0 + w + 6}" y="${y + 16}" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="var(--muted)">${v.toLocaleString("sl-SI")} m/s</text>`;
  });
  $("zSpeed").innerHTML = g;
}
function renderStorm() {
  const s = +$("zSec").value, km = s * 0.343;
  $("zSecLbl").textContent = `${s} s`;
  $("zDist").textContent = `Nevihta je ${km.toFixed(1).replace(".", ",")} km daleč`;
  $("zAdvice").textContent = s < 10 ? "Strela lahko udari tudi tukaj. Takoj se umakni v stavbo ali avto." : s < 30 ? "Nevihta je blizu. Pojdi na varno." : "Nevihta je še daleč, a jo spremljaj.";
}
function drawDb() {
  const D = [[0, "prag sluha"], [20, "šepetanje, šumenje listja"], [30, "tiha spalnica"], [60, "pogovor"], [70, "promet v mestu"],
    [85, "meja varnega hrupa"], [100, "motorna žaga, koncert"], [120, "prag bolečine"], [140, "reaktivno letalo od blizu"]];
  const X0 = 52, Y0 = 14, Y1 = 310, cy = v => Y1 - v / 140 * (Y1 - Y0);
  let g = `<defs><linearGradient id="dbG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="var(--sea)"/><stop offset="0.6" stop-color="var(--sun)"/><stop offset="1" stop-color="var(--temp)"/></linearGradient></defs>`;
  g += `<rect x="${X0 - 14}" y="${Y0}" width="10" height="${Y1 - Y0}" rx="5" fill="url(#dbG)"/>`;
  D.forEach(([v, n]) => {
    const y = cy(v), danger = v >= 85;
    g += `<line x1="${X0 - 4}" x2="${X0 + 6}" y1="${y}" y2="${y}" stroke="var(--ink)"/>`;
    g += `<text x="${X0 - 20}" y="${y + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${v}</text>`;
    g += `<text x="${X0 + 12}" y="${y + 4}" font-family="Source Sans 3, sans-serif" font-size="12.5" fill="${danger ? "var(--temp)" : "var(--ink)"}" ${v === 85 ? 'font-weight="700"' : ""}>${n}</text>`;
  });
  g += `<text x="${X0 - 20}" y="${Y0 - 2}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">dB</text>`;
  $("zDb").innerHTML = g;
}
function drawAnim() {
  const D = [["Človek", 20, 20000, "var(--sun)"], ["Slon", 14, 12000, "var(--muted)"], ["Pes", 67, 45000, "var(--sea)"],
    ["Mačka", 45, 64000, "var(--sea)"], ["Delfin", 75, 150000, "var(--rain)"], ["Netopir", 2000, 110000, "var(--ink)"]];
  const X0 = 64, X1 = 350, L0 = Math.log10(10), L1 = Math.log10(200000);
  const cx = f => X0 + (Math.log10(f) - L0) / (L1 - L0) * (X1 - X0);
  let g = `<rect x="${cx(20)}" y="6" width="${cx(20000) - cx(20)}" height="${D.length * 28 + 4}" fill="var(--sun)" fill-opacity="0.08"/>`;
  [10, 100, 1000, 10000, 100000].forEach(f => {
    g += `<line x1="${cx(f)}" x2="${cx(f)}" y1="6" y2="${10 + D.length * 28}" stroke="var(--line)"/>` +
      `<text x="${cx(f)}" y="${26 + D.length * 28}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${f >= 1000 ? f / 1000 + " kHz" : f + " Hz"}</text>`;
  });
  D.forEach(([n, a, b, c], k) => {
    const y = 10 + k * 28;
    g += `<text x="${X0 - 8}" y="${y + 14}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12.5" fill="var(--ink)" ${k === 0 ? 'font-weight="700"' : ""}>${n}</text>`;
    g += `<rect x="${cx(a)}" y="${y + 3}" width="${cx(b) - cx(a)}" height="15" rx="7" fill="${c}" fill-opacity="${k === 0 ? 1 : 0.75}"/>`;
  });
  g += `<text x="${cx(12)}" y="${42 + D.length * 28}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">infrazvok</text>`;
  g += `<text x="${cx(60000)}" y="${42 + D.length * 28}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">ultrazvok</text>`;
  $("zAnim").innerHTML = g;
}
drawSpeed();
$("zSec").addEventListener("input", renderStorm);
renderStorm();
drawDb();
drawAnim();
