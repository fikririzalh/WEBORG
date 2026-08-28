# Architecture — MIAW · SIM

MIAW · SIM follows the MIAW BASE separation between reusable platform infrastructure and game-specific logic.

## Layers

```text
index.html
   ↓
core/platform.js       reusable shell, theme, audio, storage, render runtime
core/turn-engine.js    reusable two-player turn primitives
   ↓
games/sim.js           K6 graph rules, edge claims, triangle detection, match state
   ↓
styles.css             responsive visual presentation
```

## State ownership

`games/sim.js` owns all domain state: players, color assignment, round number, edge ownership, selected vertex, losing triangle, scores, and match phase.

`core/platform.js` must remain unaware of SIM concepts such as vertices, edges, colors, or triangles.
