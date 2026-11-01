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
