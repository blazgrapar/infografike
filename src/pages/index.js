// ---------- Naslovnica ----------
function icon(slug) {
  const bg = `<rect width="64" height="64" rx="12" fill="#1C2436"/>`;
  const sun = "#F2B33D", moonL = "#F3EFE2", moonD = "#46506A", sea = "#2A9D8F", blue = "#3D7DC4";
  switch (slug) {
    case "luna": return bg + `<g transform="translate(32,32)"><circle r="17" fill="${moonD}"/><path d="${phasePath(17, 120)}" fill="${moonL}"/></g>`;
    case "sonce": {
      let r = ""; for (let k = 0; k < 8; k++) { const a = k * 45 * Math.PI / 180; r += `<line x1="${32 + 14 * Math.cos(a)}" y1="${30 + 14 * Math.sin(a)}" x2="${32 + 20 * Math.cos(a)}" y2="${30 + 20 * Math.sin(a)}" stroke="${sun}" stroke-width="2.5" stroke-linecap="round"/>`; }
      return bg + `<circle cx="32" cy="30" r="9" fill="${sun}"/>` + r + `<line x1="8" x2="56" y1="56" y2="56" stroke="#A9B1C4" stroke-width="1.5"/>`;
    }
    case "letni-casi": return bg + `<g transform="translate(32,32) rotate(23.4)"><circle r="17" fill="${blue}"/><path d="M0,-17 A17,17 0 0,0 0,17 Z" fill="#0B1020" opacity="0.5"/><line x1="0" y1="-25" x2="0" y2="25" stroke="#E9ECF3" stroke-width="1.5"/></g>`;
    case "somrak": return `<defs><clipPath id="cS"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#cS)"><rect width="64" height="64" fill="#10142A"/><rect y="0" width="64" height="18" fill="#8EC3E6"/><rect y="18" width="64" height="12" fill="#E9A86A"/><rect y="30" width="64" height="12" fill="#5E6FA8"/><rect y="42" width="64" height="12" fill="#2E3766"/><circle cx="44" cy="25" r="5" fill="${sun}"/></g>`;
    case "mrki": return bg + `<circle cx="32" cy="32" r="16" fill="${sun}"/><circle cx="38" cy="29" r="15" fill="#0B1020"/>`;
    case "plima": return bg + `<path d="M6,30 Q16,22 26,30 T46,30 T66,30" fill="none" stroke="${sea}" stroke-width="3"/><path d="M6,42 Q16,34 26,42 T46,42 T66,42" fill="none" stroke="${sea}" stroke-opacity="0.55" stroke-width="3"/><circle cx="48" cy="14" r="5" fill="${moonL}"/>`;
    case "vreme": return bg + `<rect x="18" y="12" width="8" height="30" rx="4" fill="none" stroke="#E9ECF3" stroke-width="2"/><circle cx="22" cy="46" r="7" fill="#E07A5F"/><rect x="20" y="26" width="4" height="18" fill="#E07A5F"/><path d="M44,18 C44,18 36,30 36,35 a8,8 0 0,0 16,0 C52,30 44,18 44,18 Z" fill="#6FA8DC"/>`;
    case "koledar": {
      let c = `<rect x="12" y="14" width="40" height="38" rx="5" fill="#E9ECF3"/><rect x="12" y="14" width="40" height="10" rx="5" fill="#E07A5F"/><rect x="12" y="20" width="40" height="4" fill="#E07A5F"/>`;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) c += `<rect x="${16 + k * 9}" y="${28 + r * 7.5}" width="6" height="5" rx="1" fill="${r === 2 && k === 1 ? sun : "#A9B1C4"}"/>`;
      return bg + c;
    }
    case "soon": return bg + `<circle cx="32" cy="32" r="16" fill="none" stroke="#A9B1C4" stroke-width="2" stroke-dasharray="3 4"/><circle cx="24" cy="26" r="1.6" fill="#F2B33D"/><circle cx="36" cy="22" r="1.6" fill="#F2B33D"/><circle cx="40" cy="36" r="1.6" fill="#F2B33D"/><circle cx="28" cy="40" r="1.6" fill="#F2B33D"/><path d="M24,26 L36,22 L40,36 L28,40" fill="none" stroke="#F2B33D" stroke-opacity="0.6"/>`;
    case "nocno-nebo": {
      const st = [[14,18],[22,12],[30,20],[40,14],[48,22],[44,34],[34,30]];
      let c = st.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#E9ECF3"/>`).join("");
      return bg + c + `<circle cx="22" cy="44" r="5" fill="#F2D7A0"/><ellipse cx="22" cy="44" rx="9" ry="2.4" fill="none" stroke="#E8D28A" stroke-width="1.2"/><line x1="40" y1="44" x2="54" y2="52" stroke="#F2B33D" stroke-width="1.5" stroke-linecap="round"/>`;
    }
    case "ura": return bg + `<circle cx="32" cy="32" r="18" fill="none" stroke="#E9ECF3" stroke-width="2"/><line x1="32" y1="32" x2="32" y2="19" stroke="#E9ECF3" stroke-width="2.5" stroke-linecap="round"/><line x1="32" y1="32" x2="41" y2="36" stroke="#F2B33D" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="32" r="2" fill="#E9ECF3"/>`;
    case "svet": return bg + `<circle cx="32" cy="32" r="18" fill="#3D7DC4"/><path d="M20,24 q6,-4 10,2 t8,6 q-4,6 -10,4 z M36,40 q4,-4 8,0 q-2,6 -8,4 z" fill="#2A9D8F"/>` +
      [[18, 52], [26, 54], [34, 52], [42, 54], [50, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y - 4}" r="2" fill="#E9ECF3"/><rect x="${x - 2}" y="${y - 1.5}" width="4" height="5" rx="1.5" fill="#E9ECF3"/>`).join("");
    case "slovenija": return bg + [8, 12, 15, 17, 22, 28, 34, 38, 40].map((h, k) => `<rect x="${12 + k * 4.6}" y="${50 - h}" width="3.2" height="${h}" rx="1" fill="${k === 8 ? "#F2B33D" : "#2A9D8F"}"/>`).join("");
    case "sto": {
      let c = "";
      for (let k = 0; k < 25; k++) { const x = 13 + (k % 5) * 9.5, y = 13 + Math.floor(k / 5) * 9.5; c += `<circle cx="${x}" cy="${y}" r="3.2" fill="${k < 5 ? "#F2B33D" : k < 9 ? "#2A9D8F" : "#A9B1C4"}"/>`; }
      return bg + c;
    }
    case "imena": return bg + `<rect x="10" y="18" width="44" height="28" rx="5" fill="#E9ECF3"/><rect x="10" y="18" width="44" height="9" rx="4" fill="#E07A5F"/><rect x="10" y="23" width="44" height="4" fill="#E07A5F"/><text x="32" y="41" text-anchor="middle" font-family="Sora, sans-serif" font-size="11" font-weight="700" fill="#1C2436">Ime</text>`;
    case "horoskop": {
      let c = `<circle cx="32" cy="32" r="21" fill="none" stroke="#A9B1C4" stroke-width="1.5"/><circle cx="32" cy="32" r="13" fill="none" stroke="#2A9D8F" stroke-width="1.5"/>`;
      for (let k = 0; k < 12; k++) { const a = k * 30 * Math.PI / 180; c += `<line x1="${32 + 13 * Math.cos(a)}" y1="${32 + 13 * Math.sin(a)}" x2="${32 + 21 * Math.cos(a)}" y2="${32 + 21 * Math.sin(a)}" stroke="#A9B1C4"/>`; }
      return bg + c + `<circle cx="32" cy="32" r="6" fill="${sun}"/>`;
    }
    case "prazniki": {
      let c = `<rect x="12" y="14" width="40" height="38" rx="5" fill="#E9ECF3"/><rect x="12" y="14" width="40" height="10" rx="5" fill="#2A9D8F"/><rect x="12" y="20" width="40" height="4" fill="#2A9D8F"/>`;
      for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) c += `<rect x="${15 + k * 7.4}" y="${28 + r * 7.5}" width="5" height="5" rx="1" fill="${k >= 3 ? "#E07A5F" : (r === 1 && k === 1 ? "#F2B33D" : "#A9B1C4")}"/>`;
      return bg + c;
    }
  }
  return bg;
}
document.querySelectorAll("svg[data-icon]").forEach(s => { s.innerHTML = icon(s.dataset.icon); });

