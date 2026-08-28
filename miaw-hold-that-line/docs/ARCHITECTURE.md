# Architecture — MIAW · HOLD THAT LINE

```text
GAME LAYER
/games/hold-that-line.js
Grid geometry, path segments, visited dots, endpoints,
intersection validation, terminal detection, match flow
        ↓
BOARDGAME CORE
/core/turn-engine.js
Sequential player turn state
        ↓
WEB PLATFORM
/core/platform.js + styles.css + index.html
Runtime, preferences, theme, sound, toast, responsive shell
```

## State model

Game state stores:

- `mode`: rows/columns and mode metadata.
- `segments`: every extension with endpoints, player, move number, and touched grid dots.
- `visited`: all grid dots already consumed by the path.
- `endpoints`: exactly two terminal grid dots after first move.
- `selectedStart`: UI selection for first dot / endpoint.
- `turn`: generic MIAW turn state.
- `scores`: round wins.

## Geometry policy

A legal segment must be horizontal, vertical, or 45° diagonal. `lineCells()` enumerates every grid dot touched by the segment. Intersection checking also rejects crossings at non-grid coordinates, so diagonal lines cannot silently pass through existing segments between dots.

## Misère terminal rule

After each successful move, the plugin searches for any legal extension from either endpoint. If none exist, the player who just moved is recorded as `roundLoser` and the opponent wins.
