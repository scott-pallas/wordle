interface ModalProps {
  show: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
  answer: string;
  guessCount: number;
  onClose: () => void;
}

export default function Modal({ show, gameStatus, answer, guessCount, onClose }: ModalProps) {
  if (!show) return null;

  const won = gameStatus === 'won';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-xl p-8 flex flex-col items-center gap-4 text-white text-center shadow-2xl">
        <h2 className="text-2xl font-bold">
          {won ? 'You Won! 🎉' : 'Game Over'}
        </h2>
        <p className="text-lg">
          {won
            ? `Solved in ${guessCount}/6`
            : 'Better luck next time!'}
        </p>
        <p className="text-3xl font-bold tracking-widest">{answer}</p>
        <button
          type="button"
          onClick={onClose}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
