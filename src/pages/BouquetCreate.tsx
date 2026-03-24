import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FLOWERS,
  WRAP_COLORS,
  WRAP_STYLES,
  BOW_STYLES,
  DEFAULT_BOUQUET,
  type BouquetConfig,
  type PlacedFlower
} from '@/lib/bouquet-types';
import type { PlanType } from '@/components/PlanDialog';
import PlanDialog from '@/components/PlanDialog';
import BouquetPreview from '@/components/BouquetPreview';

const SMART_POSITIONS = [
  { x: 0, y: -62, rotation: 0, scale: 1.08 },
  { x: -44, y: -34, rotation: -12, scale: 1.02 },
  { x: 44, y: -34, rotation: 12, scale: 1.02 },
  { x: -76, y: -2, rotation: -20, scale: 0.98 },
  { x: 76, y: -2, rotation: 20, scale: 0.98 },
  { x: -26, y: 8, rotation: -8, scale: 0.96 },
  { x: 26, y: 8, rotation: 8, scale: 0.96 },
  { x: -56, y: 30, rotation: -14, scale: 0.94 },
  { x: 56, y: 30, rotation: 14, scale: 0.94 },
  { x: 0, y: 36, rotation: 0, scale: 0.92 },
];

const createSmartFlowerPlacement = (flowerId: string, count: number): Pick<PlacedFlower, 'x' | 'y' | 'rotation' | 'scale'> => {
  const base = SMART_POSITIONS[count % SMART_POSITIONS.length];
  const ring = Math.floor(count / SMART_POSITIONS.length);
  const xOffset = (Math.random() - 0.5) * (12 + ring * 6);
  const yOffset = (Math.random() - 0.5) * (10 + ring * 4);
  const isTulip = flowerId === 'tulip';
  const rotationOffset = (Math.random() - 0.5) * (isTulip ? 3 : 8);
  const baseRotation = isTulip ? 0 : base.rotation;

  return {
    x: base.x + xOffset,
    y: base.y + yOffset + ring * 8,
    rotation: baseRotation + rotationOffset,
    scale: Math.max(0.88, Math.min(1.12, base.scale + (Math.random() - 0.5) * 0.06)),
  };
};

const GREENERY_OPTIONS: Array<{ id: BouquetConfig['greeneryStyle']; label: string; description: string }> = [
  { id: 'mixed', label: 'Mixed', description: 'Balanced and lush' },
  { id: 'eucalyptus', label: 'Eucalyptus', description: 'Soft rounded leaves' },
  { id: 'ferns', label: 'Fern', description: 'Airy structured texture' },
  { id: 'none', label: 'None', description: 'Flowers only' },
];

