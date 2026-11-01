# Infografike

Zbirka knjižic z infografikami (Pojavi v naravi; Čas in koledar), objavljena na pikapoka.com/infografike.

- `src/pages/` – vsebina poglavij (`*.html`) in njihovi skripti (`*.js`)
- `src/build.py` – sestavi spletne strani v mapo `site/`
- `.github/workflows/objavi.yml` – ob vsaki spremembi na veji `main` sestavi strani in jih naloži prek SFTP

Potrebne skrivnosti (Settings → Secrets and variables → Actions):
`FTP_SERVER` (strežnik), `FTP_USERNAME`, `FTP_PASSWORD`. Ciljna mapa `pikapoka.com/www/infografike` je nastavljena v `objavi.yml`.
