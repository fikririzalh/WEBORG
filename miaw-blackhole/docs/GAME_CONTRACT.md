# Game Plugin Contract

The MIAW BASE runtime loads `games/blackhole.js`, which assigns:

```js
window.MIAW_GAME = game;
```

Required plugin methods remain:

```text
meta
render(ctx)
bind(ctx)
```

The runtime context provides selectors, HTML escaping, preferences, state ownership, toast, sound, rendering, and home/reset helpers.

Black Hole additionally exposes read-only-style logic helpers at:

```js
window.MIAWBlackHoleRules
```

for validation/testing of configurations, board generation, adjacency, and scoring. Game state and rules remain owned by the game layer; `/core` does not know Black Hole mechanics.
