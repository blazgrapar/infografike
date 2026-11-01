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
