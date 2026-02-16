export type CardTheme =
  | 'classic'
  | 'kawaii'
  | 'elegant'
  | 'meme'
  | 'darkmode'
  | 'retro'
  | 'minimalist'
  | 'galaxy';

export type NoButtonTrick = 'runaway' | 'shrinking' | 'swap' | 'disguise';

export type StickerType = 'heart' | 'rose' | 'cupid' | 'sparkle' | 'kiss' | 'ring' | 'letter' | 'teddy' | 'love-bear' | 'cute-cat' | 'heart-bunny' | 'dancing-hearts' | 'kissy-bear' | 'hug-bears' | 'love-penguin' | 'roses-for-you';

export interface StickerPlacement {
  type: StickerType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CrushCard {
  id?: string;
  theme: CardTheme;
  question: string;
  yesMessage: string;
  noButtonTrick: NoButtonTrick;
  stickers: StickerPlacement[];
  recipientName?: string;
  senderName?: string;
  paid?: boolean;
}

export const THEMES: Record<CardTheme, { name: string; description: string; bg: string; accent: string; text: string }> = {
  classic: { name: 'Classic Romance', description: 'Red & pink hearts', bg: 'bg-gradient-to-br from-rose-100 to-pink-200', accent: 'text-rose-600', text: 'text-rose-900' },
  kawaii: { name: 'Cute & Kawaii', description: 'Pastel cartoon style', bg: 'bg-gradient-to-br from-pink-100 to-purple-100', accent: 'text-pink-500', text: 'text-purple-800' },
  elegant: { name: 'Elegant Gold', description: 'Luxury gold accents', bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', accent: 'text-amber-600', text: 'text-amber-900' },
  meme: { name: 'Funny/Meme', description: 'Playful & bold', bg: 'bg-gradient-to-br from-yellow-200 to-orange-200', accent: 'text-orange-600', text: 'text-orange-900' },
  darkmode: { name: 'Dark Mode Love', description: 'Moody neon accents', bg: 'bg-gradient-to-br from-gray-900 to-purple-950', accent: 'text-pink-400', text: 'text-white' },
  retro: { name: 'Retro Valentine', description: 'Vintage vibes', bg: 'bg-gradient-to-br from-red-100 to-orange-100', accent: 'text-red-700', text: 'text-red-900' },
  minimalist: { name: 'Minimalist', description: 'Clean & modern', bg: 'bg-gradient-to-br from-gray-50 to-gray-100', accent: 'text-gray-700', text: 'text-gray-900' },
  galaxy: { name: 'Galaxy Love', description: 'Cosmic & starry', bg: 'bg-gradient-to-br from-indigo-950 to-purple-900', accent: 'text-cyan-400', text: 'text-white' },
};

export const TRICKS: Record<NoButtonTrick, { name: string; description: string }> = {
  runaway: { name: 'Runaway', description: 'Button dodges the cursor' },
  shrinking: { name: 'Shrinking', description: 'Gets smaller each click' },
  swap: { name: 'Swap', description: 'Yes grows, No text changes desperately' },
  disguise: { name: 'Disguise', description: 'No button becomes another Yes' },
};

export const STICKERS: Record<StickerType, { name: string; image: string }> = {
  heart: { name: 'Heart', image: '/stickers/heart.png' },
  rose: { name: 'Rose', image: '/stickers/rose.png' },
  cupid: { name: 'Cupid Arrow', image: '/stickers/cupid.png' },
  sparkle: { name: 'Sparkle', image: '/stickers/sparkle.png' },
  kiss: { name: 'Kiss', image: '/stickers/kiss.png' },
  ring: { name: 'Ring', image: '/stickers/ring.png' },
  letter: { name: 'Love Letter', image: '/stickers/letter.png' },
  teddy: { name: 'Teddy Bear', image: '/stickers/teddy.png' },
  'love-bear': { name: 'Love Bear', image: '/stickers/love-bear.png' },
  'cute-cat': { name: 'Cute Cat', image: '/stickers/cute-cat.png' },
  'heart-bunny': { name: 'Heart Bunny', image: '/stickers/heart-bunny.png' },
  'dancing-hearts': { name: 'Dancing Hearts', image: '/stickers/dancing-hearts.png' },
  'kissy-bear': { name: 'Kissy Bear', image: '/stickers/kissy-bear.png' },
  'hug-bears': { name: 'Hug Bears', image: '/stickers/hug-bears.png' },
  'love-penguin': { name: 'Love Penguin', image: '/stickers/love-penguin.png' },
  'roses-for-you': { name: 'Roses For You', image: '/stickers/roses-for-you.png' },
};
