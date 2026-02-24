export default function Header() {
  return (
    <header className="w-full border-b border-zinc-700 flex items-center justify-between px-4 py-3">
      <div className="w-8" />
      <h1 className="text-2xl font-bold tracking-widest uppercase text-white">
        Wordle
      </h1>
      <button
        type="button"
        className="w-8 h-8 rounded-full border-2 border-zinc-500 flex items-center justify-center text-zinc-400 text-sm font-bold"
        aria-label="Help"
      >
        ?
      </button>
    </header>
  );
}
