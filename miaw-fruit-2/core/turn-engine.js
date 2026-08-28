(function (global) {
  'use strict';

  function createTurnState(playerCount, options = {}) {
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw new Error('playerCount must be a positive integer.');
    }

    const startPlayer = Number.isInteger(options.startPlayer) ? options.startPlayer : 0;
    return {
      turn: ((startPlayer % playerCount) + playerCount) % playerCount,
      round: options.startRound || 1,
      turnNumber: 1,
      playerCount
    };
  }

  function advanceTurn(turnState) {
    const current = turnState.turn;
    const next = (current + 1) % turnState.playerCount;
    return {
      ...turnState,
      turn: next,
      round: next === 0 ? turnState.round + 1 : turnState.round,
      turnNumber: turnState.turnNumber + 1
    };
  }

  function previousPlayer(turnState) {
    return (turnState.turn - 1 + turnState.playerCount) % turnState.playerCount;
  }

  function isRoundStart(turnState) {
    return turnState.turn === 0;
  }

  global.MIAWTurnEngine = {
    createTurnState,
    advanceTurn,
    previousPlayer,
    isRoundStart
  };
}(window));
