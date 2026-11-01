// diagram men
function drawOrbit(todayEl) {
  const RO = 76, RV = 138;
  let g = "";
  // sončni žarki
  for (let y = -150; y <= 150; y += 30) {
    g += `<line x1="190" y1="${y}" x2="172" y2="${y}" stroke="var(--night-sun)" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M168,${y} l6,-4 l0,8 Z" fill="var(--night-sun)"/>`;
  }
  g += `<text x="190" y="-160" text-anchor="end" font-family="Sora, sans-serif" font-size="12" font-weight="600" fill="var(--night-sun)">Sonce</text>`;
  g += `<circle r="${RO}" fill="none" stroke="#56607A" stroke-width="1" stroke-dasharray="3 4"/>`;
  // smer gibanja
  const aa = 112 * R, ax = RO * Math.cos(aa), ay = -RO * Math.sin(aa), tx = -Math.sin(aa), ty = -Math.cos(aa);
  g += `<path d="M${ax + tx * 7},${ay + ty * 7} L${ax - tx * 2 - ty * 4.5},${ay - ty * 2 + tx * 4.5} L${ax - tx * 2 + ty * 4.5},${ay - ty * 2 - tx * 4.5} Z" fill="#8A93A8"/>`;
  // Zemlja
  g += `<circle r="15" fill="#3D7DC4"/><path d="M0,-15 A15,15 0 0,0 0,15 Z" fill="#0B1020" opacity="0.55"/>`;
  PHASES.forEach(([th], i) => {
    const r = th * R, c = Math.cos(r), s = -Math.sin(r);
    const ox = RO * c, oy = RO * s, vx = RV * c, vy = RV * s;
    g += `<line x1="${(RO + 12) * c}" y1="${(RO + 12) * s}" x2="${(RV - 24) * c}" y2="${(RV - 24) * s}" stroke="#3E4862" stroke-width="1"/>`;
    g += `<circle cx="${ox}" cy="${oy}" r="9" fill="var(--moon-dark)"/><path d="M${ox},${oy - 9} A9,9 0 0,1 ${ox},${oy + 9} Z" fill="var(--moon-lit)"/>`;
    g += `<circle class="hl" data-i="${i}" cx="${vx}" cy="${vy}" r="25" fill="none" stroke="var(--night-sun)" stroke-width="2" opacity="0"/>`;
    g += moonSVG(19, th, vx, vy);
  });
  // danes
  const tr = todayEl * R, tx2 = RO * Math.cos(tr), ty2 = -RO * Math.sin(tr);
  g += `<circle cx="${tx2}" cy="${ty2}" r="13" fill="none" stroke="var(--night-sun)" stroke-width="2"/>`;
  const lx = (RO - 28) * Math.cos(tr), ly = -(RO - 28) * Math.sin(tr);
  g += `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10" fill="var(--night-sun)">danes</text>`;
  document.getElementById("orbit").innerHTML = g;
}

function highlight(i) {
  document.querySelectorAll("#orbit .hl").forEach(c => c.setAttribute("opacity", +c.dataset.i === i ? 1 : 0));
  document.querySelectorAll("#phaseList li").forEach(li => li.classList.toggle("on", +li.dataset.i === i));
}

