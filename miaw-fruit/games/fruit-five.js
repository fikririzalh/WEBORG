(function (global) {
  'use strict';

  const BOXES = ['4', '5', '6', 'FUN-1', 'FUN-2', 'FUN-3'];
  const FRUITS = [
    { id: 'banana', name: 'Pisang', emoji: '🍌' },
    { id: 'strawberry', name: 'Stroberi', emoji: '🍓' },
    { id: 'lime', name: 'Jeruk Nipis', emoji: '🍋‍🟩' },
    { id: 'plum', name: 'Plum', emoji: '🍑' }
  ];
  // Distribusi Halli Galli standar per jenis buah: 5x1, 3x2, 3x3, 2x4, 1x5 = 14 kartu.
  const COUNT_DISTRIBUTION = [1,1,1,1,1,2,2,2,3,3,3,4,4,5];

  function shuffle(items) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeDeck() {
    const cards = [];
    FRUITS.forEach((fruit) => COUNT_DISTRIBUTION.forEach((count) => {
      cards.push({ fruit: fruit.id, count });
    }));
    return shuffle(cards);
  }

  function freshState() {
    return {
      deck: makeDeck(),
      slots: BOXES.map(() => []),
      visible: BOXES.map(() => null),
      draws: 0,
      alert: null
    };
  }

  function fruitById(id) {
    return FRUITS.find((fruit) => fruit.id === id);
  }

  function totals(state) {
    return FRUITS.reduce((acc, fruit) => {
      acc[fruit.id] = state.visible.reduce((sum, card) => sum + (card && card.fruit === fruit.id ? card.count : 0), 0);
      return acc;
    }, {});
  }

  function exactFive(state) {
    const current = totals(state);
    return FRUITS.filter((fruit) => current[fruit.id] === 5);
  }

  function cardHTML(card) {
    if (!card) return '<div class="fruit-card empty-card"><span>?</span><small>Belum ada kartu</small></div>';
    const fruit = fruitById(card.fruit);
    const icons = Array.from({ length: card.count }, () => `<span>${fruit.emoji}</span>`).join('');
    return `
      <div class="fruit-card">
        <strong class="fruit-number">${card.count}</strong>
        <div class="fruit-icons count-${card.count}" aria-label="${card.count} ${fruit.name}">${icons}</div>
        <small>${fruit.name}</small>
      </div>
    `;
  }

  function renderGame(state) {
    const currentTotals = totals(state);
    const five = exactFive(state);
    return `
      <section class="fruit-game">
        ${five.length ? `
          <div class="five-alert" role="alert">
            <div class="five-alert-icon">✋</div>
            <div><b>TEPAT 5 ${five.map((f) => f.name.toUpperCase()).join(' + ')}!</b><span>Bunyikan bell sungguhan sekarang.</span></div>
          </div>
        ` : ''}

        <div class="panel fruit-toolbar">
          <div>
            <div class="eyebrow">DECK</div>
            <b>${state.deck.length} kartu tersisa</b>
            <span>${state.draws} kartu sudah dibuka</span>
          </div>
          <button class="secondary-btn" id="shuffleBtn" type="button">🔀 Acak ulang deck</button>
        </div>

        <div class="fruit-board">
          ${BOXES.map((label, index) => `
            <article class="fruit-slot ${state.visible[index] ? 'has-card' : ''}">
              <div class="slot-head"><b>${label}</b><span>${state.slots[index].length} kartu</span></div>
              ${cardHTML(state.visible[index])}
              <button class="primary-btn draw-btn" data-slot="${index}" type="button" ${state.deck.length ? '' : 'disabled'}>KARTU</button>
            </article>
          `).join('')}
        </div>

        <div class="panel totals-panel">
          <div class="eyebrow">BUAH YANG TERLIHAT</div>
          <div class="fruit-totals">
            ${FRUITS.map((fruit) => `
              <div class="total-chip ${currentTotals[fruit.id] === 5 ? 'is-five' : ''}">
                <span>${fruit.emoji}</span><b>${currentTotals[fruit.id]}</b>
              </div>
            `).join('')}
          </div>
          <p>Hanya kartu paling atas pada enam kotak yang dihitung. Peringatan muncul saat total satu jenis buah tepat 5.</p>
        </div>
      </section>
    `;
  }

  const game = {
    meta: {
      id: 'fruit-five-table',
      title: 'FRUIT FIVE',
      subtitle: 'Kartu digital, bell tetap sungguhan.',
      eyebrow: 'REAL-LIFE BELL CARD TABLE'
    },

    render(ctx) {
      if (!ctx.state) ctx.setState(freshState());
      return renderGame(ctx.state);
    },

    bind(ctx) {
      ctx.$$('.draw-btn').forEach((button) => button.addEventListener('click', () => {
        if (!ctx.state.deck.length) return;
        const index = Number(button.dataset.slot);
        const card = ctx.state.deck.pop();
        ctx.state.slots[index].push(card);
        ctx.state.visible[index] = card;
        ctx.state.draws += 1;
        const five = exactFive(ctx.state);
        if (five.length) {
          ctx.beep(980, 0.12);
          ctx.toast(`TEPAT 5 ${five.map((f) => f.name.toUpperCase()).join(' + ')}! 🔔`, 2600);
        }
        ctx.render();
      }));

      ctx.$('#shuffleBtn')?.addEventListener('click', () => {
        if (!confirm('Acak ulang akan menghapus semua kartu di meja. Lanjutkan?')) return;
        ctx.setState(freshState());
        ctx.toast('Deck diacak ulang.');
        ctx.render();
      });
    },

    onReset(ctx) {
      ctx.setState(freshState());
    }
  };

  global.MIAW_GAME = game;
}(window));
