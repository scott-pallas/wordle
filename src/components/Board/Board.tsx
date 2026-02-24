'use client';

import { useGame } from '@/hooks/useGame';
import Row from './Row';

export default function Board() {
  const { state } = useGame();
  const { board, currentRow, revealingRow, invalidWord } = state;

  return (
    <section aria-label="Wordle board" data-testid="board">
      <div className="flex flex-col gap-1.5 items-center justify-center">
        {board.map((tiles, i) => (
          <Row
            key={i}
            tiles={tiles}
            isCurrentRow={i === currentRow}
            isRevealing={revealingRow === i}
            isInvalid={i === currentRow && invalidWord}
          />
        ))}
      </div>
    </section>
  );
}
