// ---------- Tvoje življenje v številkah ----------
const fmtL = (v, d = 0) => v.toLocaleString("sl-SI", { maximumFractionDigits: d });
const fmtDL = new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "long", year: "numeric" });
let birth = null;
function parseBirth() {
  const v = $("lDate").value.split("-").map(Number);
  if (v.length !== 3 || v.some(isNaN)) return null;
  return new Date(v[0], v[1] - 1, v[2]).getTime();
}
function big(v) {
  if (v >= 1e9) return `${fmtL(v / 1e9, 2)} milijarde`;
  if (v >= 1e6) return `${fmtL(v / 1e6, 1)} milijona`;
  return fmtL(Math.round(v));
}
function tickLife() {
  if (!birth) return;
  const ms = Date.now() - birth;
  if (ms < 0) { $("lDays").textContent = "–"; $("lSecs").textContent = "datum je v prihodnosti"; return; }
  const min = ms / 60000, days = Math.floor(ms / 86400000);
  $("lDays").textContent = `${fmtL(days)} dni`;
  $("lSecs").textContent = `${fmtL(Math.floor(ms / 1000))} sekund`;
  $("lStats").innerHTML = [
    ["Utripov srca", big(min * 75)],
    ["Vdihov", big(min * 16)],
    ["Prespanega časa", `${fmtL(days / 3 / 365.25, 1)} let`],
    ["Obhodov Zemlje okoli Sonca", fmtL(ms / 31557600000, 2)],
    ["Poti z Zemljo okoli Sonca", `${big(ms / 3600000 * 107000)} km`],
    ["Las, če ga nikoli ne bi strigel", `${fmtL(ms / 2629800000 / 100, 1)} m`],
  ].map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
}
function renderMiles() {
  const D = 86400000, now = Date.now();
  const M = [
    ["10.000. dan", birth + 10000 * D], ["20.000. dan", birth + 20000 * D], ["30.000. dan", birth + 30000 * D],
    ["Milijarda sekund", birth + 1e12], ["Dve milijardi sekund", birth + 2e12],
    ["Milijon minut", birth + 6e10], ["1000. teden", birth + 7000 * D], ["2000. teden", birth + 14000 * D],
  ].sort((a, b) => a[1] - b[1]);
  $("lMiles").innerHTML = M.map(([n, t]) => {
    const past = t < now, days = Math.ceil((t - now) / D);
    return `<div style="${past ? "opacity:0.55" : ""}"><span class="k">${n}</span><span class="v">${fmtDL.format(new Date(t))}</span>` +
      `<span class="d">${past ? "že za tabo" : days === 0 ? "danes!" : `čez ${fmtL(days)} dni`}</span></div>`;
  }).join("");
}
function drawWeeks() {
  const cols = 52, years = 82, s = 6.2, gap = 0.6, X0 = 20, Y0 = 8;
  const lived = Math.floor((Date.now() - birth) / (7 * 86400000));
  let g = "";
  for (let y = 0; y < years; y++) {
    if (y % 10 === 0) g += `<text x="${X0 - 4}" y="${Y0 + y * s + s - 1}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="7" fill="var(--muted)">${y}</text>`;
    for (let w = 0; w < cols; w++) {
      const k = y * cols + w;
      g += `<rect x="${X0 + w * s}" y="${Y0 + y * s}" width="${s - gap}" height="${s - gap}" fill="${k < lived ? "var(--sun)" : "var(--line)"}"/>`;
    }
  }
  $("lWeeks").innerHTML = g;
}
function renderLife() { birth = parseBirth(); if (!birth) return; tickLife(); renderMiles(); drawWeeks(); }
$("lDate").value = "1990-01-01";
$("lDate").addEventListener("change", renderLife);
$("lDate").addEventListener("input", renderLife);
renderLife();
setInterval(tickLife, 1000);
