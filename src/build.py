"""Sestavi knjižico: site/ (za spletno stran) in artifact/ (index brez ogrodja)."""
import os, shutil, json

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "..", "site")
ART = os.path.join(SRC, "..", "artifact")

SITE = "Infografike"
GROUPS = [
    ("narava", "Pojavi v naravi", "Luna, Sonce, letni časi, mrki, plimovanje in vreme s številkami za Slovenijo."),
    ("cas", "Čas in koledar", "Kako merimo čas: koledar, prazniki in prosti dnevi."),
]
CHAPTERS = [
    ("luna", "Luna", "Mene, vzhod in zahod ter smer, v kateri Luna vzide.", True, "narava"),
    ("sonce", "Sonce", "Pot Sonca po nebu in dolžina dneva skozi leto.", True, "narava"),
    ("letni-casi", "Letni časi", "Zakaj je poleti toplo in zakaj je najtopleje šele julija.", False, "narava"),
    ("somrak", "Somrak", "Civilni, navtični in astronomski somrak ter kdaj se zares stemni.", True, "narava"),
    ("mrki", "Mrki", "Kako nastaneta Sončev in Lunin mrk in zakaj nista vsak mesec.", True, "narava"),
    ("plima", "Plima in oseka", "Zakaj morje dvakrat na dan naraste in kdaj najbolj.", True, "narava"),
    ("vreme", "Vreme", "Temperatura zraka in morja ter padavine po Sloveniji.", True, "narava"),
    ("koledar", "Koledar", "Prestopna leta, Luna v koledarju in datum velike noči.", True, "cas"),
    ("prazniki", "Prazniki in prosti dnevi", "Dela prosti dnevi po letih, mostovi in premik ure.", True, "cas"),
]
PLANNED = {"cas": [("Horoskop", "Zakaj znamenja ne ustrezajo več ozvezdjem.")]}
LEDE = {
    "luna": "Kako se Luna spreminja skozi mesec, kdaj vzide in kje jo iskati na nebu.",
    "sonce": "Sonce vsak dan opiše lok čez nebo. Skozi leto se ta lok premika in z njim dolžina dneva.",
    "letni-casi": "Letne čase povzroča nagib Zemljine osi, ne oddaljenost od Sonca.",
    "somrak": "Po sončnem zahodu je še nekaj časa svetlo. Koliko, je odvisno od letnega časa.",
    "mrki": "Mrk nastane, ko se Sonce, Zemlja in Luna postavijo v ravno črto.",
    "plima": "Plimovanje poganjata Luna in Sonce. Na naši obali je morje ob plimi do enega metra višje kot ob oseki.",
    "vreme": "Kako se temperatura in padavine spreminjajo skozi leto, od Bovca do Murske Sobote.",
    "prazniki": "Koliko prostih dni nas čaka letos in v prihodnjih letih ter kje se splača vzeti dan dopusta.",
    "koledar": "Koledar je poskus, da bi dneve, mesece in leta spravili v red, čeprav se ne izidejo.",
}

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700'
         '&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap">')


def read(p):
    return open(os.path.join(SRC, p), encoding="utf-8").read()


def head(title, full):
    meta = ('<!doctype html>\n<html lang="sl">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n') if full else ""
    return (meta + f"<title>{title}</title>\n"
            '<meta name="claude:viewport-fit-sides" content="cover">\n'
            f"{FONTS}\n<link rel=\"stylesheet\" href=\"style.css\">\n" + ("</head>\n<body>\n" if full else ""))


def chapter_page(i):
    slug, name, desc, inter, grp = CHAPTERS[i]
    gname = dict((g[0], g[1]) for g in GROUPS)[grp]
    same = [c for c in CHAPTERS if c[4] == grp]
    j = same.index(CHAPTERS[i])
    body = read(f"pages/{slug}.html")
    prev = same[j - 1] if j > 0 else None
    nxt = same[j + 1] if j < len(same) - 1 else None
    pager = '<nav class="pager" aria-label="Poglavja">'
    if prev:
        pager += f'<a href="{prev[0]}.html"><span class="dir">← Prejšnje</span><span class="t">{prev[1]}</span></a>'
    if nxt:
        pager += f'<a class="next" href="{nxt[0]}.html"><span class="dir">Naslednje →</span><span class="t">{nxt[1]}</span></a>'
    pager += "</nav>"
    html = head(f"{name} · {gname}", True)
    html += f'''<div class="wrap">
  <header class="pagehead">
    <a class="back" href="index.html">← {SITE}</a>
    <div class="eyebrow">{gname} · poglavje {j + 1}</div>
    <h1>{name}</h1>
    <p class="muted">{LEDE[slug]}</p>
  </header>
  <article id="{slug}" class="stack-lg">
{body}
  </article>
  {pager}
</div>
<script src="astro.js"></script>
<script src="common.js"></script>
<script src="{slug}.js"></script>
</body>
</html>
'''
    return html


def index_page(full):
    html = head(SITE, full)
    body = read("pages/index.html")
    groups = ""
    for gid, gname, gdesc in GROUPS:
        cards = ""
        same = [c for c in CHAPTERS if c[4] == gid]
        for j, (slug, name, desc, inter, grp) in enumerate(same):
            tag = '<span class="tag">interaktivno</span>' if inter else ""
            cards += (f'<a class="card" href="{slug}.html"><svg viewBox="0 0 64 64" aria-hidden="true" data-icon="{slug}"></svg>'
                      f'<span class="ct"><span class="n">Poglavje {j + 1}</span><h2>{name}{tag}</h2><p>{desc}</p></span></a>\n')
        for name, desc in PLANNED.get(gid, []):
            cards += (f'<div class="card soon"><svg viewBox="0 0 64 64" aria-hidden="true" data-icon="soon"></svg>'
                      f'<span class="ct"><span class="n">V pripravi</span><h2>{name}</h2><p>{desc}</p></span></div>\n')
        groups += (f'<section class="group" id="{gid}"><div class="grouphead"><h2>{gname}</h2><p class="muted">{gdesc}</p></div>'
                   f'<nav class="cards" aria-label="{gname}">\n{cards}</nav></section>\n')
    body = body.replace("%%CARDS%%", groups)
    html += body + '\n<script src="astro.js"></script>\n<script src="common.js"></script>\n<script src="index.js"></script>\n'
    if full:
        html += "</body>\n</html>\n"
    return html


def build():
    for d in (OUT, ART):
        shutil.rmtree(d, ignore_errors=True)
        os.makedirs(d)
    assets = ["style.css", "astro.js", "common.js", "index.js"] + [f"{c[0]}.js" for c in CHAPTERS]
    for d in (OUT, ART):
        for a in assets:
            src = os.path.join(SRC, a) if os.path.exists(os.path.join(SRC, a)) else os.path.join(SRC, "pages", a)
            shutil.copy(src, os.path.join(d, a))
        for i in range(len(CHAPTERS)):
            open(os.path.join(d, CHAPTERS[i][0] + ".html"), "w", encoding="utf-8").write(chapter_page(i))
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(index_page(True))
    open(os.path.join(ART, "index.html"), "w", encoding="utf-8").write(index_page(False))
    files = {a: a for a in assets}
    files.update({c[0] + ".html": c[0] + ".html" for c in CHAPTERS})
    json.dump(files, open(os.path.join(ART, "files.json"), "w"), indent=1)


if __name__ == "__main__":
    build()
    print("ok")
