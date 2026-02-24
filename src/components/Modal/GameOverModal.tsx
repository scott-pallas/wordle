'use client';

import { useGame } from '@/hooks/useGame';

const WIN_TITLES: Record<number, string> = {
  1: 'Genius!',
  2: 'Magnificent!',
  3: 'Impressive!',
  4: 'Splendid!',
  5: 'Great!',
  6: 'Phew!',
};

export function getWinTitle(guessCount: number): string {
  return WIN_TITLES[guessCount] ?? 'You Won!';
}

export default function GameOverModal() {
  const { state, dispatch } = useGame();
  const { gameStatus, currentRow, targetWord } = state;

  if (gameStatus === 'playing') return null;

  const won = gameStatus === 'won';
  const title = won ? getWinTitle(currentRow) : 'Better luck tomorrow!';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center gap-4 text-white text-center shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold">{title}</h2>

        {won ? (
          <p className="text-lg">Solved in {currentRow}/6</p>
        ) : (
          <>
            <p className="text-lg">The word was:</p>
            <p className="text-3xl font-bold tracking-widest uppercase">{targetWord}</p>
          </>
        )}

        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
