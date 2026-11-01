// ---------- Koledar ----------
const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

function drawLeap() {
  const X0 = 20, W = 76, Y = 30, H = 36;
  let g = "";
  for (let k = 0; k < 4; k++) {
    const x = X0 + k * (W + 6);
    g += `<rect x="${x}" y="${Y}" width="${W}" height="${H}" rx="4" fill="var(--line)"/>`;
    g += `<text x="${x + W / 2}" y="${Y - 8}" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="600" fill="var(--ink)">${k + 1}. leto</text>`;
    g += `<text x="${x + W / 2}" y="${Y + 22}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="var(--ink)">365 dni</text>`;
    // ostanek
    const acc = (k + 1) * 0.2422;
    g += `<rect x="${x}" y="${Y + H + 10}" width="${W * Math.min(acc, 1)}" height="14" rx="3" fill="var(--sun)" fill-opacity="${k === 3 ? 1 : 0.55}"/>`;
    g += `<rect x="${x}" y="${Y + H + 10}" width="${W}" height="14" rx="3" fill="none" stroke="var(--line)"/>`;
    g += `<text x="${x + W / 2}" y="${Y + H + 42}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${["¼ dneva", "½ dneva", "¾ dneva", "+1 dan → 29. 2."][k]}</text>`;
  }
  g += `<text x="20" y="${Y + H + 64}" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">rumeno: ostanek, ki se nabira</text>`;
  $("leapChart").innerHTML = g;
}

function checkLeap() {
  const y = parseInt($("leapYear").value, 10);
  if (!(y > 0)) { $("leapAns").textContent = "Vpiši leto"; $("leapWhy").textContent = ""; return; }
  const L = isLeap(y);
  $("leapAns").textContent = `${y} ${L ? "je prestopno" : "ni prestopno"}`;
  $("leapWhy").textContent =
    y % 400 === 0 ? "Deljivo je s 400, zato je prestopno, čeprav je stoletje." :
    y % 100 === 0 ? "Je stoletje, ki ni deljivo s 400, zato ni prestopno." :
    y % 4 === 0 ? "Deljivo je s 4 in ni stoletje." : "Ni deljivo s 4.";
}

function drawGreg() {
  const days = [1, 2, 3, 4, 15, 16, 17, 18], names = ["po", "to", "sr", "če", "pe", "so", "ne", "po"];
  const X0 = 8, W = 40, G = 3, Y = 30;
  let g = `<text x="8" y="16" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--ink)">Oktober 1582</text>`;
  days.forEach((d, k) => {
    const x = X0 + k * (W + G) + (k >= 4 ? 8 : 0);
    const hl = d === 4 || d === 15;
    g += `<rect x="${x}" y="${Y}" width="${W}" height="48" rx="6" fill="${hl ? "var(--sun)" : "var(--surface)"}" fill-opacity="${hl ? 0.25 : 1}" stroke="var(--line)"/>`;
    g += `<text x="${x + W / 2}" y="${Y + 17}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${names[(k + 0) % 8]}</text>`;
    g += `<text x="${x + W / 2}" y="${Y + 38}" text-anchor="middle" font-family="Sora, sans-serif" font-size="16" font-weight="700" fill="var(--ink)">${d}</text>`;
  });
  const xg = X0 + 4 * (W + G) + 2;
  g += `<line x1="${xg}" x2="${xg}" y1="${Y - 6}" y2="${Y + 56}" stroke="var(--temp)" stroke-width="2" stroke-dasharray="3 3"/>`;
  g += `<text x="${xg}" y="${Y + 76}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--temp)">preskočenih 10 dni</text>`;
  $("gregChart").innerHTML = g;
}

function easterWest(Y) {
  const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return [mo, da];
}
function easterEast(Y) {
  const a = Y % 4, b = Y % 7, c = Y % 19, d = (19 * c + 15) % 30, e = (2 * a + 4 * b - d + 34) % 7;
  const mo = Math.floor((d + e + 114) / 31), da = ((d + e + 114) % 31) + 1;
  const diff = Math.floor(Y / 100) - Math.floor(Y / 400) - 2;
  const t = new Date(Date.UTC(Y, mo - 1, da + diff));
  return [t.getUTCMonth() + 1, t.getUTCDate()];
}
const fmtE = (y, [m, d]) => fmtDate.format(new Date(Date.UTC(y, m - 1, d)));

const HIST = {};
for (let y = 1900; y <= 2099; y++) { const [m, d] = easterWest(y); const k = m === 3 ? d - 22 : d + 9; HIST[k] = (HIST[k] || 0) + 1; }

function drawHist(sel) {
  const X0 = 22, X1 = 352, Y0 = 12, Y1 = 132, N = 35, bw = (X1 - X0) / N;
  const max = Math.max(...Object.values(HIST));
  let g = "";
  [0, 5, 10].forEach(v => {
    const y = Y1 - v / max * (Y1 - Y0);
    if (v <= max) g += `<line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${X0 - 4}" y="${y + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${v}</text>`;
  });
  for (let k = 0; k < N; k++) {
    const v = HIST[k] || 0, h = v / max * (Y1 - Y0);
    g += `<rect x="${X0 + k * bw + 0.8}" y="${Y1 - h}" width="${bw - 1.6}" height="${h}" fill="${k === sel ? "var(--sun)" : "var(--muted)"}" fill-opacity="${k === sel ? 1 : 0.45}"/>`;
  }
  [[0, "22. 3."], [10, "1. 4."], [19, "10. 4."], [29, "20. 4."], [34, "25. 4."]].forEach(([k, l]) => {
    g += `<text x="${X0 + (k + 0.5) * bw}" y="${Y1 + 15}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${l}</text>`;
  });
  $("eHist").innerHTML = g;
}

function calcEaster() {
  const y = parseInt($("eYear").value, 10);
  if (!(y >= 1583 && y <= 4099)) { $("eWest").textContent = "leto 1583–4099"; $("eEast").textContent = "–"; return; }
  const w = easterWest(y), e = easterEast(y);
  $("eWest").textContent = fmtE(y, w);
  $("eEast").textContent = fmtE(y, e) + (w[0] === e[0] && w[1] === e[1] ? " · isti dan" : "");
  drawHist(w[0] === 3 ? w[1] - 22 : w[1] + 9);
}

drawLeap();
drawGreg();
$("leapYear").value = YEAR;
$("leapGo").addEventListener("click", checkLeap);
$("leapYear").addEventListener("input", checkLeap);
checkLeap();
$("eYear").value = YEAR + 1;
$("eGo").addEventListener("click", calcEaster);
$("eYear").addEventListener("input", calcEaster);
calcEaster();
