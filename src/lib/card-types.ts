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

export const THEMES: Record<CardTheme, { name: string; emoji: string; description: string; bg: string; accent: string; text: string; premium?: boolean }> = {
  classic: { name: 'Classic Romance', emoji: '❤️', description: 'Red & pink hearts', bg: 'bg-gradient-to-br from-rose-100 to-pink-200', accent: 'text-rose-600', text: 'text-rose-900' },
  kawaii: { name: 'Cute & Kawaii', emoji: '🌸', description: 'Pastel cartoon style', bg: 'bg-gradient-to-br from-pink-100 to-purple-100', accent: 'text-pink-500', text: 'text-purple-800' },
  elegant: { name: 'Elegant Gold', emoji: '✨', description: 'Luxury gold accents', bg: 'bg-gradient-to-br from-amber-50 to-yellow-100', accent: 'text-amber-600', text: 'text-amber-900', premium: true },
  meme: { name: 'Funny/Meme', emoji: '😂', description: 'Playful & bold', bg: 'bg-gradient-to-br from-yellow-200 to-orange-200', accent: 'text-orange-600', text: 'text-orange-900' },
  darkmode: { name: 'Dark Mode Love', emoji: '🖤', description: 'Moody neon accents', bg: 'bg-gradient-to-br from-gray-900 to-purple-950', accent: 'text-pink-400', text: 'text-white', premium: true },
  retro: { name: 'Retro Valentine', emoji: '💌', description: 'Vintage vibes', bg: 'bg-gradient-to-br from-red-100 to-orange-100', accent: 'text-red-700', text: 'text-red-900' },
  minimalist: { name: 'Minimalist', emoji: '🤍', description: 'Clean & modern', bg: 'bg-gradient-to-br from-gray-50 to-gray-100', accent: 'text-gray-700', text: 'text-gray-900' },
  galaxy: { name: 'Galaxy Love', emoji: '🌌', description: 'Cosmic & starry', bg: 'bg-gradient-to-br from-indigo-950 to-purple-900', accent: 'text-cyan-400', text: 'text-white', premium: true },
};

export const TRICKS: Record<NoButtonTrick, { name: string; emoji: string; description: string }> = {
  runaway: { name: 'Runaway', emoji: '🏃', description: 'Button dodges the cursor' },
  shrinking: { name: 'Shrinking', emoji: '🔬', description: 'Gets smaller each click' },
  swap: { name: 'Swap', emoji: '🔄', description: 'Yes grows, No text changes desperately' },
  disguise: { name: 'Disguise', emoji: '🎭', description: 'No button becomes another Yes' },
};

export const STICKERS: Record<StickerType, { emoji: string; name: string; premium?: boolean }> = {
  heart: { emoji: '💖', name: 'Heart' },
  rose: { emoji: '🌹', name: 'Rose' },
  cupid: { emoji: '💘', name: 'Cupid Arrow' },
  sparkle: { emoji: '✨', name: 'Sparkle' },
  kiss: { emoji: '💋', name: 'Kiss' },
  ring: { emoji: '💍', name: 'Ring', premium: true },
  letter: { emoji: '💌', name: 'Love Letter' },
  teddy: { emoji: '🧸', name: 'Teddy Bear' },
  'love-bear': { emoji: '🐻', name: 'Love Bear' },
  'cute-cat': { emoji: '🐱', name: 'Cute Cat' },
  'heart-bunny': { emoji: '🐰', name: 'Heart Bunny' },
  'dancing-hearts': { emoji: '💞', name: 'Dancing Hearts', premium: true },
  'kissy-bear': { emoji: '🐻‍❄️', name: 'Kissy Bear', premium: true },
  'hug-bears': { emoji: '🤗', name: 'Hug Bears', premium: true },
  'love-penguin': { emoji: '🐧', name: 'Love Penguin', premium: true },
  'roses-for-you': { emoji: '💐', name: 'Roses For You', premium: true },
};
