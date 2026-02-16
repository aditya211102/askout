export interface FlowerType {
  id: string;
  name: string;
  image: string;
  color: string;
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
  { id: 'red-rose', name: 'Red Rose', image: '/flowers/red-rose.png', color: '#e11d48' },
  { id: 'pink-rose', name: 'Pink Rose', image: '/flowers/pink-rose.png', color: '#ec4899' },
  { id: 'white-rose', name: 'White Rose', image: '/flowers/white-rose.png', color: '#f1f5f9' },
  { id: 'tulip', name: 'Tulip', image: '/flowers/tulip.png', color: '#f472b6' },
  { id: 'sunflower', name: 'Sunflower', image: '/flowers/sunflower.png', color: '#fbbf24' },
  { id: 'daisy', name: 'Daisy', image: '/flowers/daisy.png', color: '#fde68a' },
  { id: 'lily', name: 'Lily', image: '/flowers/lily.png', color: '#fdf2f8' },
  { id: 'orchid', name: 'Orchid', image: '/flowers/orchid.png', color: '#a855f7' },
  { id: 'peony', name: 'Peony', image: '/flowers/peony.png', color: '#fb7185' },
  { id: 'lavender', name: 'Lavender', image: '/flowers/lavender.png', color: '#c084fc' },
  { id: 'hydrangea', name: 'Hydrangea', image: '/flowers/hydrangea.png', color: '#818cf8' },
  { id: 'anemone', name: 'Anemone', image: '/flowers/anemone.png', color: '#f97316' },
];

export const WRAPPING_PATTERNS = [
  { id: 'kraft', name: 'Kraft', preview: 'bg-gradient-to-b from-amber-100 to-amber-200' },
  { id: 'ivory', name: 'Ivory', preview: 'bg-gradient-to-b from-[hsl(40,33%,97%)] to-[hsl(38,40%,94%)]' },
  { id: 'sage', name: 'Sage', preview: 'bg-gradient-to-b from-[hsl(90,12%,82%)] to-[hsl(90,12%,72%)]' },
  { id: 'blush', name: 'Blush', preview: 'bg-gradient-to-b from-[hsl(8,35%,90%)] to-[hsl(8,35%,85%)]' },
  { id: 'charcoal', name: 'Charcoal', preview: 'bg-gradient-to-b from-neutral-700 to-neutral-800' },
];

export const BOW_STYLES = [
  { id: 'classic', name: 'Satin', color: 'hsl(352,36%,38%)' },
  { id: 'ribbon', name: 'Twine', color: 'hsl(33,50%,58%)' },
  { id: 'minimal', name: 'None', color: 'transparent' },
];

export const DEFAULT_BOUQUET: BouquetConfig = {
  flowers: [],
  ribbonColor: '#ec4899',
  messageCard: false,
  messageText: '',
  wrappingPattern: 'kraft',
  bowStyle: 'classic',
};
