// ---------- Horoskop ----------
// [ime, simbol, začetek (mesec, dan)]
const SIGNS = [
  ["Kozorog", "♑", 12, 22], ["Vodnar", "♒", 1, 20], ["Ribi", "♓", 2, 19], ["Oven", "♈", 3, 21],
  ["Bik", "♉", 4, 20], ["Dvojčka", "♊", 5, 21], ["Rak", "♋", 6, 21], ["Lev", "♌", 7, 23],
  ["Devica", "♍", 8, 23], ["Tehtnica", "♎", 9, 23], ["Škorpijon", "♏", 10, 23], ["Strelec", "♐", 11, 22],
];
const CONS = [
  ["Kozorog", "♑", 1, 20], ["Vodnar", "♒", 2, 16], ["Ribi", "♓", 3, 11], ["Oven", "♈", 4, 18],
  ["Bik", "♉", 5, 13], ["Dvojčka", "♊", 6, 21], ["Rak", "♋", 7, 20], ["Lev", "♌", 8, 10],
  ["Devica", "♍", 9, 16], ["Tehtnica", "♎", 10, 30], ["Škorpijon", "♏", 11, 23], ["Kačenosec", "⛎", 11, 29],
  ["Strelec", "♐", 12, 17],
];
const ND = 365;
const dayOf = (m, d) => doy(m, d, 2025); // neprestopno leto
function which(list, m, d) {
  const t = dayOf(m, d);
  let best = list[list.length - 1], bt = -1;
  list.forEach(s => { const s0 = dayOf(s[2], s[3]); if (s0 <= t && s0 > bt) { best = s; bt = s0; } });
  if (bt < 0) { // pred prvim začetkom v letu
    best = list.reduce((a, s) => dayOf(s[2], s[3]) > dayOf(a[2], a[3]) ? s : a);
  }
  return best;
}

function drawWheel() {
  const ang = t => (t / ND) * 360 - 90; // 1. januar zgoraj
  const P = (r, a) => [r * cosd(a), r * sind(a)];
  const arc = (r0, r1, a0, a1) => {
    if (a1 < a0) a1 += 360;
    const large = a1 - a0 > 180 ? 1 : 0;
    const [x0, y0] = P(r1, a0), [x1, y1] = P(r1, a1), [x2, y2] = P(r0, a1), [x3, y3] = P(r0, a0);
    return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
  };
  const ring = (list, r0, r1, colA, colB, fs) => {
    let g = "";
    const st = list.map(s => dayOf(s[2], s[3]));
    list.forEach((s, k) => {
      const a0 = ang(st[k]), a1 = ang(st[(k + 1) % list.length]);
      g += `<path d="${arc(r0, r1, a0, a1)}" fill="${k % 2 ? colA : colB}" stroke="#1C2436" stroke-width="1"/>`;
      let am = (a0 + (a1 < a0 ? a1 + 360 : a1)) / 2;
      const [x, y] = P((r0 + r1) / 2, am);
      g += `<text x="${x}" y="${y + fs * 0.35}" text-anchor="middle" font-size="${fs}" fill="#E9ECF3" font-family="DejaVu Sans, Segoe UI Symbol, Noto Sans Symbols, sans-serif">${s[1]}\uFE0E</text>`;
    });
    return g;
  };
  let g = ring(SIGNS, 128, 168, "#46506A", "#3A4458", 17);
  g += ring(CONS, 84, 124, "#2A6E66", "#215A54", 14);
  // meseci
  "JFMAMJJASOND".split("").forEach((l, m) => {
    const a = ang(dayOf(m + 1, 1));
    const [x1, y1] = P(56, a), [x2, y2] = P(80, a), [tx, ty] = P(66, ang(dayOf(m + 1, 15)));
    g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#56607A"/>`;
    g += `<text x="${tx}" y="${ty + 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="#A9B1C4">${l}</text>`;
  });
  // danes
  const td = todayLocal(), a = ang(dayOf(td[1], td[2]));
  const [x1, y1] = P(46, a), [x2, y2] = P(172, a);
  g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F2B33D" stroke-width="2.5"/>`;
  g += `<circle r="26" fill="#F2B33D"/><text y="4" text-anchor="middle" font-family="Sora, sans-serif" font-size="10" font-weight="600" fill="#1C2436">Sonce</text>`;
  $("zWheel").innerHTML = g;
}

