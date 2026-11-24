import test from 'node:test';
import assert from 'node:assert/strict';
import { localFavorites, toggleLocalFavorite, localLeaders } from '../src/lib/demo.ts';
const storage = new Map();
globalThis.localStorage = {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)};
test('local favorites persist and toggle without a server', () => {
  assert.deepEqual(localFavorites(), []);
  assert.equal(toggleLocalFavorite('sudoku'), true);
  assert.equal(toggleLocalFavorite('2048'), true);
  assert.deepEqual(localFavorites(), ['sudoku','2048']);
  assert.equal(toggleLocalFavorite('sudoku'), false);
  assert.deepEqual(localFavorites(), ['2048']);
});
test('invalid favorite storage safely falls back', () => {
  localStorage.setItem('bw-local-favorites', '{');
  assert.deepEqual(localFavorites(), []);
});
test('local leaderboard filters games and completed results and orders scores', () => {
  localStorage.setItem('bw-results', JSON.stringify([
    {slug:'2048',score:10,completed:true,elapsed:5},
    {slug:'2048',score:20,completed:true,elapsed:10},
    {slug:'2048',score:20,completed:true,elapsed:4},
    {slug:'2048',score:99,completed:false,elapsed:1},
    {slug:'sudoku',score:100,completed:true,elapsed:1}
  ]));
  const leaders = localLeaders({slug:'2048',title:'2048'});
  assert.deepEqual(leaders.map(x=>[x.rank,x.score,x.elapsed]), [[1,20,4],[2,20,10],[3,10,5]]);
  assert.ok(leaders.every(x=>x.name==='You (local)'));
});
