// ---------- Astronomija (Schlyter, nizka natančnost) ----------
const LAT = 46.05, LON = 14.51;
const R = Math.PI / 180, D = 180 / Math.PI;
const rev = x => ((x % 360) + 360) % 360;
const sind = x => Math.sin(x * R), cosd = x => Math.cos(x * R);

function dayNum(ms) { return (ms - Date.UTC(1999, 11, 31)) / 86400000; }

function sunPos(d) {
  const w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.0470 + 0.9856002585 * d);
  const E = M + D * e * sind(M) * (1 + e * cosd(M));
  const xv = cosd(E) - e, yv = Math.sqrt(1 - e * e) * sind(E);
  const lon = rev(Math.atan2(yv, xv) * D + w);
  return { lon, M, w, L: rev(M + w) };
}

function moonPos(d) {
  const N = rev(125.1228 - 0.0529538083 * d), i = 5.1454;
  const w = rev(318.0634 + 0.1643573223 * d), a = 60.2666, e = 0.0549;
  const M = rev(115.3654 + 13.0649929509 * d);
  let E = M + D * e * sind(M) * (1 + e * cosd(M));
  for (let k = 0; k < 8; k++) E = E - (E - D * e * sind(E) - M) / (1 - e * cosd(E));
  const xv = a * (cosd(E) - e), yv = a * Math.sqrt(1 - e * e) * sind(E);
  const v = Math.atan2(yv, xv) * D; let r = Math.hypot(xv, yv);
  const vw = v + w;
  const xh = r * (cosd(N) * cosd(vw) - sind(N) * sind(vw) * cosd(i));
  const yh = r * (sind(N) * cosd(vw) + cosd(N) * sind(vw) * cosd(i));
  const zh = r * sind(vw) * sind(i);
  let lon = rev(Math.atan2(yh, xh) * D), lat = Math.atan2(zh, Math.hypot(xh, yh)) * D;
  const s = sunPos(d), Ms = s.M, Ls = s.L;
  const Lm = rev(M + w + N), Dd = rev(Lm - Ls), F = rev(Lm - N), Mm = M;
  lon += -1.274 * sind(Mm - 2 * Dd) + 0.658 * sind(2 * Dd) - 0.186 * sind(Ms)
    - 0.059 * sind(2 * Mm - 2 * Dd) - 0.057 * sind(Mm - 2 * Dd + Ms)
    + 0.053 * sind(Mm + 2 * Dd) + 0.046 * sind(2 * Dd - Ms) + 0.041 * sind(Mm - Ms)
    - 0.035 * sind(Dd) - 0.031 * sind(Mm + Ms) - 0.015 * sind(2 * F - 2 * Dd) + 0.011 * sind(Mm - 4 * Dd);
  lat += -0.173 * sind(F - 2 * Dd) - 0.055 * sind(Mm - F - 2 * Dd) - 0.046 * sind(Mm + F - 2 * Dd)
    + 0.033 * sind(F + 2 * Dd) + 0.017 * sind(2 * Mm + F);
  r += -0.58 * cosd(Mm - 2 * Dd) - 0.46 * cosd(2 * Dd);
  return { lon: rev(lon), lat, r, sun: s };
}

function eclToHoriz(lon, lat, d, ms, Ls) {
  const ecl = 23.4393 - 3.563e-7 * d;
  const x = cosd(lon) * cosd(lat), y = sind(lon) * cosd(lat), z = sind(lat);
  const ye = y * cosd(ecl) - z * sind(ecl), ze = y * sind(ecl) + z * cosd(ecl);
  const ra = Math.atan2(ye, x) * D, dec = Math.atan2(ze, Math.hypot(x, ye)) * D;
  const t = new Date(ms);
  const ut = t.getUTCHours() + t.getUTCMinutes() / 60 + t.getUTCSeconds() / 3600;
  const ha = rev(Ls + 180 + ut * 15 + LON - ra);
  const alt = Math.asin(sind(LAT) * sind(dec) + cosd(LAT) * cosd(dec) * cosd(ha)) * D;
  const az = rev(Math.atan2(sind(ha), cosd(ha) * sind(LAT) - Math.tan(dec * R) * cosd(LAT)) * D + 180);
  return { alt, az, dec };
}

