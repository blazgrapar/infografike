// ---------- Slovenija v 100 ljudeh ----------
const AGE = { 1991: [21, 68, 11], 2023: [15, 64, 21] };
let sY = 2023;
const COLS = ["var(--sea)", "var(--muted)", "var(--sun)"];

function person(x, y, s, fill, op = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})" fill="${fill}" fill-opacity="${op}"><circle cx="0" cy="-6" r="3.4"/><path d="M-5,9 L-5,1 Q-5,-2 -2,-2 L2,-2 Q5,-2 5,1 L5,9 Z"/></g>`;
}
function grid(colorFor, W = 360, cols = 20, rows = 5, s = 1) {
  const dx = (W - 20) / cols, dy = 36;
  let g = "";
  for (let k = 0; k < cols * rows; k++) {
    const c = k % cols, r = Math.floor(k / cols);
    g += person(10 + dx * (c + 0.5), 22 + r * dy, s, colorFor(k));
  }
  return g;
}

function renderAge() {
  const [a, b, c] = AGE[sY];
  $("sAge").innerHTML = grid(k => k < a ? COLS[0] : k < a + b ? COLS[1] : COLS[2]);
  $("sAgeTxt").textContent = sY === 2023
    ? `Leta 2023 je bilo med sto ljudmi ${a} otrok in ${c} starejših od 65 let. Starejših je več kot otrok od leta 2005.`
    : `Leta 1991 je bilo med sto ljudmi ${a} otrok in le ${c} starejših od 65 let.`;
}
function yearChips() {
  $("sYear").innerHTML = [1991, 2023].map(y => `<button type="button" id="sy${y}" aria-pressed="${y === sY}" style="--c:var(--sun)">${y}</button>`).join("");
  [1991, 2023].forEach(y => $("sy" + y).addEventListener("click", () => {
    sY = y; [1991, 2023].forEach(z => $("sy" + z).setAttribute("aria-pressed", z === sY)); renderAge();
  }));
}

const FACTS = [
  [9, "je tujih državljanov", "Skoraj polovica jih ima državljanstvo Bosne in Hercegovine."],
  [26, "odraslih ima visokošolsko izobrazbo", "Pred desetimi leti jih je bilo 19."],
  [5, "živi v Mestni občini Maribor", "Maribor je druga največja občina v državi."],
  [2, "se imenujeta Marija", "Marija je daleč najpogostejše ime v Sloveniji."],
  [1, "se piše Novak", "Točneje pol: Novakov je okoli 10.500."],
];
function renderFacts() {
  $("sFacts").innerHTML = FACTS.map(([n, t, d]) => {
    let g = "";
    for (let k = 0; k < 100; k++) {
      const c = k % 50, r = Math.floor(k / 50), on = k < n;
      g += person(8 + c * 6.9, 18 + r * 22, 0.62, on ? "var(--sun)" : "var(--muted)", on ? 1 : 0.3);
    }
    return `<div class="card" style="grid-template-columns:1fr"><span class="ct"><h2><span style="color:var(--sun);font-size:1.6rem">${n}</span> od 100 ${t}</h2>` +
      `<svg viewBox="0 0 360 50" class="chart" style="width:100%;height:auto;border-radius:0" aria-hidden="true">${g}</svg><p>${d}</p></span></div>`;
  }).join("");
}

yearChips();
renderAge();
renderFacts();
