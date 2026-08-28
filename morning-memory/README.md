# Morning Memory — Lamb & Wolf Edition

A single-device, local-first memory training web game built with plain HTML, CSS, and JavaScript.

## Run
Open `index.html` in a modern browser. No server or build step is required.

## Included modes
- Classic Match: English ↔ Indonesian card matching
- Word Recall: study, hide, then type the English word
- Reverse Recall: randomized EN → ID and ID → EN recall
- Memory Trail: remember and rebuild an ordered word sequence
- Story Chain: generate a sentence from three words, then recall them
- Flash Grid: memorize spatial positions of words

## Memory Library
Cards can be created, edited, deleted, searched, filtered, and sorted. The starter library contains a curated bilingual set of motivational, learning, character, momentum, purpose, and wellbeing vocabulary. It is deliberately not described as an exhaustive dictionary.

## Progress model
Each card tracks correct attempts, wrong attempts, streak, mastery percentage, last played date, and next review date. Weak and due items are prioritized by a lightweight heuristic. This is a product heuristic, not a validated optimal spaced-repetition algorithm.

## Storage
Data is stored in browser `localStorage` under:
- `morningMemory_v1`
- `morningMemory_prefs_v1`

Clearing browser site data will remove local progress.

## Audio
Music and effects are generated procedurally with the Web Audio API. Browsers may require a user interaction before audio can start.
