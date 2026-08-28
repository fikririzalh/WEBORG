# MIAW · SPLATTER - Agent Instructions

This repository is a concrete game built on MIAW BASE.

## Read first

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/GAME_CONTRACT.md`
4. `games/splatter.js`

## Architecture boundary

- Treat `/core` as stable reusable infrastructure.
- Splatter-specific board, blast patterns, setup, elimination, scoring, and victory logic belong in `games/splatter.js`.
- Keep `app.js` as a thin bootstrap.
- Reuse the theme, sound, storage, toast, and render lifecycle from MIAW BASE.

## Locked game semantics

- Exactly 2 players on one device.
- A live cell has one owner: Player 0 or Player 1.
- A dead cell is `null` after the play phase begins.
- Players may select only their own live dot as a splatter center.
- Classic rule set exposes only `solo` and `full` splatter.
- `solo`: selected cell only.
- `full`: selected cell plus all valid cells in its surrounding 3×3 neighborhood.
- Friendly fire is allowed.
- Dead cells never revive.
- No pass action.
- Last color standing wins.
- Simultaneous elimination is a draw.

## Validation after changes

At minimum test:

- 4×4, 6×6, and 8×8 balanced random setup.
- Solo removes exactly one cell.
- Full center removes 9 cells on an interior position.
- Full corner removes 4 cells.
- Full edge removes 6 cells.
- Opponent dot cannot be used as a splatter center.
- Friendly fire removes both colors inside the blast.
- One side reaching zero declares the other winner.
- Both sides reaching zero simultaneously declares draw.
- Strategic setup reaches exactly 50:50 ownership.
- Mobile grid remains fully visible without horizontal overflow.
