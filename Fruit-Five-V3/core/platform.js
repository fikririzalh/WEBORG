(function (global) {
  'use strict';

  const DEFAULT_PREFS = {
    theme: 'light',
    sound: true,
    names: ['Player A', 'Player B']
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHTML(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function createStorage(key) {
    return {
      read(fallback = {}) {
        try {
          return { ...fallback, ...JSON.parse(localStorage.getItem(key) || '{}') };
        } catch {
          return { ...fallback };
        }
      },
      write(value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      remove() {
        localStorage.removeItem(key);
      }
    };
  }

  function createRuntime(game, options = {}) {
    if (!game || typeof game.render !== 'function' || typeof game.bind !== 'function') {
      throw new Error('Invalid game plugin. See docs/GAME_CONTRACT.md.');
    }

    const storageKey = options.storageKey || `miaw-base:${game.meta?.id || 'game'}:prefs:v1`;
    const storage = createStorage(storageKey);
    const elements = {
      app: $('#app'),
      title: $('#gameTitle'),
      subtitle: $('#gameSubtitle'),
      eyebrow: $('#gameEyebrow'),
      theme: $('#themeBtn'),
      sound: $('#soundBtn'),
      reset: $('#resetBtn'),
      toast: $('#toast')
    };

    let audio = null;
    let toastTimer = null;
    let prefs = storage.read({ ...DEFAULT_PREFS, ...(game.defaultPrefs || {}) });
    let state = null;

    function savePrefs() {
      storage.write(prefs);
    }

    function toast(message, duration = 1600) {
      elements.toast.textContent = message;
      elements.toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => elements.toast.classList.remove('show'), duration);
    }

    function beep(frequency = 650, duration = 0.06) {
      if (!prefs.sound) return;
      try {
        audio ||= new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.05, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + duration);
      } catch {
        // Audio is optional. Failure must never block gameplay.
      }
    }

    function applyTheme() {
      document.documentElement.dataset.theme = prefs.theme;
      elements.theme.textContent = prefs.theme === 'dark' ? '☀️' : '🌙';
      elements.sound.textContent = prefs.sound ? '🔊' : '🔇';
    }

    function setBrand() {
      const meta = game.meta || {};
      document.title = meta.title || 'MIAW BASE';
      elements.title.textContent = meta.title || 'MIAW BASE';
      elements.subtitle.textContent = meta.subtitle || 'Reusable browser boardgame foundation.';
      elements.eyebrow.textContent = meta.eyebrow || 'WEB BOARDGAME';
    }

    function context() {
      return {
        $, $$,
        escapeHTML,
        clamp,
        prefs,
        state,
        setState(nextState) {
          state = nextState;
          this.state = state;
        },
        updateState(patch) {
          state = { ...(state || {}), ...patch };
          this.state = state;
        },
        updatePrefs(patch) {
          prefs = { ...prefs, ...patch };
          this.prefs = prefs;
          savePrefs();
          applyTheme();
        },
        savePrefs,
        toast,
        beep,
        render,
        goHome() {
          state = null;
          render();
        }
      };
    }

    function render() {
      const ctx = context();
      elements.app.innerHTML = game.render(ctx);
      game.bind(context());
    }

    function resetGame() {
      state = null;
      if (typeof game.onReset === 'function') game.onReset(context());
      render();
    }

    elements.theme.addEventListener('click', () => {
      prefs = { ...prefs, theme: prefs.theme === 'dark' ? 'light' : 'dark' };
      savePrefs();
      applyTheme();
    });

    elements.sound.addEventListener('click', () => {
      prefs = { ...prefs, sound: !prefs.sound };
      savePrefs();
      applyTheme();
      beep(700, 0.04);
    });

    elements.reset.addEventListener('click', resetGame);

    setBrand();
    applyTheme();
    render();

    return {
      render,
      resetGame,
      getState: () => state,
      getPrefs: () => ({ ...prefs })
    };
  }

  global.MIAWBase = {
    createRuntime,
    createStorage,
    escapeHTML,
    clamp,
    $,
    $$
  };
}(window));
