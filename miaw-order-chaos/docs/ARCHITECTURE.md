# Architecture — MIAW ORDER & CHAOS

## Runtime flow

```text
index.html
   ↓
core/platform.js
   ↓
core/turn-engine.js
   ↓
games/order-chaos.js
   ↓
app.js
```

## Platform layer

`core/platform.js` is inherited from MIAW BASE. It provides:

- render lifecycle
- persistent preferences
- light/dark theme
- procedural sound toggle
- toast messages
- reset flow
- HTML escaping utilities

It intentionally does not know what Order, Chaos, X, O, a board, or a winning line means.

## Turn layer

`core/turn-engine.js` provides generic player turn progression. Order & Chaos uses `startPlayer` so the player assigned Order begins each round.

## Game layer

`games/order-chaos.js` owns all domain logic:

- 5×5 / target 4
- 6×6 / target 5
- 7×7 / target 6
- X/O selection
- board state
- horizontal, vertical, and diagonal line detection
- Order/Chaos role assignment
- Quick Match
- IQ Duel role swapping
- round scoring
- winner resolution

No game-specific rule should be moved into `/core` merely for convenience.

## Render model

The app uses state-driven full-root rendering:

```text
mutate game state
      ↓
ctx.render()
      ↓
game.render(ctx)
      ↓
replace #app HTML
      ↓
game.bind(ctx)
```

All event listeners inside `#app` are rebound after rendering.
