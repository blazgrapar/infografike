// ---------- Skupno ----------
const $ = id => document.getElementById(id);
const DIRS = ["S", "SSV", "SV", "VSV", "V", "VJV", "JV", "JJV", "J", "JJZ", "JZ", "ZJZ", "Z", "ZSZ", "SZ", "SSZ"];
const DIRW = { S: "sever", SV: "severovzhod", V: "vzhod", JV: "jugovzhod", J: "jug", JZ: "jugozahod", Z: "zahod", SZ: "severozahod" };
const dir16 = az => DIRS[Math.round(az / 22.5) % 16];
function dirText(az) {
  const k = dir16(az);
  return DIRW[k] ? `<b>${k}</b> · ${DIRW[k]}, ${Math.round(az)}°` : `<b>${k}</b> · ${Math.round(az)}°`;
}
const PHASES = [
  [0, "Mlaj", "6 h", "18 h", "ni vidna, na nebu je skupaj s Soncem"],
  [45, "Rastoči srp", "9 h", "21 h", "zvečer, nizko na zahodu po sončnem zahodu"],
  [90, "Prvi krajec", "12 h", "24 h", "popoldne in zvečer, ob mraku na jugu"],
  [135, "Rastoča luna", "15 h", "3 h", "zvečer in v prvi polovici noči"],
  [180, "Ščip", "18 h", "6 h", "vso noč, opolnoči visoko na jugu"],
  [225, "Pojemajoča luna", "21 h", "9 h", "v drugi polovici noči in zjutraj"],
  [270, "Zadnji krajec", "24 h", "12 h", "druga polovica noči, ob zori na jugu"],
  [315, "Pojemajoči srp", "3 h", "15 h", "zjutraj, nizko na vzhodu pred zoro"],
];
const phaseIndex = el => Math.round(rev(el) / 45) % 8;
function phaseName(el) {
  if (el < 6 || el > 354) return "Mlaj";
  if (el < 84) return "Rastoči srp";
  if (el <= 96) return "Prvi krajec";
  if (el < 174) return "Rastoča luna";
  if (el <= 186) return "Ščip";
  if (el < 264) return "Pojemajoča luna";
  if (el <= 276) return "Zadnji krajec";
  return "Pojemajoči srp";
}
const illum = el => (1 - cosd(el)) / 2;
function phasePath(r, el, n = 64) {
  const limb = [], term = [];
  for (let k = 0; k <= n; k++) {
    const y = -r + 2 * r * k / n, w = Math.sqrt(Math.max(r * r - y * y, 0));
    let l, t;
    if (el <= 180) { l = w; t = cosd(el) * w; } else { l = -w; t = -cosd(el) * w; }
    limb.push([l, y]); term.push([t, y]);
  }
  const pts = limb.concat(term.reverse());
  return "M" + pts.map(p => p[0].toFixed(2) + "," + p[1].toFixed(2)).join(" L") + "Z";
}
function moonSVG(r, el, cx = 0, cy = 0, stroke = true) {
  const tr = `transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"`;
  return `<g ${tr}><circle r="${r}" fill="var(--moon-dark)"/>` +
    `<path d="${phasePath(r, el)}" fill="var(--moon-lit)"/>` +
    (stroke ? `<circle r="${r}" fill="none" stroke="#8A93A8" stroke-opacity="0.6" stroke-width="${Math.max(r / 40, 0.6)}"/>` : "") + `</g>`;
}
const ptsToD = pts => "M" + pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" L");
const fmtDate = new Intl.DateTimeFormat("sl-SI", { timeZone: "UTC", day: "numeric", month: "long" });
const fmtDateY = new Intl.DateTimeFormat("sl-SI", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const fmtDayLong = new Intl.DateTimeFormat("sl-SI", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
const durTxt = m => `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, "0")} min`;
const YEAR = todayLocal()[0];
const doy = (m, d, y = YEAR) => Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / 86400000);
const dayDate = i => new Date(Date.UTC(YEAR, 0, 1 + i));
const dayStart = i => { const t = dayDate(i); return localMidnight(YEAR, t.getUTCFullYear() === YEAR ? t.getUTCMonth() + 1 : 12, t.getUTCFullYear() === YEAR ? t.getUTCDate() : 31); };
const ymd = a => `${a[0]}-${String(a[1]).padStart(2, "0")}-${String(a[2]).padStart(2, "0")}`;
const shiftDay = (a, n) => { const t = new Date(Date.UTC(a[0], a[1] - 1, a[2] + n)); return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()]; };
const comma = (x, d = 1) => x.toFixed(d).replace(".", ",");

// izbirnik dneva: prev / date / next / danes
function dayPicker(prefix, onChange) {
  let cur = todayLocal();
  const set = a => { cur = a; $(prefix + "Day").value = ymd(a); onChange(a); };
  $(prefix + "Prev").addEventListener("click", () => set(shiftDay(cur, -1)));
  $(prefix + "Next").addEventListener("click", () => set(shiftDay(cur, 1)));
  $(prefix + "Today").addEventListener("click", () => set(todayLocal()));
  $(prefix + "Day").addEventListener("change", e => {
    const v = e.target.value.split("-").map(Number);
    if (v.length === 3 && v.every(n => !isNaN(n))) set(v);
  });
  set(cur);
  return { get: () => cur, set };
}
function dayPickerHTML(prefix) {
  return `<div class="controls">
    <button id="${prefix}Prev" type="button" aria-label="Prejšnji dan">◀</button>
    <input id="${prefix}Day" type="date" aria-label="Dan">
    <button id="${prefix}Next" type="button" aria-label="Naslednji dan">▶</button>
    <button id="${prefix}Today" type="button" class="wide">Danes</button>
  </div>`;
}
