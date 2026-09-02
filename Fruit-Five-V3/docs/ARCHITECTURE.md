# Architecture

## Layer model

```text
GAME-SPECIFIC LAYER
/games/*
Rules, phases, board, deck, roles, scoring, victory, game-only UI
        ↓
BOARDGAME CORE
/core/turn-engine.js and future generic engines
Turn order, round progression, generic reusable mechanics
        ↓
WEB PLATFORM
/core/platform.js + styles.css + index.html
Runtime, theme, sound, preferences, toast, responsive shell
```

The dependency direction should remain downward. Core must not import or know the rules of a specific game.

## `core/platform.js`

Responsibilities:

- Browser selector helpers.
- HTML escaping.
- Preference persistence.
- Theme and sound controls.
- Toast and beep utilities.
- Runtime-owned `state` reference.
- Rendering lifecycle.
- Topbar/reset wiring.

It deliberately does **not** own:

- Game rules.
- Player actions.
- Win conditions.
- Hidden roles.
- Board positions.
- Card definitions.

## `core/turn-engine.js`

Small optional utility for sequential turn-based games.

Current API:

- `MIAWTurnEngine.createTurnState(playerCount, options)`
- `MIAWTurnEngine.advanceTurn(turnState)`
- `MIAWTurnEngine.previousPlayer(turnState)`
- `MIAWTurnEngine.isRoundStart(turnState)`

A simultaneous-action or real-time game is not required to use this engine.

## `games/example-game.js`

A minimal executable reference. Its purpose is to demonstrate:

- Plugin metadata.
- Setup.
- State creation.
- Phase rendering.
- Event binding.
- Turn engine use.
- Result/rematch flow.

Its `Race to 10` rule is disposable.

## Extension rule

Prefer adding new reusable engines as focused files such as:

```text
core/deck.js
core/timer.js
core/rng.js
core/save-state.js
```

Do not create a giant `engine.js` that accumulates unrelated mechanics.
