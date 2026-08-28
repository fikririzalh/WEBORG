# MIAW BASE Game Contract

A game plugin assigns `window.MIAW_GAME` with:

```js
{
  meta: { id, title, subtitle, eyebrow },
  defaultPrefs,
  render(ctx),
  bind(ctx)
}
```

`render(ctx)` returns the current HTML string. `bind(ctx)` attaches event handlers after rendering.

Useful runtime context:

- `ctx.state`, `ctx.setState()`, `ctx.updateState()`
- `ctx.prefs`, `ctx.updatePrefs()`
- `ctx.$()`, `ctx.$$()`
- `ctx.escapeHTML()`
- `ctx.toast()` and `ctx.beep()`
- `ctx.render()` and `ctx.goHome()`

Game-specific rules must remain in `/games` rather than `/core`.
