'use client';

import { useGame } from '@/hooks/useGame';
import Key from './Key';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
];

export default function Keyboard() {
  const { state, dispatch } = useGame();
  const { keyStatuses } = state;

  function handleClick(key: string) {
    if (key === 'ENTER') {
      dispatch({ type: 'SUBMIT_GUESS' });
    } else if (key === 'DELETE') {
      dispatch({ type: 'DELETE_LETTER' });
    } else {
      dispatch({ type: 'ADD_LETTER', payload: { letter: key } });
    }
  }

  return (
    <div className="flex flex-col gap-1.5 items-center w-full">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 sm:gap-1.5">
          {row.map((key) => (
            <Key
              key={key}
              letter={key}
              status={key === 'ENTER' || key === 'DELETE' ? undefined : keyStatuses[key]}
              onClick={handleClick}
              wide={key === 'ENTER' || key === 'DELETE'}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
