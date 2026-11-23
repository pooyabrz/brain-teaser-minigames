import test from 'node:test';
import assert from 'node:assert/strict';
import { puzzle, solve, boardComplete, safe } from '../src/lib/sudoku.ts';
import { winner, botClassic, botUltimate } from '../src/lib/tictactoe.ts';

test('each Sudoku difficulty generates a complete valid solution with proper givens', () => {
  for (const level of ['easy','medium','hard']) for (let t = 0; t < 3; t++) {
    const { initial, solution } = puzzle(level);
    assert.equal(initial.length, 9);
    assert.equal(solution.length, 9);
    assert.equal(boardComplete(solution, solution), true);
    assert.equal(boardComplete(initial, solution), false);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      assert.ok(initial[r][c] === 0 || initial[r][c] === solution[r][c]);
      const copy = solution.map(row => [...row]);
      const value = copy[r][c]; copy[r][c] = 0;
      assert.equal(safe(copy, r, c, value), true);
    }
    const solved = solve(initial);
    assert.deepEqual(solved, solution);
  }
});
test('Sudoku detects incomplete puzzles', () => {
  const { initial, solution } = puzzle('easy');
  assert.equal(boardComplete(initial, solution), false);
  assert.equal(boardComplete(solution, solution), true);
});
test('Tic Tac Toe winner detects rows, diagonals, draws', () => {
  assert.equal(winner(['X','X','X',null,'O',null,null,null,'O']), 'X');
  assert.equal(winner(['O','X','X','X','O',null,null,null,'O']), 'O');
  assert.equal(winner(['X','O','X','X','O','O','O','X','X']), 'T');
  assert.equal(winner(Array(9).fill(null)), null);
});
test('Smart bot takes a winning move or blocks an immediate loss', () => {
  assert.equal(botClassic(['O','O',null,'X','X',null,null,null,null], 'smart'), 2);
  assert.equal(botClassic(['X','X',null,null,'O',null,null,null,null], 'smart'), 2);
});
test('Ultimate bot respects forced board and empty cells', () => {
  const boards = Array.from({length:9}, () => Array(9).fill(null));
  const owners = Array(9).fill(null);
  const [sub,cell] = botUltimate(boards, owners, 4);
  assert.equal(sub, 4); assert.equal(cell, 4);
  boards[4] = Array(9).fill('X'); owners[4] = 'X';
  const move = botUltimate(boards, owners, 4);
  assert.ok(move !== null);
  assert.notEqual(move[0], 4);
});

test('Rock Paper Scissors rules cover all nine move combinations', async () => {
  const { outcomeOf } = await import('../src/lib/rps.ts');
  assert.deepEqual([0,1,2].map(a => [0,1,2].map(b => outcomeOf(a,b))), [
    ['draw','loss','win'], ['win','draw','loss'], ['loss','win','draw'],
  ]);
});
test('Math Sprint always generates four distinct nonnegative answers including the solution', async () => {
  const { makeQuestion } = await import('../src/lib/math.ts');
  for (const difficulty of ['easy','medium','hard']) for (let i = 0; i < 80; i++) {
    const question = makeQuestion(difficulty);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.options.includes(question.answer));
    assert.ok(question.options.every(x => Number.isInteger(x) && x >= 0));
    const [a,op,b] = question.text.split(' ');
    const expected = op === '+' ? Number(a)+Number(b) : op === '−' ? Number(a)-Number(b) : Number(a)*Number(b);
    assert.equal(question.answer, expected);
  }
});