function matchDays() {
  let n = 0;
  for (let t = 0; t < ND; t++) {
    const dt = new Date(Date.UTC(2025, 0, 1 + t)), m = dt.getUTCMonth() + 1, d = dt.getUTCDate();
    if (which(SIGNS, m, d)[0] === which(CONS, m, d)[0]) n++;
  }
  return n;
}

function renderZ() {
  const v = $("zDate").value.split("-").map(Number);
  if (v.length !== 3 || v.some(isNaN)) return;
  const [, m, d] = v, s = which(SIGNS, m, d), c = which(CONS, m, d);
  $("zSign").textContent = `${s[1]}\uFE0E ${s[0]}`;
  $("zCon").textContent = `${c[1]}\uFE0E ${c[0]}`;
  $("zMsg").textContent = s[0] === c[0]
    ? "Ujemata se. Tvoje znamenje je eno redkih, ki še vedno ustreza zvezdam."
    : c[0] === "Kačenosec"
      ? "Sonce je bilo v Kačenoscu, trinajstem ozvezdju, ki ga horoskop ne pozna."
      : `Ne ujemata se. Na tvoj rojstni dan je bilo Sonce v ozvezdju ${c[0]}, ne v znamenju ${s[0]}.`;
}

function drawPrec() {
  let g = "";
  const cx = 110, cy = 120;
  g += `<ellipse cx="${cx}" cy="40" rx="46" ry="12" fill="none" stroke="#F2B33D" stroke-dasharray="4 4"/>`;
  g += `<line x1="${cx}" y1="${cy}" x2="${cx + 30}" y2="40" stroke="#E9ECF3" stroke-width="2"/>`;
  g += `<line x1="${cx}" y1="${cy}" x2="${cx - 30}" y2="200" stroke="#E9ECF3" stroke-width="2" stroke-opacity="0.4"/>`;
  g += `<line x1="${cx}" y1="30" x2="${cx}" y2="210" stroke="#56607A" stroke-dasharray="3 3"/>`;
  g += `<circle cx="${cx}" cy="${cy}" r="38" fill="#3D7DC4"/><path d="M${cx},${cy - 38} A38,38 0 0,0 ${cx},${cy + 38} Z" fill="#0B1020" opacity="0.45"/>`;
  g += `<circle cx="${cx + 30}" cy="40" r="4" fill="#F2B33D"/>`;
  g += `<text x="${cx + 52}" y="28" font-family="IBM Plex Mono, monospace" font-size="10" fill="#F2B33D">os opiše krog</text>`;
  g += `<text x="${cx + 52}" y="42" font-family="IBM Plex Mono, monospace" font-size="10" fill="#F2B33D">v 25.800 letih</text>`;
  g += `<text x="${cx + 8}" y="${cy + 64}" font-family="IBM Plex Mono, monospace" font-size="10" fill="#A9B1C4">23,4°</text>`;
  // časovnica pomladišča
  const X = 220, rows = [["Oven", "pred 2000 leti"], ["Ribi", "danes"], ["Vodnar", "čez nekaj stoletij"]];
  rows.forEach(([n, t], k) => {
    const y = 90 + k * 40;
    g += `<circle cx="${X}" cy="${y}" r="5" fill="${k === 1 ? "#F2B33D" : "#56607A"}"/>`;
    g += `<text x="${X + 14}" y="${y - 2}" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="#E9ECF3">${n}</text>`;
    g += `<text x="${X + 14}" y="${y + 12}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">${t}</text>`;
  });
  g += `<line x1="${X}" y1="95" x2="${X}" y2="165" stroke="#56607A"/>`;
  g += `<text x="${X}" y="66" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">Sonce ob začetku pomladi</text>`;
  $("zPrec").innerHTML = g;
}

drawWheel();
drawPrec();
$("zMatch").textContent = matchDays();
const td0 = todayLocal();
$("zDate").value = ymd([1995, td0[1], td0[2]]);
$("zDate").addEventListener("input", renderZ);
$("zDate").addEventListener("change", renderZ);
renderZ();
