'use client';

import { createContext, useReducer, useEffect } from 'react';
import type { TileState, TileStatus } from '@/types/game';
import { getDailyWord, isValidWord, evaluateGuess } from '@/lib/gameLogic';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface GameState {
  board: TileState[][];       // 6 rows × 5 columns
  currentRow: number;         // 0–5
  currentCol: number;         // 0–4
  gameStatus: 'playing' | 'won' | 'lost';
  targetWord: string;
  keyStatuses: Record<string, TileStatus>;
  invalidWord: boolean;
  revealingRow: number | null;
  toastMessage: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AddLetterAction = { type: 'ADD_LETTER'; payload: { letter: string } };
type DeleteLetterAction = { type: 'DELETE_LETTER' };
type SubmitGuessAction = { type: 'SUBMIT_GUESS' };
type ResetGameAction = { type: 'RESET_GAME' };
type ClearInvalidWordAction = { type: 'CLEAR_INVALID_WORD' };
type ClearRevealingRowAction = { type: 'CLEAR_REVEALING_ROW' };
type ClearToastAction = { type: 'CLEAR_TOAST' };

export type GameAction =
  | AddLetterAction
  | DeleteLetterAction
  | SubmitGuessAction
  | ResetGameAction
  | ClearInvalidWordAction
  | ClearRevealingRowAction
  | ClearToastAction;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyBoard(): TileState[][] {
  return Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, (): TileState => ({ letter: '', status: 'empty' })),
  );
}

function createInitialState(): GameState {
  return {
    board: createEmptyBoard(),
    currentRow: 0,
    currentCol: 0,
    gameStatus: 'playing',
    targetWord: getDailyWord(),
    keyStatuses: {},
    invalidWord: false,
    revealingRow: null,
    toastMessage: null,
  };
}

// ---------------------------------------------------------------------------
// Key-status priority: correct > present > absent
// ---------------------------------------------------------------------------

const STATUS_PRIORITY: Record<TileStatus, number> = {
  correct: 3,
  present: 2,
  absent: 1,
  empty: 0,
};

function mergeKeyStatuses(
  existing: Record<string, TileStatus>,
  guess: string,
  statuses: TileStatus[],
): Record<string, TileStatus> {
  const updated = { ...existing };
  for (let i = 0; i < 5; i++) {
    const letter = guess[i];
    const newStatus = statuses[i];
    const current = updated[letter];
    if (current === undefined || STATUS_PRIORITY[newStatus] > STATUS_PRIORITY[current]) {
      updated[letter] = newStatus;
    }
  }
  return updated;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER': {
      if (state.gameStatus !== 'playing' || state.currentCol >= 5) return state;

      const newBoard = state.board.map((row, ri) =>
        ri === state.currentRow
          ? row.map((tile, ci) =>
              ci === state.currentCol
                ? { letter: action.payload.letter, status: 'empty' as const }
                : tile,
            )
          : row,
      );

      return { ...state, board: newBoard, currentCol: state.currentCol + 1 };
    }

    case 'DELETE_LETTER': {
      if (state.gameStatus !== 'playing' || state.currentCol <= 0) return state;

      const targetCol = state.currentCol - 1;
      const newBoard = state.board.map((row, ri) =>
        ri === state.currentRow
          ? row.map((tile, ci) =>
              ci === targetCol ? { letter: '', status: 'empty' as const } : tile,
            )
          : row,
      );

      return { ...state, board: newBoard, currentCol: targetCol };
    }

    case 'SUBMIT_GUESS': {
      if (state.gameStatus !== 'playing') return state;

      if (state.currentCol !== 5) {
        return { ...state, toastMessage: 'Not enough letters' };
      }

      const guess = state.board[state.currentRow].map((t) => t.letter).join('');

      if (!isValidWord(guess)) {
        return { ...state, invalidWord: true, toastMessage: 'Not in word list' };
      }

      const statuses = evaluateGuess(guess, state.targetWord);

      const newBoard = state.board.map((row, ri) =>
        ri === state.currentRow
          ? row.map((tile, ci) => ({ ...tile, status: statuses[ci] }))
          : row,
      );

      const newKeyStatuses = mergeKeyStatuses(state.keyStatuses, guess, statuses);
      const won = statuses.every((s) => s === 'correct');
      const nextRow = state.currentRow + 1;
      const lost = !won && nextRow === 6;

      return {
        ...state,
        board: newBoard,
        currentRow: nextRow,
        currentCol: 0,
        gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        keyStatuses: newKeyStatuses,
        invalidWord: false,
        revealingRow: state.currentRow,
        toastMessage: null,
      };
    }

    case 'CLEAR_INVALID_WORD':
      return { ...state, invalidWord: false };

    case 'CLEAR_REVEALING_ROW':
      return { ...state, revealingRow: null };

    case 'CLEAR_TOAST':
      return { ...state, toastMessage: null };

    case 'RESET_GAME':
      return createInitialState();

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  useEffect(() => {
    if (state.invalidWord) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_INVALID_WORD' }), 600);
      return () => clearTimeout(timer);
    }
  }, [state.invalidWord]);

  useEffect(() => {
    if (state.revealingRow !== null) {
      // 5 tiles × 300ms stagger + 500ms flip duration
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_REVEALING_ROW' }), 5 * 300 + 500);
      return () => clearTimeout(timer);
    }
  }, [state.revealingRow]);

  return (
    <GameContext value={{ state, dispatch }}>
      {children}
    </GameContext>
  );
}
