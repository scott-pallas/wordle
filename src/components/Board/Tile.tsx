'use client';

import { useState, useEffect } from 'react';
import type { TileStatus } from '@/types/game';

interface TileProps {
  letter: string;
  status: TileStatus | 'tbd';
  isRevealing: boolean;
  revealDelay?: number;
}

export default function Tile({ letter, status, isRevealing, revealDelay = 0 }: TileProps) {
  const [revealed, setRevealed] = useState(false);
  const [popping, setPopping] = useState(false);

  // Flip midpoint: reveal color after delay + half of 500ms flip
  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => setRevealed(true), revealDelay + 250);
      return () => clearTimeout(timer);
    }
    // Already submitted rows start revealed
    if (status !== 'empty' && status !== 'tbd') {
      setRevealed(true);
    }
  }, [isRevealing, revealDelay, status]);

  // Pop animation when a letter is typed into a tbd tile
  useEffect(() => {
    if (status === 'tbd' && letter) {
      setPopping(true);
      const timer = setTimeout(() => setPopping(false), 100);
      return () => clearTimeout(timer);
    }
  }, [letter, status]);

  // Determine visual status: before reveal midpoint, show as tbd
  const visualStatus = isRevealing && !revealed ? 'tbd' : status;

  const baseClasses =
    'flex items-center justify-center font-bold text-xl sm:text-2xl uppercase select-none border-2 w-12 h-12 sm:w-14 sm:h-14 transition-colors';

  let statusClasses: string;
  switch (visualStatus) {
    case 'empty':
      statusClasses = 'border-[var(--color-tile-border)]/30';
      break;
    case 'tbd':
      statusClasses = 'border-[var(--color-tile-border)] text-white';
      break;
    case 'correct':
      statusClasses = 'bg-[var(--color-correct)] border-[var(--color-correct)] text-white';
      break;
    case 'present':
      statusClasses = 'bg-[var(--color-present)] border-[var(--color-present)] text-white';
      break;
    case 'absent':
      statusClasses = 'bg-[var(--color-absent)] border-[var(--color-absent)] text-white';
      break;
    default:
      statusClasses = '';
  }

  const animationClasses = [
    isRevealing ? 'animate-flip-tile' : '',
    popping ? 'animate-pop' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      data-testid="tile"
      className={`${baseClasses} ${statusClasses} ${animationClasses}`}
      style={isRevealing ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
