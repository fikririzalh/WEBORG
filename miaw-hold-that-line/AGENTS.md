# MIAW · HOLD THAT LINE — Agent Instructions

Project ini adalah implementasi game-specific di atas MIAW BASE.

## Baca dahulu

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/GAME_CONTRACT.md`
4. `docs/AI_HANDOFF.md`
5. `games/hold-that-line.js`

## Architecture boundary

- `/core` adalah reusable infrastructure. Jangan masukkan rules Hold That Line ke core.
- Semua board geometry, move validation, path state, crossing detection, endpoint rules, dan win/loss logic berada di `games/hold-that-line.js`.
- `app.js` harus tetap bootstrap tipis.
- Pertahankan direct `index.html` launch.

## Rules yang tidak boleh rusak

- Tepat 2 pemain.
- Seluruh game membentuk satu continuous path.
- First move dapat dimulai dari free dot mana pun.
- Setelah first move, setiap extension harus berawal dari salah satu free endpoint.
- Arah yang diimplementasikan: horizontal, vertical, 45° diagonal.
- Satu segment boleh melewati beberapa collinear grid dots.
- Semua grid dots yang dilewati segment menjadi visited.
- Tidak boleh revisit dot, crossing, overlap, atau branching.
- Jika move yang baru dibuat menyebabkan tidak ada legal move tersisa, pemain yang baru bergerak kalah.
- Quick Match = 1 round.
- Fair Duel = 2 rounds, first player swap.

## Validation minimum

Setelah perubahan:

- `node --check` seluruh file JS.
- Test horizontal/vertical/diagonal line expansion.
- Test non-45° diagonal ditolak.
- Test intermediate dots menjadi visited.
- Test crossing dan overlap ditolak.
- Test extension dari non-endpoint ditolak.
- Test endpoint switch.
- Test terminal position memberi kemenangan kepada lawan dari last mover.
- Test Classic 4×4, Long 5×5, Expert 6×6.
- Test mobile width dan landscape jika browser runtime tersedia.
