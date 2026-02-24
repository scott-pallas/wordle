import type { TileStatus } from '@/types/game';

interface KeyProps {
  letter: string;
  status: TileStatus | undefined;
  onClick: (letter: string) => void;
  wide?: boolean;
}

const statusBgClass: Record<TileStatus, string> = {
  correct: 'bg-[var(--color-correct)]',
  present: 'bg-[var(--color-present)]',
  absent: 'bg-[var(--color-absent)]',
  empty: 'bg-[var(--color-key-bg)]',
};

export default function Key({ letter, status, onClick, wide = false }: KeyProps) {
  const bg = status ? statusBgClass[status] : 'bg-[var(--color-key-bg)]';

  return (
    <button
      type="button"
      onClick={() => onClick(letter)}
      className={`flex items-center justify-center font-bold uppercase rounded text-white cursor-pointer select-none transition-colors
        h-14 sm:h-16 text-xs sm:text-sm
        ${wide ? 'px-4 sm:px-5 min-w-[58px] sm:min-w-[68px]' : 'w-8 sm:w-11'}
        ${bg}
      `}
    >
      {letter}
    </button>
  );
}