const BouquetCreate = () => {
  const navigate = useNavigate();
  const [bouquet, setBouquet] = useState<BouquetConfig>({ ...DEFAULT_BOUQUET });
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const selectedFlowerSummaries = useMemo(() => {
    const uniqueFlowerIds = Array.from(new Set(bouquet.placedFlowers.map((flower) => flower.flowerId)));
    return uniqueFlowerIds
      .map((flowerId) => FLOWERS.find((flower) => flower.id === flowerId))
      .filter((flower): flower is NonNullable<typeof flower> => Boolean(flower));
  }, [bouquet.placedFlowers]);

  const addFlower = (flowerId: string) => {
    setBouquet((prev) => {
      // Allow up to 20 placed flowers in the canvas
      if (prev.placedFlowers.length >= 20) return prev;

      const placement = createSmartFlowerPlacement(flowerId, prev.placedFlowers.length);
      const newFlower: PlacedFlower = {
        id: crypto.randomUUID(),
        flowerId,
        x: placement.x,
        y: placement.y,
        rotation: placement.rotation,
        scale: placement.scale,
        zIndex: prev.placedFlowers.length + 10,
      };

      return {
        ...prev,
        placedFlowers: [...prev.placedFlowers, newFlower],
      };
    });
  };

  const removeFlower = (id: string) => {
    setBouquet((prev) => ({
      ...prev,
      placedFlowers: prev.placedFlowers.filter(f => f.id !== id)
    }));
  };

  const updateFlower = (id: string, updates: Partial<PlacedFlower>) => {
    setBouquet((prev) => ({
      ...prev,
      placedFlowers: prev.placedFlowers.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const moveFlowerLayer = (id: string, direction: 'forward' | 'backward') => {
    setBouquet((prev) => {
      const ordered = [...prev.placedFlowers].sort((a, b) => a.zIndex - b.zIndex);
      const index = ordered.findIndex((flower) => flower.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === 'forward'
        ? Math.min(ordered.length - 1, index + 1)
        : Math.max(0, index - 1);

      if (targetIndex === index) return prev;

      const [flower] = ordered.splice(index, 1);
      ordered.splice(targetIndex, 0, flower);

      const normalized = ordered.map((item, normalizedIndex) => ({
        ...item,
        zIndex: normalizedIndex + 10,
      }));

      return { ...prev, placedFlowers: normalized };
    });
  };

  const randomizeArrangement = () => {
    setBouquet((prev) => {
      const shuffled = [...prev.placedFlowers]
        .map((flower) => ({ flower, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ flower }, index) => {
          const placement = createSmartFlowerPlacement(flower.flowerId, index);
          return {
            ...flower,
            x: placement.x,
            y: placement.y,
            rotation: placement.rotation,
            scale: placement.scale,
            zIndex: index + 10,
          };
        });

      return {
        ...prev,
        placedFlowers: shuffled,
      };
    });
  };

  const handlePlanSelect = (plan: PlanType) => {
    localStorage.setItem('pendingCard', JSON.stringify({
      productType: 'bouquet', bouquetData: bouquet, recipientName, senderName,
      question: `A bouquet for ${recipientName || 'you'}`,
      yesMessage: bouquet.messageText || 'Enjoy these flowers!',
    }));
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingProductType', 'bouquet');
    setShowPlanDialog(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] relative texture-grain">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#faf9f7]/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-foreground hover:text-warm-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono-label">Back</span>
          </button>
          <span className="font-display text-sm text-muted-foreground italic tracking-wide">The Digital Atelier</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight italic text-foreground">
            Build your bouquet
          </h1>
        </div>

        {/* Flower Grid - Exact match of screenshot */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-16 gap-x-4 max-w-3xl mx-auto mb-16 pt-6 overflow-visible">
          {FLOWERS.map((flower) => {
            const count = bouquet.placedFlowers.filter(f => f.flowerId === flower.id).length;
            const isSelected = count > 0;
            return (
              <motion.button
                key={flower.id}
                onClick={() => addFlower(flower.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative z-0 aspect-square flex items-center justify-center rounded-full transition-all duration-500 mx-auto w-24 h-24 hover:z-[120] focus-within:z-[120] ${isSelected ? 'ring-[1px] ring-foreground/20 ring-offset-2' : ''}`}
              >
                <img
                  src={flower.image}
                  alt={flower.name}
                  className={`w-full h-full object-contain transition-all duration-300 ${isSelected ? 'opacity-100 scale-105' : 'opacity-90 hover:opacity-100'}`}
                />
                <div className="pointer-events-none absolute left-1/2 top-full z-[80] hidden w-[170px] -translate-x-1/2 pt-3 group-hover:block group-focus-within:block">
                  <div className="rounded-[14px] border border-[#3d352c] bg-[#fffaf1] px-3 py-2 text-center shadow-[0_12px_24px_rgba(52,39,24,0.12)]">
                    <p className="font-mono-label text-[11px] tracking-[0.16em] text-foreground">{flower.name.toUpperCase()}</p>
                    <p className="mt-1 text-xs text-foreground/80">{flower.symbolism}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Month: {flower.month}</p>
                  </div>
                </div>
                <span className="absolute -bottom-8 font-mono-label text-[10px] text-muted-foreground whitespace-nowrap uppercase tracking-widest">
                  {flower.name}
                </span>
                {isSelected && count > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full text-[10px] flex items-center justify-center font-bold">
                    {count}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="text-center mb-16 border-b border-border/50 pb-16 max-w-4xl mx-auto">
          <span className="font-mono-label text-muted-foreground tracking-widest text-[11px]">
            {bouquet.placedFlowers.length} / 20 SELECTED
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr,450px] gap-12 max-w-6xl mx-auto">
          {/* Controls */}
          <div className="space-y-12">

            {/* Names */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Dedications</p>
              <div className="grid grid-cols-2 gap-4">
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Recipient's Name" maxLength={50} className="bg-white border-[#e8e0d5] h-12 rounded-xl focus-visible:ring-warm-wine/30" />
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your Name" maxLength={50} className="bg-white border-[#e8e0d5] h-12 rounded-xl focus-visible:ring-warm-wine/30" />
              </div>
            </div>

            {/* Wrapping */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Wrapping Paper Design</p>
              <div className="flex flex-wrap gap-3">
                {WRAP_STYLES.map((wrapStyle) => (
                  <button
                    key={wrapStyle.id}
                    onClick={() => setBouquet((p) => ({ ...p, wrappingStyle: wrapStyle.id }))}
                    className={`flex h-16 min-w-[86px] items-center justify-center rounded-xl border-2 px-4 transition-all shadow-sm ${wrapStyle.preview} ${(bouquet.wrappingStyle || 'cone') === wrapStyle.id ? 'border-foreground shadow-md scale-105' : 'border-transparent hover:scale-105 hover:shadow-md'}`}
                    title={wrapStyle.name}
                  >
                    <span className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-foreground/80">{wrapStyle.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Wrapping Paper Color</p>
              <div className="flex flex-wrap gap-3">
                {WRAP_COLORS.map((wrapColor) => (
                  <button
                    key={wrapColor.id}
                    onClick={() => setBouquet((p) => ({ ...p, wrappingColor: wrapColor.id }))}
                    className={`h-16 w-16 rounded-xl border-2 transition-all shadow-sm ${wrapColor.preview} ${(bouquet.wrappingColor || 'kraft') === wrapColor.id ? 'border-foreground shadow-md scale-105' : 'border-transparent hover:scale-105 hover:shadow-md'}`}
                    title={wrapColor.name}
                  />
                ))}
              </div>
            </div>

            {/* Bow */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Ribbon</p>
              <div className="flex flex-wrap gap-3">
                {BOW_STYLES.map((bow) => (
                  <button
                    key={bow.id}
                    onClick={() => setBouquet((p) => ({ ...p, bowStyle: bow.id }))}
                    className={`px-8 py-4 rounded-xl border bg-white shadow-sm transition-all ${bouquet.bowStyle === bow.id ? 'border-foreground ring-1 ring-foreground/10' : 'border-[#e8e0d5] hover:border-foreground/30'}`}
                  >
                    <div
                      className="w-10 h-3 flex gap-1 mx-auto mb-2"
                    >
                      <div className="flex-1 rounded-l-full" style={{ backgroundColor: bow.color }} />
                      <div className="flex-1 rounded-r-full" style={{ backgroundColor: bow.color }} />
                    </div>
                    <span className="font-mono-label text-xs text-muted-foreground">{bow.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Greenery</p>
              <div className="grid grid-cols-2 gap-3">
                {GREENERY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setBouquet((prev) => ({ ...prev, greeneryStyle: option.id }))}
                    className={`rounded-xl border bg-white p-4 text-left shadow-sm transition-all ${
                      bouquet.greeneryStyle === option.id
                        ? 'border-foreground ring-1 ring-foreground/10'
                        : 'border-[#e8e0d5] hover:border-foreground/30'
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{option.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="pb-10">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono-label text-muted-foreground">Handwritten Note</p>
                <button
                  onClick={() => setBouquet((p) => ({ ...p, messageCard: !p.messageCard }))}
                  className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${bouquet.messageCard ? 'bg-warm-wine' : 'bg-[#e8e0d5]'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${bouquet.messageCard ? 'left-[26px]' : 'left-0.5'}`} />
                </button>
              </div>
              {bouquet.messageCard && (
                <Textarea
                  value={bouquet.messageText}
                  onChange={(e) => setBouquet((p) => ({ ...p, messageText: e.target.value }))}
                  placeholder="Draft a beautiful sentiment..."
                  rows={4}
                  maxLength={200}
                  className="bg-white border-[#e8e0d5] rounded-xl resize-none font-display text-lg italic p-5 shadow-sm focus-visible:ring-warm-wine/30 mt-2"
                />
              )}
            </div>

            <div className="pb-10">
              <div className="mb-4">
                <div className="flex items-center gap-2 text-warm-wine">
                  <Sparkles className="h-4 w-4" />
                  <p className="font-mono-label text-muted-foreground">Thought Behind The Bouquet</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Tell them why you chose these flowers. This will appear with the bouquet as a quiet note about your intention.
                </p>
              </div>
              <Textarea
                value={bouquet.bouquetIntent}
                onChange={(e) => setBouquet((prev) => ({ ...prev, bouquetIntent: e.target.value }))}
                placeholder="I chose peonies for tenderness, roses for affection, and lavender because being around you feels calming..."
                rows={5}
                maxLength={320}
                className="bg-white border-[#e8e0d5] rounded-xl resize-none p-5 shadow-sm focus-visible:ring-warm-wine/30"
              />
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex justify-between items-center mb-4">
              <p className="font-mono-label text-muted-foreground">The Canvas</p>
              <div className="flex gap-2">
                <Button
                  onClick={randomizeArrangement}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#e8e0d5] text-xs font-mono-label bg-white"
                  title="Shuffle arrangement"
                >
                  <Shuffle className="w-3 h-3 mr-2" /> Shuffle
                </Button>
              </div>
            </div>

            <div className="bg-[#f0ece6] rounded-2xl border border-[#e8e0d5] min-h-[580px] w-full flex flex-col items-center justify-center relative overflow-visible shadow-inner" style={{ backgroundImage: 'radial-gradient(#d5d0c8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-[10px] font-mono-label tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Tap a flower to rotate, layer, or remove
              </div>

              <div className="mt-12 scale-110 flex-1 flex items-center justify-center">
                <BouquetPreview
                  bouquet={bouquet}
                  senderName={senderName}
                  recipientName={recipientName}
                  isEditable={true}
                  onUpdateFlower={updateFlower}
                  onRemoveFlower={removeFlower}
                  onMoveFlowerForward={(id) => moveFlowerLayer(id, 'forward')}
                  onMoveFlowerBackward={(id) => moveFlowerLayer(id, 'backward')}
                />
              </div>
            </div>

            <div className="mt-8 text-center">
              {selectedFlowerSummaries.length > 0 && (
                <div className="mb-5 rounded-[24px] border border-[#eadfce] bg-white/90 px-5 py-4 text-left shadow-sm">
                  <p className="font-mono-label text-[11px] tracking-[0.2em] text-warm-wine">BOUQUET LANGUAGE</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedFlowerSummaries
                      .slice(0, 4)
                      .map((flower) => `${flower.name}: ${flower.symbolism}`)
                      .join(' • ')}
                  </p>
                </div>
              )}
              <Button
                onClick={() => setShowPlanDialog(true)}
                disabled={bouquet.placedFlowers.length === 0}
                className="rounded-full px-12 py-7 bg-foreground text-background hover:bg-foreground/90 w-full shadow-lg font-mono-label text-sm tracking-widest hover:shadow-xl transition-all"
              >
                Finalize & send
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} product="bouquet" />
    </div>
  );
};

export default BouquetCreate;
