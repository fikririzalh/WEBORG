# AI Handoff — MIAW · SIM

Read `AGENTS.md` before modifying this project.

## What this project is

A finished two-player, single-device implementation of the paper-and-pencil game SIM, built on MIAW BASE.

## Important implementation choices

- The six vertices use fixed percentage coordinates on a visually symmetric board.
- All 15 possible K6 edges are rendered in SVG.
- Players select edges by tapping/clicking two large HTML vertex buttons; SVG lines are visual only.
- Edge keys are canonical strings such as `0-4`.
- Triangle detection checks the 20 possible triples of six vertices and requires all three corresponding edges to match the current player's color.
- Intersections are irrelevant by construction because only original vertex IDs participate in triangle detection.
- Losing triangle edges and vertices are highlighted only after the losing move.
- No pre-move danger hints should be added unless the product requirement explicitly changes.
- IQ Duel is two rounds with color/first-turn swap.

## Regression surface

`window.MIAW_SIM_TEST` exposes deterministic pure helpers for lightweight Node-based tests without changing gameplay.
