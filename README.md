# We can do it

Private daily wellness app: diary, 30-day game mode, recipes. Runs fully on-device (no accounts, no servers). Built for iPhone, installable as a PWA.

## Structure
```
.github/workflows/pages.yml   auto-deploy on push to main
public/                       the site (served as-is)
  index.html  manifest.webmanifest  sw.js  icon.svg  icon-180.png
  css/style.css
  js/store.js      storage + validation
  js/security.js   escaping, PIN (PBKDF2), photo + import checks
  js/game.js       30-day road map, rewards, XP
  js/app.js        views + events
SECURITY.md
```

## Deploy
1. Push to a GitHub repo, branch `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Open the URL on iPhone in Safari → Share → **Add to Home Screen**.

## Game mode
30 days from the day you press Start. A day is complete when all 4 goals are done (6,000 steps, 6 glasses of water, 2 meals logged, one small win written). Each complete day = ⭐ + that day's reward + 100 XP; streak adds 10 XP/day. Badges at 7 / 14 / 21 / 28 stars. At day 31 the month-end card appears: export a backup, import one, or start a new month.

## Backup
Safe tab (or month-end card) → Export / Import JSON. Imports are validated and never overwrite your PIN.
