# AGENTS.md — MIAW SIM

This repository is a game implementation built on MIAW BASE.

## Architecture boundary

- `/core` is reusable platform infrastructure. Do not put SIM rules there.
- `/games/sim.js` owns graph topology, edge ownership, triangle detection, turn flow, color assignment, scoring, and match flow.
- `styles.css` owns the visual layer.
- `index.html` owns the static shell and script load order.

## Non-negotiable game rules

1. Exactly two local players on one device.
2. Exactly six original vertices.
3. There are exactly 15 unique possible edges.
4. Blue moves first; Red moves second.
5. Each player has one fixed color for the round.
6. A move connects two original vertices whose edge is still unused.
7. Used edges can never be recolored or reused.
8. A player immediately loses when their move creates a triangle whose three edges are all their own color.
9. Only triangles whose corners are three of the six original vertices count.
10. Edge intersections are never vertices.
11. Do not add a danger warning that tells players which moves create triangles.
12. IQ Duel uses two rounds and swaps Blue/Red between players for round 2.

## Mathematical invariant

The board is `K6`. Since `R(3,3)=6`, a complete two-coloring cannot avoid a monochromatic triangle. A normal ruleset therefore has no draw.

## Validation after changes

- Run `node --check` on every JavaScript file.
- Verify all 15 unique edge keys exist.
- Verify triangle detection for multiple vertex triples.
- Verify a triangle requires all three edges in the same player's color.
- Verify mixed-color triangles do not lose.
- Verify intersections do not affect detection.
- Verify used edges cannot be claimed again.
- Verify turn alternates after a safe move.
- Verify the player who forms their own triangle loses immediately.
- Verify round 2 swaps colors in IQ Duel.
- Verify board remains usable on desktop, tablet, and smartphone widths.
