# AI Handoff — MIAW ORDER & CHAOS

Start with `AGENTS.md`, then inspect `games/order-chaos.js`.

The project is plain HTML/CSS/JavaScript with no package manager and no build step.

The base runtime owns theme, sound, toast, reset, preferences, and render lifecycle. The game plugin owns every Order & Chaos rule and state transition.

When adding features, preserve the distinction between a reusable platform concern and a game-specific concern.
