import type { LetterStatus } from '@/lib/words';

interface KeyProps {
  label: string;
  status?: LetterStatus;
  onClick: () => void;
  wide?: boolean;
}

const statusClasses: Record<string, string> = {
  correct: 'bg-green-600 text-white',
  present: 'bg-yellow-500 text-white',
  absent: 'bg-zinc-600 text-white',
};

export default function Key({ label, status, onClick, wide }: KeyProps) {
  const colorClass = status && statusClasses[status]
    ? statusClasses[status]
    : 'bg-zinc-500 text-white hover:bg-zinc-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center font-bold uppercase rounded cursor-pointer select-none transition-colors
        h-14 sm:h-16 text-sm sm:text-base
        ${wide ? 'w-16 sm:w-20' : 'w-9 sm:w-11'}
        ${colorClass}
      `}
    >
      {label}
    </button>
  );
}