function moonAt(ms) {
  const d = dayNum(ms), m = moonPos(d);
  const h = eclToHoriz(m.lon, m.lat, d, ms, m.sun.L);
  const par = Math.asin(1 / m.r) * D;
  const elong = rev(m.lon - m.sun.lon);
  return { ...h, h0: 0.7275 * par - 0.5667, elong };
}
function sunAt(ms) {
  const d = dayNum(ms), s = sunPos(d);
  const h = eclToHoriz(s.lon, 0, d, ms, s.L);
  return { ...h, h0: -0.833 };
}

// vzhod, zahod, kulminacija v 24 h od startMs
function events(fn, startMs) {
  const step = 10 * 60000, res = { rise: null, set: null, top: null };
  let pt = startMs, pf = (o => o.alt - o.h0)(fn(pt)), best = { alt: -99, t: startMs };
  const refine = (a, b, rising) => {
    for (let k = 0; k < 14; k++) {
      const m = (a + b) / 2, f = (o => o.alt - o.h0)(fn(m));
      if ((f >= 0) === rising) b = m; else a = m;
    }
    return b;
  };
  for (let t = startMs + step; t <= startMs + 86400000; t += step) {
    const o = fn(t), f = o.alt - o.h0;
    if (pf < 0 && f >= 0 && !res.rise) { const tt = refine(pt, t, true); res.rise = { t: tt, az: fn(tt).az }; }
    if (pf >= 0 && f < 0 && !res.set) { const tt = refine(pt, t, false); res.set = { t: tt, az: fn(tt).az }; }
    if (o.alt > best.alt) best = { alt: o.alt, t };
    pt = t; pf = f;
  }
  // izboljšaj kulminacijo
  let a = best.t - step, b = best.t + step;
  for (let k = 0; k < 20; k++) {
    const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
    if (fn(m1).alt < fn(m2).alt) a = m1; else b = m2;
  }
  const tt = (a + b) / 2, o = fn(tt);
  if (o.alt > o.h0 && tt >= startMs && tt <= startMs + 86400000) res.top = { t: tt, alt: o.alt, az: o.az };
  return res;
}

// ---------- Čas in pas Europe/Ljubljana ----------
const TZ = "Europe/Ljubljana";
const fmtHM = new Intl.DateTimeFormat("sl-SI", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false });
const fmtParts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
const fmtDay = new Intl.DateTimeFormat("sl-SI", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" });

function tzOffsetMin(ms) {
  const p = Object.fromEntries(fmtParts.formatToParts(new Date(ms)).map(x => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
  return Math.round((asUTC - ms) / 60000);
}
function localMidnight(y, m, d) { // ms UTC za 00:00 v Ljubljani
  let ms = Date.UTC(y, m - 1, d) - 60 * 60000;
  const off = tzOffsetMin(ms);
  return Date.UTC(y, m - 1, d) - off * 60000;
}
function todayLocal() {
  const p = Object.fromEntries(fmtParts.formatToParts(new Date()).map(x => [x.type, x.value]));
  return [+p.year, +p.month, +p.day];
}
const hm = ms => fmtHM.format(new Date(ms));

// ---------- Dodatno ----------
const sunAtH = h => ms => { const o = sunAt(ms); o.h0 = h; return o; };
const moonLatAt = ms => moonPos(dayNum(ms)).lat;
// naslednji trenutek po startMs, ko elongacija Lune doseže target (0 mlaj, 90, 180 ščip, 270)
function nextElong(startMs, target) {
  const f = ms => ((moonAt(ms).elong - target + 540) % 360) - 180;
  let a = startMs, fa = f(a);
  for (let t = startMs + 6 * 3600000; t < startMs + 40 * 86400000; t += 6 * 3600000) {
    const ft = f(t);
    if (fa < 0 && ft >= 0 && ft - fa < 90) {
      let lo = t - 6 * 3600000, hi = t;
      for (let k = 0; k < 25; k++) { const m = (lo + hi) / 2; if (f(m) >= 0) hi = m; else lo = m; }
      return hi;
    }
    a = t; fa = ft;
  }
  return null;
}
