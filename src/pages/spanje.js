// ---------- Spanje in čutila ----------
function drawSleep() {
  const D = [["novorojenček", 14, 17], ["dojenček", 12, 15], ["1–2 leti", 11, 14], ["3–5 let", 10, 13], ["6–13 let", 9, 11],
    ["14–17 let", 8, 10], ["18–64 let", 7, 9], ["65+ let", 7, 8]];
  const X0 = 96, X1 = 340, rowH = 28, MAX = 18;
  const cx = h => X0 + h / MAX * (X1 - X0);
  let g = "";
  [0, 6, 12, 18].forEach(h => {
    g += `<line x1="${cx(h)}" x2="${cx(h)}" y1="6" y2="${10 + D.length * rowH}" stroke="var(--line)"/><text x="${cx(h)}" y="${24 + D.length * rowH}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${h} h</text>`;
  });
  D.forEach(([n, a, b], k) => {
    const y = 10 + k * rowH;
    g += `<text x="${X0 - 8}" y="${y + 14}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12" fill="var(--ink)">${n}</text>`;
    g += `<rect x="${cx(a)}" y="${y + 3}" width="${cx(b) - cx(a)}" height="15" rx="4" fill="var(--tw-naut)"/>`;
    g += `<text x="${cx(b) + 6}" y="${y + 14}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${a}–${b} h</text>`;
  });
  $("sSleep").innerHTML = g;
}
let actx = null, osc = null, gain = null, playing = null;
function stopTone() { if (osc) { try { gain.gain.setTargetAtTime(0, actx.currentTime, 0.02); osc.stop(actx.currentTime + 0.1); } catch (e) {} osc = null; } playing = null; document.querySelectorAll("#sTones button").forEach(b => b.setAttribute("aria-pressed", "false")); }
function playTone(f, btn) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (playing === f) { stopTone(); return; }
    stopTone();
    osc = actx.createOscillator(); gain = actx.createGain();
    osc.frequency.value = f; osc.type = "sine";
    gain.gain.value = 0; gain.gain.setTargetAtTime(0.15, actx.currentTime, 0.03);
    osc.connect(gain).connect(actx.destination); osc.start();
    playing = f; btn.setAttribute("aria-pressed", "true");
    const me = osc; setTimeout(() => { if (osc === me) stopTone(); }, 2500);
  } catch (e) {}
}
function tones() {
  const T = [[1000, "vsi"], [8000, "do ~60 let"], [12000, "do ~50 let"], [15000, "do ~40 let"], [17000, "do ~25 let"], [19000, "do ~20 let"]];
  $("sTones").innerHTML = T.map(([f, a]) => `<button type="button" aria-pressed="false" data-f="${f}" style="--c:var(--sea)">${fmtTone(f)} · ${a}</button>`).join("");
  document.querySelectorAll("#sTones button").forEach(b => b.addEventListener("click", () => playTone(+b.dataset.f, b)));
}
const fmtTone = f => f >= 1000 ? `${String(f / 1000).replace(".", ",")} kHz` : `${f} Hz`;
function drawNear() {
  const D = [[10, 7], [20, 10], [30, 14], [40, 22], [50, 40], [60, 100]];
  const X0 = 40, X1 = 340, Y0 = 14, Y1 = 120, MAX = 100;
  const cx = a => X0 + (a - 10) / 50 * (X1 - X0), cy = v => Y1 - v / MAX * (Y1 - Y0);
  let g = "";
  [0, 25, 50, 75, 100].forEach(v => { g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)"/><text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v}</text>`; });
  D.forEach(([a]) => { g += `<text x="${cx(a)}" y="${Y1 + 16}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${a} let</text>`; });
  g += `<path d="${ptsToD(D.map(([a, v]) => [cx(a), cy(v)]))}" fill="none" stroke="var(--temp)" stroke-width="2.5"/>`;
  D.forEach(([a, v]) => { g += `<circle cx="${cx(a)}" cy="${cy(v)}" r="3" fill="var(--temp)"/>`; });
  g += `<text x="${X0}" y="${Y1 + 32}" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">cm od oči</text>`;
  $("sNear").innerHTML = g;
}
drawSleep();
tones();
drawNear();
