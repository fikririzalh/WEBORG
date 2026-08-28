# AI Handoff

Active game: `MIAW · HOLD THAT LINE`.

The project is already functional. Do not rebuild the architecture from scratch when asked for refinements.

## Key implementation facts

- `games/hold-that-line.js` owns all game rules.
- Browser globals are intentional so `file://` launch keeps working.
- Board drawing uses an SVG path layer plus absolute-positioned dot buttons.
- Player segment colors are only turn-history visualization. They do not represent ownership of territory.
- Endpoint dots are highlighted green.
- No safe-move hint is exposed to the player.
- Result semantics are misère: last legal mover loses.

## Common modification destinations

- Visual layout / responsive sizing: `styles.css`.
- Board modes or match formats: constants near top of `games/hold-that-line.js`.
- Move legality: `lineCells()`, `validateMove()`, intersection helpers.
- Result / rematch flow: `roundResult()`, `bindResult()`.

Preserve MIAW BASE core unless a requested capability is clearly reusable across multiple games.
