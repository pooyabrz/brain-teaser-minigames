export type Choice = 0 | 1 | 2;
export const outcomeOf = (player: Choice, bot: Choice): 'win' | 'loss' | 'draw' =>
  player === bot ? 'draw' : (player + 2) % 3 === bot ? 'win' : 'loss';
