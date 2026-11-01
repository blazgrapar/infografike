// ---------- Sonce ----------
const mins = (ms, st) => (ms - st) / 60000;

// podatki za vse leto (enkrat)
const SUNYEAR = [];
for (let i = 0; i < 365; i++) {
  const st = dayStart(i), e = events(sunAt, st);
  SUNYEAR.push({ st, e, r: mins(e.rise.t, st), s: mins(e.set.t, st) });
}

const AZ0 = 30, AZ1 = 330, ALTMAX = 75;
const px = az => 14 + (az - AZ0) / (AZ1 - AZ0) * 332;
const py = alt => 196 - alt / ALTMAX * 176;
function sunPathPts(i) {
  const { e } = SUNYEAR[i], pts = [];
  for (let t = e.rise.t; t <= e.set.t; t += 5 * 60000) { const o = sunAt(t); pts.push([px(o.az), py(Math.max(o.alt, 0))]); }
  const o = sunAt(e.set.t); pts.push([px(o.az), py(0)]);
  return pts;
}
const REF = [[doy(6, 21), "21. 6."], [doy(3, 20), "enakonočje"], [doy(12, 21), "21. 12."]].map(([i, l]) => ({ i, l, d: ptsToD(sunPathPts(i)), top: SUNYEAR[i].e.top }));

function drawSunPath(i) {
  let g = "";
  [20, 40, 60].forEach(a => {
    g += `<line x1="14" x2="346" y1="${py(a)}" y2="${py(a)}" stroke="var(--line)" stroke-width="1"/>` +
      `<text x="16" y="${py(a) - 4}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${a}°</text>`;
  });
  g += `<line x1="8" x2="352" y1="${py(0)}" y2="${py(0)}" stroke="var(--ink)" stroke-width="1.5"/>`;
  [[45, "SV"], [90, "V"], [135, "JV"], [180, "J"], [225, "JZ"], [270, "Z"], [315, "SZ"]].forEach(([az, l]) => {
    g += `<line x1="${px(az)}" x2="${px(az)}" y1="${py(0)}" y2="${py(0) + 5}" stroke="var(--ink)"/>` +
      `<text x="${px(az)}" y="${py(0) + 20}" text-anchor="middle" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">${l}</text>`;
  });
  REF.forEach(r => {
    g += `<path d="${r.d}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"/>`;
    g += `<text x="${px(r.top.az) + 4}" y="${py(r.top.alt) - 6}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${r.l}</text>`;
  });
  const pts = sunPathPts(i), { e } = SUNYEAR[i];
  g += `<path d="${ptsToD(pts)}" fill="none" stroke="var(--sun)" stroke-width="3" stroke-linecap="round"/>`;
  g += `<circle cx="${px(e.rise.az)}" cy="${py(0)}" r="4.5" fill="var(--sun)"/><circle cx="${px(e.set.az)}" cy="${py(0)}" r="4.5" fill="var(--sun)"/>`;
  g += `<circle cx="${px(e.top.az)}" cy="${py(e.top.alt)}" r="9" fill="var(--sun)"/>`;
  $("sunPath").innerHTML = g;

  $("sunDayLbl").textContent = fmtDate.format(dayDate(i));
  $("sRise").textContent = hm(e.rise.t); $("sRiseD").innerHTML = `${dir16(e.rise.az)}, ${Math.round(e.rise.az)}°`;
  $("sSet").textContent = hm(e.set.t); $("sSetD").innerHTML = `${dir16(e.set.az)}, ${Math.round(e.set.az)}°`;
  $("sNoon").textContent = hm(e.top.t); $("sNoonD").textContent = `${Math.round(e.top.alt)}° nad obzorjem`;
  $("sLen").textContent = durTxt(SUNYEAR[i].s - SUNYEAR[i].r);
  drawDayChart(i);
}

function drawDayChart(sel) {
  const X0 = 38, X1 = 352, H0 = 3, H1 = 23, Y0 = 16, Y1 = 216;
  const cx = i => X0 + i / 364 * (X1 - X0), cy = m => Y0 + (m / 60 - H0) / (H1 - H0) * (Y1 - Y0);
  let g = "";
  for (let h = 6; h <= 21; h += 3) {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(h * 60)}" y2="${cy(h * 60)}" stroke="var(--line)"/>` +
      `<text x="${X0 - 6}" y="${cy(h * 60) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${h}:00</text>`;
  }
  "JFMAMJJASOND".split("").forEach((l, m) => {
    const a = doy(m + 1, 1), b = m < 11 ? doy(m + 2, 1) : 365;
    g += `<line x1="${cx(a)}" x2="${cx(a)}" y1="${Y1}" y2="${Y1 + 4}" stroke="var(--muted)"/>` +
      `<text x="${cx((a + b) / 2)}" y="${Y1 + 18}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${l}</text>`;
  });
  const up = SUNYEAR.map((d, i) => [cx(i), cy(d.r)]), dn = SUNYEAR.map((d, i) => [cx(i), cy(d.s)]);
  g += `<path d="${ptsToD(up.concat(dn.slice().reverse()))}Z" fill="var(--sun)" fill-opacity="0.18"/>`;
  g += `<path d="${ptsToD(up)}" fill="none" stroke="var(--sun)" stroke-width="2"/><path d="${ptsToD(dn)}" fill="none" stroke="var(--sun)" stroke-width="2"/>`;
  const d = SUNYEAR[sel], x = cx(sel);
  g += `<line x1="${x}" x2="${x}" y1="${cy(d.r)}" y2="${cy(d.s)}" stroke="var(--ink)" stroke-width="1.5"/>`;
  g += `<circle cx="${x}" cy="${cy(d.r)}" r="4" fill="var(--ink)"/><circle cx="${x}" cy="${cy(d.s)}" r="4" fill="var(--ink)"/>`;
  const anchor = sel > 250 ? "end" : "start", dx = sel > 250 ? -7 : 7;
  g += `<text x="${x + dx}" y="${cy(d.r) + 14}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--ink)">vzhod ${hm(d.e.rise.t)}</text>`;
  g += `<text x="${x + dx}" y="${cy(d.s) - 8}" text-anchor="${anchor}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--ink)">zahod ${hm(d.e.set.t)}</text>`;
  $("dayChart").innerHTML = g;
}

{
  const [ty, tm, td] = todayLocal();
  const idx = Math.min(364, Math.max(0, doy(tm, td)));
  $("sunDay").value = idx;
  $("sunDay").addEventListener("input", e => drawSunPath(+e.target.value));
  drawSunPath(idx);
}

