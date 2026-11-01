// ---------- Mrki ----------
function drawEcl() {
  const T = (x, y, s, sz = 12, w = 600, f = "#E9ECF3", a = "middle") => `<text x="${x}" y="${y}" text-anchor="${a}" font-family="Sora, sans-serif" font-size="${sz}" font-weight="${w}" fill="${f}">${s}</text>`;
  let g = "";
  // Sončev mrk
  g += T(16, 24, "Sončev mrk · ob mlaju", 12.5, 600, "#E9ECF3", "start");
  g += `<circle cx="34" cy="75" r="30" fill="#F2B33D"/>`;
  g += `<path d="M190,67 L300,73 L300,77 L190,83 Z" fill="#0B1020" stroke="#56607A" stroke-width="0.6"/>`;
  g += `<path d="M64,75 L190,67 M64,75 L190,83" stroke="#F2B33D" stroke-opacity="0.35" stroke-width="1"/>`;
  g += `<circle cx="190" cy="75" r="8" fill="#46506A"/>`;
  g += `<circle cx="318" cy="75" r="24" fill="#3D7DC4"/>`;
  g += `<circle cx="295" cy="75" r="3" fill="#0B1020" stroke="#F2B33D" stroke-width="1"/>`;
  g += T(34, 122, "Sonce", 10.5, 500, "#A9B1C4") + T(190, 104, "Luna", 10.5, 500, "#A9B1C4") + T(318, 116, "Zemlja", 10.5, 500, "#A9B1C4");
  g += `<text x="262" y="58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">senca</text>`;
  // Lunin mrk
  const y2 = 200;
  g += T(16, 152, "Lunin mrk · ob ščipu", 12.5, 600, "#E9ECF3", "start");
  g += `<circle cx="34" cy="${y2}" r="30" fill="#F2B33D"/>`;
  g += `<path d="M190,${y2 - 22} L330,${y2 - 12} L330,${y2 + 12} L190,${y2 + 22} Z" fill="#05070F" stroke="#56607A" stroke-width="0.6"/>`;
  g += `<circle cx="190" cy="${y2}" r="22" fill="#3D7DC4"/>`;
  g += `<path d="M190,${y2 - 22} A22,22 0 0,1 190,${y2 + 22} Z" fill="#0B1020" opacity="0.55"/>`;
  g += `<circle cx="305" cy="${y2}" r="8" fill="#A6472E"/>`;
  g += T(34, y2 + 46, "Sonce", 10.5, 500, "#A9B1C4") + T(190, y2 + 40, "Zemlja", 10.5, 500, "#A9B1C4") + T(305, y2 + 28, "Luna", 10.5, 500, "#A9B1C4");
  g += `<text x="262" y="${y2 - 24}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="#A9B1C4">Zemljina senca</text>`;
  g += `<text x="350" y="262" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" fill="#7D869B">razmerja niso v merilu</text>`;
  $("ecl").innerHTML = g;
}

function syzygies(days) {
  const out = [], now = Date.now();
  let t = now - 2 * 86400000;
  while (t < now + days * 86400000) {
    const nm = nextElong(t, 0), fm = nextElong(t, 180);
    const n = Math.min(nm ?? Infinity, fm ?? Infinity);
    if (!isFinite(n)) break;
    out.push({ t: n, full: n === fm, lat: moonLatAt(n) });
    t = n + 3 * 86400000;
  }
  return out.filter(o => o.t >= now - 86400000);
}

function drawEclChart() {
  const S = syzygies(380), BAND = 1.5;
  const t0 = S[0].t, t1 = S[S.length - 1].t;
  const X0 = 30, X1 = 350, Y0 = 18, Y1 = 196, L = 5.6;
  const cx = t => X0 + (t - t0) / (t1 - t0) * (X1 - X0), cy = b => (Y0 + Y1) / 2 - b / L * (Y1 - Y0) / 2;
  let g = `<rect x="${X0}" y="${cy(BAND)}" width="${X1 - X0}" height="${cy(-BAND) - cy(BAND)}" fill="var(--sun)" fill-opacity="0.16"/>`;
  [-5, 0, 5].forEach(b => {
    g += `<line x1="${X0}" x2="${X1}" y1="${cy(b)}" y2="${cy(b)}" stroke="var(--line)" ${b === 0 ? 'stroke-width="1.5"' : ""}/>` +
      `<text x="${X0 - 5}" y="${cy(b) + 3.5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--muted)">${b > 0 ? "+" : ""}${b}°</text>`;
  });
  g += `<text x="${X1 - 4}" y="${cy(BAND) - 5}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9.5" fill="var(--sun)">pas mrkov</text>`;
  const fm = new Intl.DateTimeFormat("sl-SI", { timeZone: TZ, month: "short" });
  let lastM = "";
  S.forEach(o => {
    const m = fm.format(new Date(o.t));
    if (m !== lastM) {
      g += `<text x="${cx(o.t)}" y="${Y1 + 22}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--muted)">${m.replace(".", "")}</text>`;
      lastM = m;
    }
  });
  S.forEach(o => {
    const inb = Math.abs(o.lat) < BAND;
    g += `<circle cx="${cx(o.t)}" cy="${cy(o.lat)}" r="${inb ? 6.5 : 4.5}" fill="${o.full ? "var(--moon-lit)" : "var(--moon-dark)"}" stroke="${inb ? "var(--sun)" : "var(--muted)"}" stroke-width="${inb ? 2.5 : 1}"/>`;
  });
  $("eclChart").innerHTML = g;
  const rows = S.filter(o => Math.abs(o.lat) < BAND).map(o =>
    `<div><span class="k">${fmtDateY.format(new Date(o.t))}</span><span class="v">${o.full ? "Lunin" : "Sončev"} mrk mogoč</span></div>`).join("");
  $("eclList").innerHTML = rows || `<div><span class="k">V naslednjem letu ni mrkov.</span></div>`;
}

drawEcl();
drawEclChart();
