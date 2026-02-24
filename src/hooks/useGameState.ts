'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { getDailyWord, isValidWord, evaluateGuess, LetterStatus } from '@/lib/words';

export interface GameState {
  answer: string;
  guesses: string[];
  results: LetterStatus[][];
  currentGuess: string;
  gameStatus: 'playing' | 'won' | 'lost';
  invalidWord: boolean;
  showModal: boolean;
  keyStatuses: Record<string, LetterStatus>;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  resetGame: () => void;
}

export function useGameState(): GameState {
  const [answer, setAnswer] = useState<string>(getDailyWord);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterStatus[][]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [invalidWord, setInvalidWord] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const invalidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current);
    };
  }, []);

  const addLetter = useCallback((letter: string) => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => (prev.length < 5 ? prev + letter.toUpperCase() : prev));
  }, [gameStatus]);

  const removeLetter = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setCurrentGuess(prev => prev.slice(0, -1));
  }, [gameStatus]);

  const submitGuess = useCallback(() => {
    if (gameStatus !== 'playing') return;
    if (currentGuess.length !== 5) return;

    if (!isValidWord(currentGuess)) {
      setInvalidWord(true);
      if (invalidTimerRef.current) clearTimeout(invalidTimerRef.current);
      invalidTimerRef.current = setTimeout(() => setInvalidWord(false), 600);
      return;
    }

    const evaluation = evaluateGuess(currentGuess, answer);
    const newGuesses = [...guesses, currentGuess];
    const newResults = [...results, evaluation];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    if (evaluation.every(s => s === 'correct')) {
      setGameStatus('won');
      setShowModal(true);
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      setShowModal(true);
    }
  }, [gameStatus, currentGuess, answer, guesses, results]);

  const resetGame = useCallback(() => {
    setAnswer(getDailyWord());
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setInvalidWord(false);
    setShowModal(false);
  }, []);

  const keyStatuses = useMemo(() => {
    const statuses: Record<string, LetterStatus> = {};
    const priority: Record<LetterStatus, number> = {
      correct: 3,
      present: 2,
      absent: 1,
      empty: 0,
    };

    for (let g = 0; g < guesses.length; g++) {
      for (let i = 0; i < 5; i++) {
        const letter = guesses[g][i];
        const status = results[g][i];
        const current = statuses[letter] || 'empty';
        if (priority[status] > priority[current]) {
          statuses[letter] = status;
        }
      }
    }
    return statuses;
  }, [guesses, results]);

  return {
    answer,
    guesses,
    results,
    currentGuess,
    gameStatus,
    invalidWord,
    showModal,
    keyStatuses,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
  };
}
