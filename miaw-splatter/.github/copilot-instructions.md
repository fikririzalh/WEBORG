This repository is MIAW · SPLATTER, a 2-player single-device browser boardgame built on MIAW BASE.

Preserve `/core` as reusable infrastructure. Put Splatter-specific rules and UI behavior in `games/splatter.js`.

Locked Classic semantics:
- balanced two-color grid;
- select only your own live dot;
- Solo Splatter removes only the selected cell;
- Full Splatter removes the selected cell plus every valid neighbor in its 3×3 area;
- friendly fire allowed;
- dead cells never return;
- no pass;
- last color standing wins;
- simultaneous elimination is draw.

Maintain direct `index.html` launch, responsive mobile behavior, theme toggle, sound toggle, reset behavior, and no external runtime dependencies.
