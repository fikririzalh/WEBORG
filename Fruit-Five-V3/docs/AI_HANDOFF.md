# AI Handoff Guide

This file explains the intent behind MIAW BASE so another coding AI can continue without reconstructing the original design decisions.

## What was extracted

The source boardgame already had useful reusable traits: single-device flow, responsive layout, theme toggle, sound toggle, local preference persistence, topbar actions, panels, setup forms, pass screens, game screens, history-like lists, and final result screens.

## What was intentionally removed from core

The source game's codebreaking mechanics were not generalized into the base. Digit entry, exact-position evaluation, secret codes, code history, and tie handling belonged to that one game's rule set. Keeping them in core would make future non-codebreaking games harder to implement.

## Target workflow for a future request

When the user provides a new boardgame idea:

1. Classify the mechanics: turn-based, simultaneous, social deduction, card, grid, party, etc.
2. Identify existing MIAW BASE capabilities that can be reused unchanged.
3. Define the new game's state schema.
4. Define phases and transitions explicitly.
5. Implement all game-specific mechanics under `/games`.
6. Extend `/core` only for truly reusable capability.
7. Validate every transition and end condition.

## Desired outcome

A future user prompt should be able to focus on the new game's rules and content, rather than repeatedly requesting theme, sound, reset, responsive shell, storage helpers, or turn scaffolding.
