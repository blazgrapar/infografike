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
const [y, mo, d] = todayLocal(), st = localMidnight(y, mo, d);
const el = moonAt(Date.now()).elong, sE = events(sunAt, st), mE = events(moonAt, st);
$("iDate").textContent = fmtDayLong.format(new Date());
$("iMoon").innerHTML = moonSVG(100, el);
$("iPhase").textContent = phaseName(el);
$("iPhaseSub").textContent = `osvetljena ${Math.round(illum(el) * 100)} %`;
$("iSun").textContent = `${hm(sE.rise.t)}–${hm(sE.set.t)}`;
$("iSunD").textContent = `dan traja ${durTxt((sE.set.t - sE.rise.t) / 60000)}`;
const mr = mE.rise ? `vzide ${hm(mE.rise.t)}` : "", ms = mE.set ? `zaide ${hm(mE.set.t)}` : "";
$("iMoonT").textContent = mE.rise ? hm(mE.rise.t) : "—";
$("iMoonD").textContent = (mE.rise ? "vzide" : "ta dan ne vzide") + (ms ? " · " + ms : "");
