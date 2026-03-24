export interface FlowerType {
  id: string;
  name: string;
  image: string;
  color: string;
  botanicalName: string;
  symbolism: string;
  season: string;
  month: string;
  note: string;
}

export interface PlacedFlower {
  id: string;
  flowerId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
}

export interface BouquetConfig {
  placedFlowers: PlacedFlower[];
  ribbonColor: string;
  messageCard: boolean;
  messageText: string;
  bouquetIntent: string;
  wrappingStyle?: string;
  wrappingColor?: string;
  wrappingPattern: string;
  bowStyle: string;
  arrangementStyle: 'classic' | 'tight' | 'wild' | 'custom';
  greeneryStyle: 'none' | 'eucalyptus' | 'ferns' | 'mixed';
}

export const FLOWERS: FlowerType[] = [
  { id: 'red-rose', name: 'Red Rose', image: '/flowers/red-rose.png', color: '#e11d48', botanicalName: 'Rosa', symbolism: 'devotion, desire, courage', season: 'Late spring to early summer', month: 'June', note: 'Often chosen when the feeling is direct, certain, and impossible to miss.' },
  { id: 'pink-rose', name: 'Pink Rose', image: '/flowers/pink-rose.png', color: '#ec4899', botanicalName: 'Rosa', symbolism: 'admiration, sweetness, gratitude', season: 'Late spring to early summer', month: 'October', note: 'A softer romantic gesture that says affection with warmth instead of drama.' },
  { id: 'white-rose', name: 'White Rose', image: '/flowers/white-rose.png', color: '#f1f5f9', botanicalName: 'Rosa', symbolism: 'sincerity, new beginnings, quiet loyalty', season: 'Late spring to early summer', month: 'January', note: 'Used when the bouquet should feel honest, calm, and deeply intentional.' },
  { id: 'tulip', name: 'Tulip', image: '/flowers/tulip.png', color: '#f472b6', botanicalName: 'Tulipa', symbolism: 'perfect love, grace, renewal', season: 'Early to mid spring', month: 'April', note: 'Tulips give a bouquet lift and optimism, like a feeling just coming into bloom.' },
  { id: 'sunflower', name: 'Sunflower', image: '/flowers/sunflower.png', color: '#fbbf24', botanicalName: 'Helianthus annuus', symbolism: 'joy, loyalty, warmth', season: 'High summer to early autumn', month: 'August', note: 'Chosen when the sender wants the bouquet to feel bright, open, and impossible not to smile at.' },
  { id: 'daisy', name: 'Daisy', image: '/flowers/daisy.png', color: '#fde68a', botanicalName: 'Bellis perennis', symbolism: 'innocence, cheer, honesty', season: 'Spring to early summer', month: 'April', note: 'Daisies keep the bouquet fresh and unforced, like affection without performance.' },
  { id: 'lily', name: 'Lily', image: '/flowers/lily.png', color: '#fdf2f8', botanicalName: 'Lilium', symbolism: 'purity, admiration, dignity', season: 'Early to mid summer', month: 'May', note: 'Lilies make an arrangement feel ceremonial and composed.' },
  { id: 'orchid', name: 'Orchid', image: '/flowers/orchid.png', color: '#a855f7', botanicalName: 'Orchidaceae', symbolism: 'rarity, beauty, fascination', season: 'Varies by variety; often winter to spring indoors', month: 'February', note: 'Orchids add a sense of rarity, as if the bouquet was made for one specific person.' },
  { id: 'peony', name: 'Peony', image: '/flowers/peony.png', color: '#fb7185', botanicalName: 'Paeonia', symbolism: 'romance, abundance, tenderness', season: 'Late spring', month: 'May', note: 'Peonies make the bouquet feel lush, generous, and openly romantic.' },
  { id: 'lavender', name: 'Lavender', image: '/flowers/lavender.png', color: '#c084fc', botanicalName: 'Lavandula', symbolism: 'calm, memory, devotion', season: 'Summer', month: 'July', note: 'Lavender suggests a love that is thoughtful, grounding, and remembered.' },
  { id: 'hydrangea', name: 'Hydrangea', image: '/flowers/hydrangea.png', color: '#818cf8', botanicalName: 'Hydrangea macrophylla', symbolism: 'understanding, heartfelt emotion, fullness', season: 'Summer to early autumn', month: 'November', note: 'Hydrangeas add volume and emotional richness, like feelings that have quietly grown over time.' },
  { id: 'anemone', name: 'Anemone', image: '/flowers/anemone.png', color: '#f97316', botanicalName: 'Anemone coronaria', symbolism: 'anticipation, sincerity, protection', season: 'Spring', month: 'March', note: 'Anemones bring contrast and energy, perfect for bouquets with a little spark to them.' },
];

export const WRAP_STYLES = [
  { id: 'cone', name: 'Cone', preview: 'bg-[linear-gradient(180deg,rgba(255,250,244,1),rgba(245,234,223,1))]' },
  { id: 'layered', name: 'Layered', preview: 'bg-[linear-gradient(135deg,rgba(255,250,244,1),rgba(249,215,221,1))]' },
  { id: 'market', name: 'Market', preview: 'bg-[linear-gradient(180deg,rgba(241,225,190,1),rgba(201,157,89,1))]' },
  { id: 'none', name: 'None', preview: 'bg-transparent border-0 shadow-none' },
] as const;

export const WRAP_COLORS = [
  { id: 'kraft', name: 'Kraft', preview: 'bg-gradient-to-b from-amber-100 to-amber-200' },
  { id: 'ivory', name: 'Ivory', preview: 'bg-gradient-to-b from-[hsl(40,33%,97%)] to-[hsl(38,40%,94%)]' },
  { id: 'sage', name: 'Sage', preview: 'bg-gradient-to-b from-[hsl(90,12%,82%)] to-[hsl(90,12%,72%)]' },
  { id: 'blush', name: 'Blush', preview: 'bg-gradient-to-b from-[hsl(8,35%,90%)] to-[hsl(8,35%,85%)]' },
  { id: 'charcoal', name: 'Charcoal', preview: 'bg-gradient-to-b from-neutral-700 to-neutral-800' },
] as const;

export const BOW_STYLES = [
  { id: 'classic', name: 'Satin', color: 'hsl(352,36%,38%)' },
  { id: 'ribbon', name: 'Twine', color: 'hsl(33,50%,58%)' },
  { id: 'minimal', name: 'None', color: 'transparent' },
];

export const DEFAULT_BOUQUET: BouquetConfig = {
  placedFlowers: [],
  ribbonColor: '#ec4899',
  messageCard: false,
  messageText: '',
  bouquetIntent: '',
  wrappingStyle: 'cone',
  wrappingColor: 'kraft',
  wrappingPattern: 'kraft',
  bowStyle: 'classic',
  arrangementStyle: 'custom',
  greeneryStyle: 'mixed',
};
