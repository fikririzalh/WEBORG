# MIAW · ORDER & CHAOS

Web boardgame 2-player single-device yang dibangun di atas **MIAW BASE**.

## Aturan

- Tepat 2 pemain: 1 Order dan 1 Chaos.
- Order selalu bergerak pertama pada setiap ronde.
- Kedua pemain bebas memilih `X` atau `O` pada setiap giliran.
- Order menang jika muncul minimal N simbol identik dalam garis lurus horizontal, vertikal, atau diagonal.
- Chaos menang jika papan penuh tanpa garis kemenangan Order.
- Garis kemenangan berlaku berdasarkan state papan. Jadi Chaos dapat secara tidak sengaja memberi kemenangan kepada Order.

## Mode target

| Mode | Board | Target Order |
|---|---:|---:|
| Easy | 5×5 | 4 in a row |
| Medium | 6×6 | 5 in a row |
| Hard | 7×7 | 6 in a row |

## Format pertandingan

- **Quick Match:** 1 ronde.
- **IQ Duel:** 2 ronde dan role otomatis ditukar di ronde kedua.

## Struktur

```text
miaw-order-chaos/
├── index.html
├── styles.css
├── app.js
├── core/
│   ├── platform.js
│   └── turn-engine.js
├── games/
│   └── order-chaos.js
└── docs/
```

## Menjalankan

Tidak memerlukan build tool atau dependency. Buka `index.html` di browser modern, atau serve folder ini dengan static server sederhana.
