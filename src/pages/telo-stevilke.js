// ---------- Telo v številkah ----------
const WHO = [["Novorojenček", 75], ["Moški", 60], ["Ženska", 55], ["Starejši", 50]];
let wSel = 1;
function renderWater() {
  const [n, v] = WHO[wSel];
  let g = "";
  for (let k = 0; k < 100; k++) {
    const c = k % 25, r = 3 - Math.floor(k / 25);
    g += `<rect x="${8 + c * 13.8}" y="${8 + r * 27}" width="11" height="22" rx="2" fill="${k < v ? "var(--rain)" : "var(--line)"}"/>`;
  }
  $("tWater").innerHTML = g;
  $("tWaterTxt").textContent = `${n}: okoli ${v} % telesne teže je voda.`;
}
function whoChips() {
  $("tWho").innerHTML = WHO.map(([n], k) => `<button type="button" id="tw${k}" aria-pressed="${k === wSel}" style="--c:var(--rain)">${n}</button>`).join("");
  WHO.forEach((_, k) => $("tw" + k).addEventListener("click", () => { wSel = k; WHO.forEach((_, j) => $("tw" + j).setAttribute("aria-pressed", j === k)); renderWater(); }));
}
function drawGrow() {
  const items = [["Lasje", 12, "cm na leto"], ["Nohti na rokah", 4.2, "cm na leto"], ["Nohti na nogah", 1.9, "cm na leto"]];
  const X0 = 110, X1 = 300;
  let g = "";
  items.forEach(([n, v, u], k) => {
    const y = 14 + k * 42, w = v / 12 * (X1 - X0);
    g += `<text x="${X0 - 8}" y="${y + 14}" text-anchor="end" font-family="Source Sans 3, sans-serif" font-size="12.5" fill="var(--ink)">${n}</text>`;
    g += `<rect x="${X0}" y="${y + 2}" width="${w}" height="16" rx="3" fill="var(--sun)" fill-opacity="${k ? 0.65 : 1}"/>`;
    g += `<text x="${X0 + w + 6}" y="${y + 14}" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--muted)">${String(v).replace(".", ",")} ${u}</text>`;
  });
  g += `<text x="${X0}" y="${14 + 3 * 42 + 4}" font-family="Source Sans 3, sans-serif" font-size="11" fill="var(--muted)">Lasje zrastejo okoli centimeter na mesec.</text>`;
  $("tGrow").innerHTML = g;
}
whoChips();
renderWater();
drawGrow();
