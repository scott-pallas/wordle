import type { LetterStatus } from '@/lib/words';

interface TileProps {
  letter: string;
  status: LetterStatus;
  isActive?: boolean;
  animate?: boolean;
}

const statusClasses: Record<LetterStatus, string> = {
  correct: 'bg-green-600 text-white border-transparent',
  present: 'bg-yellow-500 text-white border-transparent',
  absent: 'bg-zinc-600 text-white border-transparent',
  empty: 'bg-transparent text-white border-zinc-600',
};

export default function Tile({ letter, status, isActive, animate }: TileProps) {
  return (
    <div
      className={`flex items-center justify-center font-bold uppercase select-none border-2 transition-all
        w-12 h-12 text-lg sm:w-14 sm:h-14 sm:text-xl
        ${statusClasses[status]}
        ${isActive && letter ? 'scale-105' : ''}
        ${animate ? 'tile-flip' : ''}
      `}
    >
      {letter}
    </div>
  );
}
