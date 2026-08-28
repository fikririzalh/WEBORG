# The Whisper: 52 Signs v0.2.2

Single-device, offline-first browser game built with plain HTML, CSS, and JavaScript.

## Modes

### Lite Mode
- 1 Ghost + 1–6 Psychics
- Ghost receives a secret target and three playing cards
- Ghost chooses 1–3 cards as an ordered clue
- Psychics discuss and choose one candidate
- 4 correct answers = victory
- 3 wrong answers = defeat

### Perubahan v0.2.2

- Saat PUBLIC READING, setiap kartu clue langsung menampilkan arti suit dan arti rank di samping kartu.
- Empat kandidat tetap terlihat pada layar yang sama agar pemain dapat membandingkan clue dengan opsi tanpa bolak-balik Kamus Tanda.
- Jika Corruption menyembunyikan suit atau rank, arti bagian tersebut ikut disembunyikan agar UI tidak membocorkan informasi.
- Tampilan FINAL CALL milik Medium juga mempertahankan arti kontekstual yang sama.

## Chaos Mode
- 1 Ghost + 3–6 Psychics
- Exactly one Psychic is secretly the Corrupted Seer
- Corrupted Seer learns the target privately every round
- Corrupted Seer has 3 Corruption charges before exposure
- Distortions: Veil, Silence, Reverse, Echo
- Chaos always uses exactly 4 answer candidates
- The 4 candidates are visible together with the public clue during Reading/discussion
- Reading Order rotates
- Medium role rotates and alone locks the final answer
- Correct answer: +1 Memory
- Wrong answer: +1 Dread
- Loyal victory: 5 Memory
- Corrupted victory: 3 Dread
- Group has 2 Exorcism tokens for secret accusation votes
- Wrong accusation: +1 Dread
- Correct accusation transforms the Corrupted Seer into a public Poltergeist instead of eliminating the player
- Poltergeist receives one free Distortion each round but no longer joins the discussion or acts as Medium

## Offline

All game data and assets are local. `sw.js` caches the core app when served through HTTP/HTTPS.

For a proper PWA test, run a local static server instead of relying only on `file://`:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Files

- `index.html`
- `styles.css`
- `data.js`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `assets/`

No framework, backend, CDN, external font, or remote API is required.
