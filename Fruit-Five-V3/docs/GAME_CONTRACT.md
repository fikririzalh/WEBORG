# Game Plugin Contract

The active game is a plain browser object assigned to:

```js
window.MIAW_GAME = game;
```

## Required shape

```js
const game = {
  meta: {
    id: 'unique-game-id',
    title: 'GAME TITLE',
    subtitle: 'Short subtitle',
    eyebrow: 'CATEGORY'
  },

  render(ctx) {
    return '<section>...</section>';
  },

  bind(ctx) {
    // Bind listeners to elements created by render().
  }
};
```

## Optional fields

```js
defaultPrefs: {
  names: ['Player A', 'Player B']
},

onReset(ctx) {
  // Optional cleanup.
}
```

## Runtime context

`render(ctx)` and `bind(ctx)` receive:

```text
ctx.$(selector)
ctx.$$(selector)
ctx.escapeHTML(value)
ctx.clamp(value,min,max)
ctx.prefs
ctx.state
ctx.setState(nextState)
ctx.updateState(patch)
ctx.updatePrefs(patch)
ctx.savePrefs()
ctx.toast(message, duration?)
ctx.beep(frequency?, duration?)
ctx.render()
ctx.goHome()
```

## State ownership

The plugin owns the structure of `ctx.state`.

Core only stores the state reference and triggers render. Therefore different games may use completely different state schemas.

Example social deduction state:

```js
{
  phase: 'night',
  players: [],
  roles: [],
  alive: [],
  votes: {},
  round: 2
}
```

Example card game state:

```js
{
  phase: 'play',
  players: [],
  hands: [[], []],
  deck: [],
  discard: [],
  direction: 1
}
```

Do not force either schema into core.

## Render lifecycle

The base uses a simple pattern:

```text
state changes
   ↓
ctx.render()
   ↓
game.render(ctx) returns HTML
   ↓
HTML replaces #app
   ↓
game.bind(ctx) binds fresh event handlers
```

Because the app root is replaced, listeners inside `#app` must be rebound after each render. Topbar listeners are owned by the runtime and are registered once.

## Security note

Any user-provided string inserted into an HTML template must pass through `ctx.escapeHTML()`.
