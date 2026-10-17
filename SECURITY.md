# Security

## Data handling

The app stores diary entries, meal photos, measurements, and local feed posts in the browser's `localStorage`. Data remains on that browser and device; this version has no server-side account, Supabase sync, or cross-user sharing. Anyone with access to the same unlocked browser profile may be able to view its local data.

Avoid entering sensitive medical information. Use a private device profile, and clear the app's site data if you want to remove saved entries.

## Deployment

GitHub Pages publishes the static app files publicly. Publishing the app does not publish a visitor's browser-local diary entries. Do not add passwords, API secrets, or privileged Supabase keys to `index.html` or any other client-side file.

## Reporting a vulnerability

Please do not post exploitable security issues in a public GitHub issue. Contact the repository owner privately with the affected page, reproduction steps, and impact. No dedicated response SLA is provided.