function buildPhaseList(todayIdx) {
  const ul = document.getElementById("phaseList");
  ul.innerHTML = PHASES.map(([th, n, r, s, vis], i) =>
    `<li tabindex="0" data-i="${i}"><svg viewBox="-21 -21 42 42" aria-hidden="true">${moonSVG(19, th)}</svg>` +
    `<span class="pname">${n}${i === todayIdx ? ' <span class="badge">danes</span>' : ""}<span class="ptimes">vzhod ~${r} · zahod ~${s}</span></span>` +
    `<span class="pvis">${vis}</span></li>`).join("");
  ul.querySelectorAll("li").forEach(li => {
    const go = () => highlight(+li.dataset.i);
    li.addEventListener("click", go);
    li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
}

function drawCompass(m, s) {
  const R0 = 110;
  const pt = (az, rr) => [rr * sind(az), -rr * cosd(az)];
  let g = `<circle r="${R0}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
  for (let az = 0; az < 360; az += 22.5) {
    const major = az % 90 === 0;
    const [x1, y1] = pt(az, R0 - (major ? 10 : 5)), [x2, y2] = pt(az, R0);
    g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="${major ? 1.5 : 1}"/>`;
  }
  [["S", 0], ["V", 90], ["J", 180], ["Z", 270]].forEach(([t, az]) => {
    const [x, y] = pt(az, R0 + 20);
    g += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Sora, sans-serif" font-size="17" font-weight="600" fill="var(--ink)">${t}</text>`;
  });
  const ray = (ev, color, dash, label) => {
    if (!ev) return "";
    const [x, y] = pt(ev.az, R0 - 2), [lx, ly] = pt(ev.az, R0 - 30);
    return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${color}" stroke-width="3" stroke-linecap="round" ${dash ? 'stroke-dasharray="5 5"' : ""}/>` +
      `<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>` +
      (label ? `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="12" fill="var(--muted)">${label}</text>` : "");
  };
  g += ray(s.rise, "var(--sun)", true, "") + ray(s.set, "var(--sun)", true, "");
  g += ray(m.rise, "var(--moon-dark)", false, "vzhod") + ray(m.set, "var(--moon-dark)", false, "zahod");
  g += `<circle r="5" fill="var(--ink)"/>`;
  document.getElementById("compass").innerHTML = g;
}

// ---------- Orodje ----------
function render(a) {
  const [y, mo, d] = a;
  const start = localMidnight(y, mo, d);
  const m = events(moonAt, start), s = events(sunAt, start);
  const el = moonAt(start + 12 * 3600000).elong;
  const age = el / 360 * 29.53;

  $("bigmoon").innerHTML = moonSVG(100, el);
  $("phaseName").textContent = phaseName(el);
  $("phaseSub").textContent = `osvetljena ${Math.round(illum(el) * 100)} % · ${age.toFixed(1).replace(".", ",")} dni po mlaju`;

  $("riseT").textContent = m.rise ? hm(m.rise.t) : "—";
  $("riseD").innerHTML = m.rise ? dirText(m.rise.az) : "ta dan ne vzide";
  $("setT").textContent = m.set ? hm(m.set.t) : "—";
  $("setD").innerHTML = m.set ? dirText(m.set.az) : "ta dan ne zaide";
  $("transT").textContent = m.top ? hm(m.top.t) : "—";
  $("transD").innerHTML = m.top ? `<b>${Math.round(m.top.alt)}°</b> nad obzorjem, na jugu`
    : (m.rise || m.set ? "najvišjo točko doseže okoli polnoči" : "ta dan ni nad obzorjem");

  drawCompass(m, s);

  let rows = "";
  for (let k = 0; k < 7; k++) {
    const st = localMidnight(y, mo, d + k);
    const ev = events(moonAt, st), e2 = moonAt(st + 12 * 3600000).elong;
    const cell = x => x ? `${hm(x.t)}<span class="dir">${dir16(x.az)}</span>` : "—";
    rows += `<tr class="click${k === 0 ? " sel" : ""}" data-k="${k}">` +
      `<td><svg class="mini" viewBox="-12 -12 24 24" aria-hidden="true">${moonSVG(11, e2, 0, 0, false)}</svg></td>` +
      `<td>${fmtDay.format(new Date(st + 12 * 3600000))}</td>` +
      `<td class="num">${cell(ev.rise)}</td><td class="num">${cell(ev.set)}</td>` +
      `<td class="num">${Math.round(illum(e2) * 100)} %</td></tr>`;
  }
  $("week").innerHTML = rows;
  $("week").querySelectorAll("tr").forEach(tr => tr.addEventListener("click", () => picker.set(shiftDay(a, +tr.dataset.k))));
}


const nowEl = moonAt(Date.now()).elong;
drawOrbit(nowEl);
buildPhaseList(phaseIndex(nowEl));
highlight(phaseIndex(nowEl));
const picker = dayPicker("m", render);
