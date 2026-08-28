# AI Handoff Guide - MIAW · BLACK HOLE

This project is a concrete game built on MIAW BASE.

## Reused from MIAW BASE

- Browser runtime and render lifecycle.
- Theme toggle.
- Sound toggle and procedural beep.
- Preference persistence.
- Reset/home behavior.
- Sequential turn engine.
- Responsive panel primitives.

## Game-specific implementation

`games/blackhole.js` owns:

- Player-count configuration.
- Triangular board generation.
- Per-player ascending number sequence.
- Cell placement.
- Black Hole selection as the final empty cell.
- Triangular-lattice adjacency.
- Penalty calculation.
- Winner/tie resolution.
- Black Hole board rendering and score breakdown.

## Important provenance distinction

Classic 2-player rules come from the original Black Hole ruleset. The 3-player 7-row format is a documented paper-and-pen extension. The 4-player Arena and Compact modes are MIAW extensions chosen because their triangular-cell counts leave exactly one final empty cell.

Do not describe the 4-player configurations as original Wal Joris rules.
