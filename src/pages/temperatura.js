// ---------- Temperatura ----------
function drawScale() {
  const P = [[5500, "površje Sonca"], [1200, "lava"], [400, "peč za pico"], [100, "vre voda"], [56.7, "rekord na Zemlji"], [37, "človeško telo"],
    [0, "zmrzne voda"], [-89.2, "rekord mraza, Antarktika"], [-196, "tekoči dušik"], [-273.15, "absolutna ničla"]];
  // nelinearna os: arcsinh za kompresijo
  const f = t => Math.asinh(t / 30);
  const lo = f(-273.15), hi = f(5500), Y0 = 16, Y1 = 384, cy = t => Y1 - (f(t) - lo) / (hi - lo) * (Y1 - Y0);
  const X = 70;
  let g = `<defs><linearGradient id="thG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3F7FB8"/><stop offset="0.45" stop-color="#8EC3E6"/><stop offset="0.6" stop-color="#F2B33D"/><stop offset="1" stop-color="#E07A5F"/></linearGradient></defs>`;
  g += `<rect x="${X - 7}" y="${Y0}" width="14" height="${Y1 - Y0}" rx="7" fill="url(#thG)"/>`;
  P.forEach(([t, n]) => {
    const y = cy(t);
    g += `<line x1="${X + 9}" x2="${X + 20}" y1="${y}" y2="${y}" stroke="var(--ink)"/>`;
    g += `<text x="${X - 14}" y="${y + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${String(t).replace(".", ",")}</text>`;
    g += `<text x="${X + 26}" y="${y + 4}" font-family="Source Sans 3, sans-serif" font-size="12.5" fill="var(--ink)">${n}</text>`;
  });
  g += `<text x="${X - 14}" y="${Y0 - 4}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">°C</text>`;
  $("tScale").innerHTML = g;
}
function renderConv() {
  const c = +$("tC").value;
  $("tCLbl").textContent = `${c} °C`;
  const fmt = v => v.toFixed(1).replace(".", ",").replace(",0", "");
  $("tConv").innerHTML = `<div><span class="k">Fahrenheit</span><span class="v">${fmt(c * 9 / 5 + 32)} °F</span></div>` +
    `<div><span class="k">Kelvin</span><span class="v">${fmt(c + 273.15)} K</span></div>`;
}
const PLACES = [["Morje", 0], ["Ljubljana", 295], ["Kredarica", 2514], ["Triglav", 2864], ["Mont Blanc", 4806], ["Everest", 8849]];
function boilAt(h) {
  const p = 1013.25 * Math.pow(1 - 2.25577e-5 * h, 5.25588);
  const T = 1 / (1 / 373.15 - 8.314 * Math.log(p / 1013.25) / 40660);
  return [T - 273.15, p];
}
function renderBoil() {
  const h = +$("tH").value, [t, p] = boilAt(h);
  $("tHLbl").textContent = `${h.toLocaleString("sl-SI")} m`;
  PLACES.forEach(([, ph], k) => { const b = $("tp" + k); if (b) b.setAttribute("aria-pressed", ph === h); });
  $("tBoil").textContent = `Voda zavre pri ${t.toFixed(1).replace(".", ",")} °C`;
  $("tBoilTxt").textContent = `Zračni tlak je približno ${Math.round(p)} hPa, kar je ${Math.round(p / 1013.25 * 100)} % tlaka ob morju.`;
}
function placeChips() {
  $("tPlaces").innerHTML = PLACES.map(([n, h], k) => `<button type="button" id="tp${k}" aria-pressed="false" style="--c:var(--sea)">${n}</button>`).join("");
  PLACES.forEach(([n, h], k) => $("tp" + k).addEventListener("click", () => { $("tH").value = h; renderBoil(); }));
}
function renderWind() {
  const T = +$("wT").value, V = +$("wV").value;
  $("wTLbl").textContent = `${T} °C`; $("wVLbl").textContent = `${V} km/h`;
  const W = 13.12 + 0.6215 * T - 11.37 * Math.pow(V, 0.16) + 0.3965 * T * Math.pow(V, 0.16);
  $("wFeel").textContent = `Občuti se kot ${String(Math.round(W)).replace("-", "−")} °C`;
  $("wTxt").textContent = W <= -40 ? "Nevarnost ozeblin v nekaj minutah. Pokrij vso kožo." : W <= -28 ? "Nepokrita koža lahko ozebe v pol ure." : W <= -10 ? "Zelo mrzlo. Obleci se v več plasti in zaščiti obraz." : "Hladno. Kapa in rokavice prideta prav.";
}
drawScale();
$("tC").addEventListener("input", renderConv); renderConv();
placeChips(); $("tH").addEventListener("input", renderBoil); renderBoil();
$("wT").addEventListener("input", renderWind); $("wV").addEventListener("input", renderWind); renderWind();
