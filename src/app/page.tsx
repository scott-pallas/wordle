'use client';

import { useEffect, useRef, useState } from 'react';
import { useGame } from '@/hooks/useGame';
import { useToast } from '@/context/ToastContext';
import { useKeyboard } from '@/hooks/useKeyboard';
import { getWinTitle } from '@/components/Modal/GameOverModal';
import Header from '@/components/Header';
import Board from '@/components/Board';
import Keyboard from '@/components/Keyboard/Keyboard';
import GameOverModal from '@/components/Modal/GameOverModal';

export default function Home() {
  const { state, dispatch } = useGame();
  const { gameStatus, currentRow, toastMessage } = state;
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const prevGameStatusRef = useRef(gameStatus);

  useKeyboard();

  // Show modal after flip animation delay
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const timer = setTimeout(() => setShowModal(true), 1800);
      return () => clearTimeout(timer);
    }
    setShowModal(false);
  }, [gameStatus]);

  // Toast for invalid input (toastMessage from reducer)
  useEffect(() => {
    if (toastMessage) {
      showToast(toastMessage);
      dispatch({ type: 'CLEAR_TOAST' });
    }
  }, [toastMessage, showToast, dispatch]);

  // Toast for win (fires on status change to 'won')
  useEffect(() => {
    if (prevGameStatusRef.current !== gameStatus && gameStatus === 'won') {
      showToast(getWinTitle(currentRow));
    }
    prevGameStatusRef.current = gameStatus;
  }, [gameStatus, currentRow, showToast]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center max-w-lg mx-auto w-full px-4 py-6">
        <Board />
      </main>
      <div className="max-w-lg mx-auto w-full px-2 pb-6">
        <Keyboard />
      </div>
      {showModal && <GameOverModal />}
    </div>
  );
}
