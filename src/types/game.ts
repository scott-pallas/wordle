export type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

export type TileState = {
  letter: string;
  status: TileStatus;
};

export type GameState = {
  guesses: TileState[][];      // up to 6 rows, each row has 5 TileState entries
  currentRow: number;           // 0–5
  currentCol: number;           // 0–4
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord: string;
};

export type KeyStatus = Record<string, TileStatus>;