// danes
const now = Date.now(), [y, mo, d] = todayLocal(), st = localMidnight(y, mo, d);
const el = moonAt(now).elong, sE = events(sunAt, st);
$("iDate").textContent = fmtDayLong.format(new Date());
$("iMoon").innerHTML = moonSVG(100, el);
$("iPhase").textContent = phaseName(el);
$("iSun").textContent = `osvetljena ${Math.round(illum(el) * 100)} % · Sonce ${hm(sE.rise.t)}–${hm(sE.set.t)}`;

const W0 = Date.UTC(2024, 6, 1), P0 = 8.161e9, RATE = 69.5e6 / (365.25 * 86400000);
const tickPop = () => { $("iPop").textContent = Math.round(P0 + (Date.now() - W0) * RATE).toLocaleString("sl-SI"); };
tickPop(); setInterval(tickPop, 250);

// koledar: dan v letu, teden, naslednji dela prost dan
function easterG(Y) {
  const a = Y % 19, b = Math.floor(Y / 100), c = Y % 100, dd = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return Date.UTC(Y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1);
}
function freeDays(Y) {
  const E = easterG(Y), DAY = 86400000;
  return [[Date.UTC(Y, 0, 1), "novo leto"], [Date.UTC(Y, 0, 2), "novo leto"], [Date.UTC(Y, 1, 8), "Prešernov dan"],
    [E + DAY, "velikonočni ponedeljek"], [Date.UTC(Y, 3, 27), "dan upora proti okupatorju"], [Date.UTC(Y, 4, 1), "praznik dela"],
    [Date.UTC(Y, 4, 2), "praznik dela"], [Date.UTC(Y, 5, 25), "dan državnosti"], [Date.UTC(Y, 7, 15), "Marijino vnebovzetje"],
    [Date.UTC(Y, 9, 31), "dan reformacije"], [Date.UTC(Y, 10, 1), "dan spomina na mrtve"], [Date.UTC(Y, 11, 25), "božič"],
    [Date.UTC(Y, 11, 26), "dan samostojnosti in enotnosti"]];
}
const today = Date.UTC(y, mo - 1, d), doyN = doy(mo, d, y) + 1;
const tmp = new Date(today); tmp.setUTCDate(tmp.getUTCDate() - ((tmp.getUTCDay() + 6) % 7) + 3);
const thu1 = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 4));
const week = 1 + Math.round(((tmp - thu1) / 86400000 - 3 + ((thu1.getUTCDay() + 6) % 7)) / 7);
$("iDoy").textContent = `${doyN}. dan v letu · ${week}. teden`;
const nxt = freeDays(y).concat(freeDays(y + 1)).find(([t]) => t > today);
const days = Math.round((nxt[0] - today) / 86400000);
$("iHol").textContent = `Naslednji dela prost dan: ${fmtDate.format(new Date(nxt[0]))}, ${nxt[1]}, čez ${days} ${days === 1 ? "dan" : days === 2 ? "dneva" : days < 5 ? "dnevi" : "dni"}`;
