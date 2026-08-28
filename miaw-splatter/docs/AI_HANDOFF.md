# AI Handoff - MIAW · SPLATTER

This project is a Splatter implementation built on MIAW BASE.

## Current product decisions

- 2 players, single device.
- Primary transcript-compatible action set: Solo + Full 3×3.
- Classic board: 6×6.
- MIAW variants: 4×4 Quick and 8×8 Long.
- Setup choices: balanced random or strategic alternating placement.
- Strategic placement begins with Blue; Pink begins the Splatter phase after being the second placer.
- No tactical warning/hint is shown before a move.
- Simultaneous zero is explicitly handled as draw.

## Do not accidentally change

Some published Splatter sheets use Orthogonal, Diagonal, and Universal patterns. This repository intentionally follows the simpler transcript variant requested by the user: Solo and Full only. Add extra patterns only as a clearly labeled optional variant, not by silently changing Classic.

## Core boundary

Do not move grid ownership, blast geometry, elimination, setup, or winner detection into `/core` unless another materially different MIAW game also needs the same generic abstraction.
