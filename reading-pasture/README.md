# Reading Pasture · Lamb & Wolf Edition

Static offline reading-comprehension trainer built with HTML, CSS and vanilla JavaScript.

## Included
- 336 passages after the content pack is merged: the original bank, the existing extended bank and 36 new original readings across four levels.
- The new pack covers everyday life, school, nature, science, community, travel, design, media literacy, accessibility, technology, engineering and civics.
- Four question types in each new passage: detail, main idea, inference and vocabulary in context.
- Evidence, explanations and three-step hints for every new question.
- Study Guide with skimming, scanning, main idea, inference, reference words, context clues, sequence, comparison and comprehension monitoring.
- Text-type guides for notices, messages, stories, articles, instructions and tables.
- CEFR orientation from A1 to C1+ as a learning reference, not a formal test score.
- A repeatable seven-day study plan and a reference shelf with official or research-informed resources.
- Vocabulary Barn derived from each reading, with Indonesian meanings and learned-word tracking.
- Full CRUD for readings, questions and vocabulary.
- JSON export/import.
- Local progress, score, streak and history.
- Light/dark farm theme and procedural Web Audio music/SFX.
- No server, npm package or database required.

## Run
Open `index.html` in a modern browser.

## Storage note
The app stores the working bank and progress in localStorage. The expanded bank is still text-only, but a very large future library should move reading data to IndexedDB.

## Level note
The four internal levels are pedagogical difficulty bands, not certified CEFR tests. Their progression is loosely informed by CEFR reading descriptors and learner-reading practice. The Study Guide includes direct links to the Council of Europe, British Council, Reading Rockets, ReadWriteThink, the Education Endowment Foundation and UNESCO.

## Content note
The 36 readings in `content-pack.js` are original practice texts written for this offline trainer. The external links are provided for further study and attribution. The app does not copy full passages from those resources.
