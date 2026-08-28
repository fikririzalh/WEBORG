This repository is MIAW · SIM, built on MIAW BASE.

Read `AGENTS.md` before making changes. Preserve `/core` as reusable infrastructure. Put SIM-specific graph, edge, triangle, color, and scoring logic in `games/sim.js`.

Do not change the game into ordinary Tic-Tac-Toe. Do not treat line intersections as vertices. Do not add warnings that reveal which move would create a losing triangle unless explicitly requested.

After JavaScript changes, run syntax checks and regression tests for edge uniqueness, monochromatic triangle detection, turn alternation, immediate loss, and round-2 color swap.
