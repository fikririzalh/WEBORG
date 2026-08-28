# AGENTS.md — MIAW ORDER & CHAOS

This repository is a game implementation built on MIAW BASE.

## Architecture boundary

- `/core` is reusable platform infrastructure. Do not put Order & Chaos rules there.
- `/games/order-chaos.js` owns board size, role assignment, line detection, match flow, scoring, and all game-specific state.
- `styles.css` owns the visual layer.
- `index.html` is the static shell and script load order.

## Non-negotiable game rules

1. Exactly two local players.
2. Exactly one Order and one Chaos per round.
3. Order moves first.
4. Either player may place X or O on any empty cell.
5. Order wins when a contiguous horizontal, vertical, or diagonal run of identical marks has length >= target.
6. Chaos wins only when the board is full and no Order winning line exists.
7. In IQ Duel, round 2 swaps roles.
8. Do not convert this into X-player versus O-player Tic-Tac-Toe.

## Modes

- Easy: 5x5, target 4.
- Medium: 6x6, target 5.
- Hard: 7x7, target 6.

## Validation after changes

- Run `node --check` on every JS file.
- Verify horizontal, vertical, and both diagonal win detection.
- Verify run length above target still wins.
- Verify mixed X/O does not win.
- Verify Chaos win requires a full board with no winning line.
- Verify round 2 swaps roles in IQ Duel.
- Verify responsive behavior on narrow screens.
