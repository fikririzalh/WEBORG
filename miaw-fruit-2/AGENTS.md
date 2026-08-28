# MIAW BASE - Agent Instructions

This repository is a reusable browser boardgame foundation, not a single fixed game.

## Read first

Before changing code, read:

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/GAME_CONTRACT.md`
4. The currently active file in `/games`

## Architecture boundary

- Treat `/core` as stable reusable infrastructure.
- Put game-specific rules, phases, roles, cards, board logic, scoring, secrets, AI opponents, and win conditions under `/games`.
- Keep `app.js` as a thin bootstrap file.
- Reuse existing CSS primitives before creating near-duplicate styles.
- Do not hardcode one game's vocabulary or mechanics into core utilities.

## Change policy

Before modifying `/core`, ask: "Will at least two materially different boardgames benefit from this capability?"

If no, implement it inside the game plugin.

If yes, keep the core API generic and document the new capability.

## Compatibility

- Preserve direct `index.html` launch unless the user explicitly requests a build system.
- Do not introduce npm, a framework, a backend, authentication, or a database unless required by the requested game.
- Avoid external dependencies for features that are trivial to implement locally.
- Maintain mobile responsiveness and safe-area padding.
- Maintain keyboard and semantic accessibility where practical.
- Escape user-provided text before inserting it into HTML strings.

## Game plugin requirement

The active game must expose `window.MIAW_GAME` with:

- `meta`
- `render(ctx)`
- `bind(ctx)`

Optional:

- `defaultPrefs`
- `onReset(ctx)`

See `docs/GAME_CONTRACT.md` for the exact runtime context.

## Validation after changes

At minimum:

- Run JavaScript syntax checks on every `.js` file.
- Verify no missing local asset/script references.
- Test home -> setup -> gameplay -> result -> rematch -> home.
- Test theme toggle.
- Test sound toggle.
- Test reset behavior during an active game.
- Inspect at desktop and narrow mobile widths when a browser tool is available.

## Anti-patterns

Do not:

- Copy the example game's scoring or phases unless the new game actually needs them.
- Create a second theme system, second toast system, or second storage helper inside a game.
- Put all game code back into one monolithic `app.js`.
- Rename core APIs casually without updating documentation and all game plugins.
- Store secrets, API keys, tokens, or credentials in the repository.
