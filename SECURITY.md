# Security

**Model:** all data stays in this browser's localStorage. No network calls, no third-party scripts, fonts or analytics.

**Controls**
- Strict Content-Security-Policy (`script-src 'self'`, no inline script/style, `form-action 'none'`, `base-uri 'none'`).
- All user text is HTML-escaped on output and stripped/clamped on every save and load (`sanitize` in `store.js`).
- Imports: max 3 MB, JSON or CSV only, schema-validated, CSV dates checked (no prototype pollution), formula characters neutralised on CSV export.
- Photos: re-encoded to a small JPEG in a canvas (strips EXIF/location) and validated by data-URI pattern.
- Service worker caches same-origin GET only.

**Limits:** localStorage is not encrypted. Anyone with access to the unlocked phone/browser can read the data, so rely on the iOS passcode. Use Export backup regularly: clearing Safari data erases the app's data.

**Report issues:** open a private GitHub security advisory on the repo.
