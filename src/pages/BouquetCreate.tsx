import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FLOWERS,
  WRAPPING_PATTERNS,
  BOW_STYLES,
  DEFAULT_BOUQUET,
  type BouquetConfig,
} from '@/lib/bouquet-types';
import type { PlanType } from '@/components/PlanDialog';
import PlanDialog from '@/components/PlanDialog';

const BouquetCreate = () => {
  const navigate = useNavigate();
  const [bouquet, setBouquet] = useState<BouquetConfig>({ ...DEFAULT_BOUQUET });
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  const toggleFlower = (id: string) => {
    setBouquet((prev) => ({
      ...prev,
      flowers: prev.flowers.includes(id)
        ? prev.flowers.filter((f) => f !== id)
        : prev.flowers.length < 10 ? [...prev.flowers, id] : prev.flowers,
    }));
  };

  const selectedFlowers = FLOWERS.filter((f) => bouquet.flowers.includes(f.id));

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
    <div className="min-h-screen bg-background relative texture-grain">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-foreground hover:text-warm-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono-label">Back</span>
          </button>
          <span className="font-display text-sm text-muted-foreground italic">Digital Bouquet</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-16">
          <p className="font-mono-label text-muted-foreground mb-4">Pick 3 to 10 blooms</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight italic">
            Build your bouquet
          </h1>
        </div>

        {/* Flower Grid - Digibouquet inspired */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6 mb-16 max-w-3xl mx-auto">
          {FLOWERS.map((flower) => {
            const selected = bouquet.flowers.includes(flower.id);
            return (
              <motion.button
                key={flower.id}
                onClick={() => toggleFlower(flower.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                  selected
                    ? 'ring-2 ring-foreground ring-offset-4 ring-offset-background'
                    : 'hover:ring-1 hover:ring-foreground/20 hover:ring-offset-2 hover:ring-offset-background'
                }`}
              >
                <img
                  src={flower.image}
                  alt={flower.name}
                  className={`w-full h-full object-contain p-1 transition-all duration-300 ${
                    selected ? 'drop-shadow-lg' : 'opacity-80 hover:opacity-100'
                  }`}
                />
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-foreground flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-background" />
                  </motion.div>
                )}
                <span className="absolute -bottom-5 font-mono-label text-muted-foreground whitespace-nowrap">
                  {flower.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="text-center mb-12">
          <span className="font-mono-label text-muted-foreground">
            {selectedFlowers.length} / 10 selected
          </span>
        </div>

        <div className="h-px bg-border max-w-3xl mx-auto mb-12" />

        <div className="grid lg:grid-cols-[1fr,380px] gap-12 max-w-4xl mx-auto">
          {/* Controls */}
          <div className="space-y-10">
            {/* Names */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Recipients</p>
              <div className="grid grid-cols-2 gap-3">
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} className="bg-transparent" />
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} className="bg-transparent" />
              </div>
            </div>

            {/* Wrapping */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Wrapping paper</p>
              <div className="flex gap-3">
                {WRAPPING_PATTERNS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setBouquet((p) => ({ ...p, wrappingPattern: wp.id }))}
                    className={`h-14 w-14 rounded-lg border transition-all ${wp.preview} ${bouquet.wrappingPattern === wp.id ? 'border-foreground ring-1 ring-foreground/20 scale-110' : 'border-border hover:scale-105'}`}
                    title={wp.name}
                  />
                ))}
              </div>
            </div>

            {/* Bow */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Bow style</p>
              <div className="flex gap-3">
                {BOW_STYLES.map((bow) => (
                  <button
                    key={bow.id}
                    onClick={() => setBouquet((p) => ({ ...p, bowStyle: bow.id }))}
                    className={`px-6 py-3 rounded-lg border text-center transition-all ${bouquet.bowStyle === bow.id ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/20'}`}
                  >
                    <div
                      className="w-8 h-3 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: bow.color }}
                    />
                    <span className="font-mono-label text-muted-foreground">{bow.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono-label text-muted-foreground">Message card</p>
                <button
                  onClick={() => setBouquet((p) => ({ ...p, messageCard: !p.messageCard }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${bouquet.messageCard ? 'bg-foreground' : 'bg-border'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${bouquet.messageCard ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              {bouquet.messageCard && (
                <Textarea
                  value={bouquet.messageText}
                  onChange={(e) => setBouquet((p) => ({ ...p, messageText: e.target.value }))}
                  placeholder="Write something beautiful..."
                  rows={3}
                  maxLength={200}
                  className="bg-transparent font-display italic"
                />
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-elevated rounded-lg border border-border p-8 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
              <p className="font-mono-label text-muted-foreground absolute top-4 left-4">Preview</p>

              {/* Bouquet arrangement */}
              <div className="relative w-56 h-72 flex flex-col items-center justify-end mt-8">
                {/* Flowers */}
                <div className="absolute bottom-24 flex flex-wrap items-end justify-center gap-0 px-2 max-w-[200px]">
                  <AnimatePresence>
                    {selectedFlowers.map((flower, i) => (
                      <motion.img
                        key={flower.id}
                        src={flower.image}
                        alt={flower.name}
                        initial={{ scale: 0, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', delay: i * 0.05 }}
                        className="w-14 h-14 object-contain -mx-1"
                        style={{ transform: `rotate(${(i - selectedFlowers.length / 2) * 12}deg)` }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bow */}
                {bouquet.bowStyle !== 'minimal' && (
                  <div
                    className="absolute bottom-[72px] z-10 w-10 h-4 rounded-full"
                    style={{ backgroundColor: BOW_STYLES.find((b) => b.id === bouquet.bowStyle)?.color }}
                  />
                )}

                {/* Vase/Wrapping */}
                <div className={`w-28 h-24 rounded-b-[40px] rounded-t-lg border border-border/60 ${WRAPPING_PATTERNS.find(w => w.id === bouquet.wrappingPattern)?.preview}`} />
              </div>

              {selectedFlowers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4 font-display italic">Select flowers above</p>
              )}

              {bouquet.messageCard && bouquet.messageText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border border-border rounded-lg p-4 max-w-[200px] text-center bg-card">
                  <p className="text-xs italic text-muted-foreground leading-relaxed font-display">{bouquet.messageText}</p>
                  {senderName && <p className="text-[10px] text-warm-wine mt-2 font-medium">— {senderName}</p>}
                </motion.div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowPlanDialog(true)}
                disabled={selectedFlowers.length < 3}
                className="rounded-full px-10 py-6 bg-foreground text-background hover:bg-foreground/90 w-full"
              >
                Send bouquet — $2.99
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} />
    </div>
  );
};

export default BouquetCreate;
