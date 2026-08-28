# MIAW · BLACK HOLE - Agent Instructions

This repository is a Black Hole boardgame implementation built on MIAW BASE.

## Read first

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/GAME_CONTRACT.md`
4. `games/blackhole.js`

## Architecture boundary

- `/core` is stable reusable MIAW infrastructure.
- Black Hole rules, board topology, player-count variants, placement logic, adjacency scoring, and result rules belong in `games/blackhole.js`.
- `app.js` must stay a thin bootstrap.
- Reuse the existing theme, sound, toast, preferences, render lifecycle, and turn engine.

## Rule invariants

Do not accidentally change these without an explicit request:

- 2-player Classic = 6 rows, 21 cells, numbers 1–10 each.
- 3-player Trio = 7 rows, 28 cells, numbers 1–9 each.
- 4-player Arena = 9 rows, 45 cells, numbers 1–11 each. This is a MIAW extension.
- 4-player Compact = 6 rows, 21 cells, numbers 1–5 each. This is a MIAW extension.
- Numbers are placed in ascending order per player.
- Any empty circle may be selected; there is no movement/path requirement.
- Exactly one circle must remain empty at game end.
- Only directly adjacent cells in the triangular lattice score against the Black Hole.
- Lowest Black Hole penalty wins.
- Equal lowest penalties are a shared win in this implementation.

## Triangular adjacency

For coordinate `(row, col)`, direct neighbors are:

```text
(row, col-1)
(row, col+1)
(row-1, col-1)
(row-1, col)
(row+1, col)
(row+1, col+1)
```

Ignore coordinates outside the board.

## Validation after changes

At minimum:

- `node --check` every `.js` file.
- Verify every board config satisfies `T(rows) = players * maxNumber + 1`.
- Test top, edge, and interior adjacency counts.
- Test scoring with multiple adjacent tiles from multiple players.
- Test a tie for lowest score.
- Test setup for 2, 3, 4 Arena, and 4 Compact.
- Test final placement -> Black Hole -> scoring -> result -> rematch -> setup/home.
- Preserve mobile layout, especially the 9-row Arena board.
