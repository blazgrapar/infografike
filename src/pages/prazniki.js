// ---------- Prazniki in prosti dnevi ----------
function easterW(Y) {
  const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return [Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1];
}
const DU = (y, m, d) => new Date(Date.UTC(y, m - 1, d));
const addD = (t, n) => new Date(t.getTime() + n * 86400000);
const WD = ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"];
const fmtDM = new Intl.DateTimeFormat("sl-SI", { timeZone: "UTC", day: "numeric", month: "long" });

function holidays(y) {
  const [em, ed] = easterW(y), E = DU(y, em, ed);
  return [
    [DU(y, 1, 1), "Novo leto"], [DU(y, 1, 2), "Novo leto"],
    [DU(y, 2, 8), "Prešernov dan"],
    [E, "Velikonočna nedelja"], [addD(E, 1), "Velikonočni ponedeljek"],
    [DU(y, 4, 27), "Dan upora proti okupatorju"],
    [DU(y, 5, 1), "Praznik dela"], [DU(y, 5, 2), "Praznik dela"],
    [addD(E, 49), "Binkoštna nedelja"],
    [DU(y, 6, 25), "Dan državnosti"],
    [DU(y, 8, 15), "Marijino vnebovzetje"],
    [DU(y, 10, 31), "Dan reformacije"],
    [DU(y, 11, 1), "Dan spomina na mrtve"],
    [DU(y, 12, 25), "Božič"],
    [DU(y, 12, 26), "Dan samostojnosti in enotnosti"],
  ].sort((a, b) => a[0] - b[0]);
}
const isWork = t => { const w = t.getUTCDay(); return w >= 1 && w <= 5; };
function summary(y) {
  const H = holidays(y), set = new Set(H.map(h => h[0].getTime()));
  const free = t => !isWork(t) || set.has(t.getTime());
  const bridges = [];
  H.forEach(([t]) => {
    if (!isWork(t)) return;
    const w = t.getUTCDay();
    // torek → most v ponedeljek, četrtek → most v petek
    [[2, -1], [4, 1]].forEach(([wd, dir]) => {
      if (w === wd) { const b = addD(t, dir); if (!free(b) && !bridges.some(x => x.getTime() === b.getTime())) bridges.push(b); }
    });
  });
  return { H, work: H.filter(h => isWork(h[0])).length, bridges };
}

let hY = YEAR;
function renderYear() {
  const { H, work, bridges } = summary(hY);
  $("hYear").textContent = hY;
  $("hWork").textContent = work;
  $("hBridge").textContent = bridges.length;
  const bset = new Set(bridges.map(b => b.getTime()));
  let rows = "";
  H.forEach(([t, n]) => {
    const wk = isWork(t);
    const near = [addD(t, -1), addD(t, 1)].filter(b => bset.has(b.getTime()));
    const tag = wk ? `<span class="badge" style="background:var(--sea)">prost</span>` : `<span class="badge" style="background:var(--muted)">vikend</span>`;
    rows += `<div><span class="k">${n}</span><span class="v">${fmtDM.format(t)}</span>` +
      `<span class="d">${WD[t.getUTCDay()]} ${tag}${near.length ? ` · most: ${WD[near[0].getUTCDay()]}, ${fmtDM.format(near[0])}` : ""}</span></div>`;
  });
  $("hList").innerHTML = rows;
  // premik ure
  const lastSun = (m) => { let t = DU(hY, m + 1, 0); while (t.getUTCDay() !== 0) t = addD(t, -1); return t; };
  $("hDst").innerHTML =
    `<div><span class="k">Na poletni čas</span><span class="v">${fmtDM.format(lastSun(3))} ${hY}</span><span class="d">ura ob 2.00 → 3.00, eno uro manj spanja</span></div>` +
    `<div><span class="k">Na zimski čas</span><span class="v">${fmtDM.format(lastSun(10))} ${hY}</span><span class="d">ura ob 3.00 → 2.00, eno uro več spanja</span></div>`;
  drawHChart();
}

function drawHChart() {
  const y0 = YEAR, n = 15, X0 = 26, X1 = 352, Y0 = 14, Y1 = 170, MAX = 13, bw = (X1 - X0) / n;
  const cy = v => Y1 - v / MAX * (Y1 - Y0);
  let g = "";
  [0, 5, 10].forEach(v => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(v)}" y2="${cy(v)}" stroke="var(--line)"/><text x="${X0 - 5}" y="${cy(v) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${v}</text>`;
  });
  for (let k = 0; k < n; k++) {
    const y = y0 + k, { work } = summary(y), x = X0 + k * bw;
    const sel = y === hY;
    g += `<rect x="${x + 3}" y="${cy(work)}" width="${bw - 6}" height="${Y1 - cy(work)}" rx="2" fill="${sel ? "var(--sun)" : "var(--sea)"}" fill-opacity="${sel ? 1 : 0.6}" data-y="${y}" style="cursor:pointer"/>`;
    g += `<text x="${x + bw / 2}" y="${cy(work) - 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--ink)">${work}</text>`;
    g += `<text x="${x + bw / 2}" y="${Y1 + 14}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="8.5" fill="var(--muted)" transform="rotate(-45 ${x + bw / 2} ${Y1 + 14})">${y}</text>`;
  }
  $("hChart").innerHTML = g;
  const ws = Array.from({ length: n }, (_, k) => summary(y0 + k).work);
  const mn = Math.min(...ws), mx = Math.max(...ws);
  $("hRange").textContent = `Med letoma ${y0} in ${y0 + n - 1} jih bo na delavnik padlo od ${mn} do ${mx}, največ ${mx} v letu ${y0 + ws.indexOf(mx)}.`;
  $("hChart").querySelectorAll("rect[data-y]").forEach(r => r.addEventListener("click", () => { hY = +r.dataset.y; renderYear(); }));
}

$("hPrev").addEventListener("click", () => { hY--; renderYear(); });
$("hNext").addEventListener("click", () => { hY++; renderYear(); });
renderYear();
