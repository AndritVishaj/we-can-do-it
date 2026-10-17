# We can do it

A single-file, mobile-friendly daily wellness tracker. `index.html` includes the layout, styles, and app logic; no build step or package install is needed.

## Run it

Open `index.html` in a modern browser. For a local server, run this from the project folder:

```powershell
python -m http.server 8765
```

Then open `http://localhost:8765`.

## Features

- Daily meals, calories, and optional food photos
- Water, steps, weight, waist measurement, and personal note
- Weekly activity summary
- Recipe cards
- A personal, opt-in community-style feed
- Responsive desktop sidebar and mobile drawer with bottom navigation

The mobile menu closes with its close button, an outside tap, Escape, or after choosing a page.

## Data and privacy

This single-file edition saves information in the browser's local storage on the current device. It does not connect to Supabase, upload data, or share posts with other people. The community feed is local to this browser. Do not use it for sensitive health information on a shared device.

## GitHub Pages

1. Create a GitHub repository and add `index.html`, this README, `SECURITY.md`, and `.gitignore`.
2. Push the files to the `main` branch.
3. Open **Settings → Pages** and choose **GitHub Actions** as the deployment source.
4. The workflow in `.github/workflows/pages.yml` deploys the static app after each push to `main`.

Because this edition has no sign-in or cloud database, there are no Supabase keys to configure. Browser data stays on each visitor's device.
