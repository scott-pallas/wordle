'use client';

import type { TileState } from '@/types/game';
import Tile from './Tile';

interface RowProps {
  tiles: TileState[];
  isCurrentRow: boolean;
  isRevealing: boolean;
  isInvalid: boolean;
}

export default function Row({ tiles, isCurrentRow, isRevealing, isInvalid }: RowProps) {
  return (
    <div
      data-testid="row"
      className={`flex gap-1.5 ${isInvalid ? 'animate-shake' : ''}`}
    >
      {tiles.map((tile, index) => {
        // Determine tile status for display:
        // - empty with no letter -> 'empty'
        // - empty with a letter (current row being typed) -> 'tbd'
        // - otherwise use the evaluated status
        let displayStatus: 'correct' | 'present' | 'absent' | 'empty' | 'tbd';
        if (tile.status === 'empty' && tile.letter) {
          displayStatus = 'tbd';
        } else {
          displayStatus = tile.status;
        }

        return (
          <Tile
            key={index}
            letter={tile.letter}
            status={displayStatus}
            isRevealing={isRevealing}
            revealDelay={index * 300}
          />
        );
      })}
    </div>
  );
}
