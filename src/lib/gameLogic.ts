import type { TileStatus } from '../types/game';
import { VALID_WORDS, DAILY_WORDS } from './words';

// Build a combined Set for O(1) word lookup
const wordSet = new Set<string>([
  ...VALID_WORDS,
  ...DAILY_WORDS,
]);

/**
 * Returns today's daily word (uppercase) using a deterministic epoch-based index.
 */
export function getDailyWord(): string {
  const epoch = Date.UTC(2024, 0, 1); // 2024-01-01 UTC
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayIndex = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
  return DAILY_WORDS[dayIndex % DAILY_WORDS.length].toUpperCase();
}

/**
 * Evaluates a guess against a target word using the standard Wordle two-pass algorithm.
 * Returns an array of 5 TileStatus values.
 */
export function evaluateGuess(guess: string, target: string): TileStatus[] {
  const g = guess.toUpperCase();
  const t = target.toUpperCase();
  const result: TileStatus[] = Array(5).fill('absent');

  // Build frequency map of target letters
  const freq: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    freq[t[i]] = (freq[t[i]] || 0) + 1;
  }

  // Pass 1: Mark correct positions
  for (let i = 0; i < 5; i++) {
    if (g[i] === t[i]) {
      result[i] = 'correct';
      freq[g[i]]--;
    }
  }

  // Pass 2: Mark present letters
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;
    if (freq[g[i]] && freq[g[i]] > 0) {
      result[i] = 'present';
      freq[g[i]]--;
    }
  }

  return result;
}

/**
 * Returns true if the word is a valid 5-letter English word (case-insensitive).
 */
export function isValidWord(word: string): boolean {
  return wordSet.has(word.toLowerCase());
}
