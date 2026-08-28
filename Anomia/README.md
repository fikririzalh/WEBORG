# Meowmia — Cat-themed Anomia-style web prototype

Vanilla HTML/CSS/JS prototype built from the user's uploaded **Anomia Print & Play — Create Your Own Deck!** PDF.

## What is included

- 150 editable category cards (Indonesian / English / mixed, Gen-Z-ish but broadly family-friendly)
- Full local CRUD: create, read/browse/search/filter, update, enable/disable, delete
- JSON export/import and reset-to-seed
- Light / dark mode (saved in `localStorage`)
- Cute cat visual theme
- 2–6 local players
- 150-card game deck per match when at least 142 category cards are enabled: 142 random categories + 8 Wild Cards
- Code match Face-Offs, Wild pairs, cascade Face-Offs, captured-card scoring
- Offline-first: no framework, build step, package manager, login, or server required

## Run

Open `index.html` in a modern browser.

For browsers that restrict some local-file behavior, serve the folder locally, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Project structure

```text
anomia_cat_web_letters/
├── index.html
├── styles.css
├── app.js
├── seed-data.js
├── README.md
├── LICENSE.txt
└── assets/
    ├── anomia-card-back.png
    └── anomia-card-back.png
```

## Rules implemented

The core interaction follows the public Anomia rules summary: matching visible codes trigger a Face-Off; players race to answer the category on the opponent's card; Wild Cards create code-pair matches; revealing a previous card after a loss can cause cascading Face-Offs.

This prototype makes winner validation manual: after players answer out loud, tap the winner in the Face-Off modal.

## Storage

Card edits and theme preferences are stored only in the browser's `localStorage`.

- `meowmia.cards.v2`
- `meowmia.theme.v1`

Legacy `meowmia.cards.v1` data is migrated automatically from the old graphic-symbol version.

Use **Export JSON** before clearing browser storage if you want a backup.

## Attribution / license

This is a **fan-made, noncommercial remix** and is not presented as endorsed by Anomia Press.

The card-back visual was extracted/cropped from the user-provided Anomia Print & Play PDF. Front cards use original HTML/CSS letter codes A–H rather than the PDF symbol artwork. The PDF states that Anomia Print & Play is made available under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**. The web adaptation identifies its modifications and is distributed under the same license.

Source material: **Anomia Print & Play**, Anomia Press.

Official rules: `https://www.anomiapress.com/pages/how-to-play`

License: `https://creativecommons.org/licenses/by-nc-sa/4.0/`
