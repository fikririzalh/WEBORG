# Architecture - MIAW · BLACK HOLE

```text
BLACK HOLE GAME LAYER
/games/blackhole.js
board, configs, placement, adjacency, scoring, result UI
        ↓
BOARDGAME CORE
/core/turn-engine.js
sequential turn progression
        ↓
WEB PLATFORM
/core/platform.js + styles.css + index.html
runtime, theme, sound, preferences, toast, responsive shell
```

## Board representation

The triangular board is stored as a flat array of cells with stable `id`, `row`, and `col` coordinates.

```js
{ id: 7, row: 3, col: 1 }
```

A parallel `placements` array stores either `null` or:

```js
{ player: 0, number: 4 }
```

This keeps geometry separate from mutable game state.

## Endgame

After `totalCells - 1` placements:

1. Find the single `null` placement.
2. Mark that cell as Black Hole.
3. Resolve its direct triangular-lattice neighbors.
4. Sum each player's adjacent values.
5. Select the minimum penalty.
6. One or more players may share the win.
