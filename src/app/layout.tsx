import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { GameProvider } from '@/context/GameContext';
import { ToastProvider } from '@/context/ToastContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wordle Clone',
  description: 'A daily word guessing game. Guess the 5-letter word in 6 tries.',
  keywords: ['wordle', 'word game', 'puzzle', 'daily word'],
  openGraph: {
    title: 'Wordle Clone',
    description: 'Guess the daily 5-letter word in 6 tries.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <GameProvider>{children}</GameProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
