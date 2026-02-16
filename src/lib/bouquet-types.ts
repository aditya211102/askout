export interface FlowerType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  premium: boolean;
}

export interface BouquetConfig {
  flowers: string[]; // flower ids
  ribbonColor: string;
  messageCard: boolean;
  messageText: string;
  wrappingPattern: string;
  bowStyle: string;
}

export const FLOWERS: FlowerType[] = [
  { id: 'red-rose', name: 'Red Rose', emoji: '🌹', color: '#e11d48', premium: false },
  { id: 'pink-rose', name: 'Pink Rose', emoji: '🌸', color: '#ec4899', premium: false },
  { id: 'white-rose', name: 'White Rose', emoji: '🤍', color: '#f1f5f9', premium: false },
  { id: 'tulip', name: 'Tulip', emoji: '🌷', color: '#f472b6', premium: false },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', color: '#fbbf24', premium: false },
  { id: 'daisy', name: 'Daisy', emoji: '🌼', color: '#fde68a', premium: false },
  { id: 'lily', name: 'Lily', emoji: '💮', color: '#fdf2f8', premium: true },
  { id: 'orchid', name: 'Orchid', emoji: '🪻', color: '#a855f7', premium: true },
  { id: 'peony', name: 'Peony', emoji: '🏵️', color: '#fb7185', premium: true },
  { id: 'lavender', name: 'Lavender', emoji: '💜', color: '#c084fc', premium: true },
  { id: 'hydrangea', name: 'Hydrangea', emoji: '💐', color: '#818cf8', premium: true },
  { id: 'exotic', name: 'Exotic Mix', emoji: '🌺', color: '#f97316', premium: true },
];

export const WRAPPING_PATTERNS = [
  { id: 'solid', name: 'Solid', preview: 'bg-gradient-to-b from-sm-cream to-sm-blush' },
  { id: 'dots', name: 'Polka Dots', preview: 'bg-sm-blush' },
  { id: 'stripes', name: 'Stripes', preview: 'bg-gradient-to-r from-sm-blush via-white to-sm-blush' },
  { id: 'floral', name: 'Floral', preview: 'bg-gradient-to-br from-sm-peach to-sm-lavender' },
  { id: 'kraft', name: 'Kraft', preview: 'bg-gradient-to-b from-amber-100 to-amber-200' },
];

export const BOW_STYLES = [
  { id: 'classic', name: 'Classic', emoji: '🎀' },
  { id: 'ribbon', name: 'Ribbon', emoji: '🎗️' },
  { id: 'minimal', name: 'Minimal', emoji: '✨' },
];

export const DEFAULT_BOUQUET: BouquetConfig = {
  flowers: [],
  ribbonColor: '#ec4899',
  messageCard: false,
  messageText: '',
  wrappingPattern: 'solid',
  bowStyle: 'classic',
};
