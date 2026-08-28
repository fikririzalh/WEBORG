const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const context = { console, Math };
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname + '/core/turn-engine.js', 'utf8'), context);
vm.runInContext(fs.readFileSync(__dirname + '/games/splatter.js', 'utf8'), context);

const t = context.MIAW_GAME._test;

for (const size of [4, 6, 8]) {
  const board = t.createBalancedBoard(size);
  assert.strictEqual(board.length, size * size, `${size}x${size} cell count`);
  assert.strictEqual(t.countAlive(board, 0), size * size / 2, `${size}x${size} blue balance`);
  assert.strictEqual(t.countAlive(board, 1), size * size / 2, `${size}x${size} pink balance`);
}

assert.deepStrictEqual([...t.getAffectedIndices(14, 6, 'full')].sort((a,b)=>a-b), [7,8,9,13,14,15,19,20,21]);
assert.strictEqual(t.getAffectedIndices(0, 6, 'full').length, 4, 'corner blast has 4 cells');
assert.strictEqual(t.getAffectedIndices(2, 6, 'full').length, 6, 'top edge blast has 6 cells');
assert.deepStrictEqual([...t.getAffectedIndices(14, 6, 'solo')], [14]);

const mixed = [0,1,0,1,0,1,0,1,0];
const blast = t.applySplatter(mixed, 4, 3, 'full');
assert.strictEqual(blast.board.every(v => v === null), true, 'full blast removes friendly and enemy cells');

let outcome = t.determineOutcome([0,0,null,null], 0);
assert.strictEqual(outcome.winner, 0, 'blue wins when pink is eliminated');
assert.strictEqual(outcome.draw, false);
outcome = t.determineOutcome([null,null,null,null], 0);
assert.strictEqual(outcome.winner, null, 'simultaneous zero has no winner');
assert.strictEqual(outcome.draw, true, 'simultaneous zero is draw');

const strategic = t.createState(['A','B'], 'classic', 'strategic');
assert.strictEqual(strategic.phase, 'placement');
assert.strictEqual(strategic.board.length, 36);
assert.strictEqual(strategic.quota, 18);
assert.strictEqual(strategic.board.every(v => v === null), true);

const random = t.createState(['A','B'], 'classic', 'random');
assert.strictEqual(random.phase, 'play');
assert.strictEqual(t.countAlive(random.board,0), 18);
assert.strictEqual(t.countAlive(random.board,1), 18);

console.log('Splatter logic tests: PASS');
