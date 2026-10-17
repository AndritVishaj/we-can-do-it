# Security

**Model:** all data stays in this browser's localStorage. No network calls, no third-party scripts, no fonts or analytics.

**Controls**
- Strict Content-Security-Policy (`script-src 'self'`, no inline script/style, `form-action 'none'`, `base-uri 'none'`).
- All user text is HTML-escaped on output and stripped/clamped on every save and load (`sanitize`).
- Optional PIN: PBKDF2-SHA-256, 150k iterations, random salt; only the hash is stored. 5 wrong tries trigger an increasing lockout. Auto-locks after 30 s in background.
- Imports: max 3 MB, JSON only, schema-validated, cannot set or replace the PIN.
- Photos: re-encoded to a small JPEG in a canvas (strips EXIF/location), validated by data-URI pattern.
- Service worker caches same-origin GET only.

**Limits:** localStorage is not encrypted; the PIN is an app lock, not disk encryption. Anyone with unlocked device + browser tools can read data. Use iOS passcode.

**Report issues:** open a private GitHub security advisory on the repo.
