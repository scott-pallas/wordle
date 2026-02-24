'use client';

import { useEffect } from 'react';
import { useGame } from '@/hooks/useGame';

export function useKeyboard(): void {
  const { state, dispatch } = useGame();
  const { gameStatus } = state;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameStatus !== 'playing') return;

      if (e.key === 'Enter') {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_GUESS' });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'DELETE_LETTER' });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch({ type: 'ADD_LETTER', payload: { letter: e.key.toUpperCase() } });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, dispatch]);
}
