import type { LetterStatus } from '@/lib/words';
import Key from './Key';

interface KeyboardProps {
  keyStatuses: Record<string, LetterStatus>;
  onLetter: (l: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function Keyboard({ keyStatuses, onLetter, onBackspace, onEnter }: KeyboardProps) {
  return (
    <div className="flex flex-col gap-1.5 items-center w-full px-1">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 sm:gap-1.5">
          {row.map(key => {
            const isEnter = key === 'ENTER';
            const isBackspace = key === '⌫';
            const wide = isEnter || isBackspace;

            const handleClick = () => {
              if (isEnter) onEnter();
              else if (isBackspace) onBackspace();
              else onLetter(key);
            };

            return (
              <Key
                key={key}
                label={key}
                status={keyStatuses[key]}
                onClick={handleClick}
                wide={wide}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
