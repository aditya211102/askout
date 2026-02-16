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
        : [...prev.flowers, id],
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
            <span className="font-mono-label">Bouquets</span>
          </button>
          <span className="font-display text-sm text-muted-foreground italic">Digital Bouquet</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="font-mono-label text-muted-foreground mb-3">Build</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            Your bouquet
          </h1>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-12">
          {/* Controls */}
          <div className="space-y-8">
            {/* Names */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Recipients</p>
              <div className="grid grid-cols-2 gap-3">
                <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} className="bg-transparent" />
                <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} className="bg-transparent" />
              </div>
            </div>

            {/* Flowers */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Choose flowers</p>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {FLOWERS.map((flower) => {
                  const selected = bouquet.flowers.includes(flower.id);
                  return (
                    <button
                      key={flower.id}
                      onClick={() => toggleFlower(flower.id)}
                      className={`relative p-3 rounded-lg border text-center transition-all ${selected ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/20'}`}
                    >
                      {flower.premium && <span className="absolute -top-1 -right-1 font-mono-label text-[8px] bg-warm-gold text-white px-1 py-0.5 rounded">PRO</span>}
                      <span className="text-2xl block">{flower.emoji}</span>
                      <div className="text-[10px] text-muted-foreground mt-1">{flower.name}</div>
                      {selected && <Check className="w-3 h-3 text-foreground mx-auto mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wrapping */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Wrapping</p>
              <div className="flex gap-2">
                {WRAPPING_PATTERNS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setBouquet((p) => ({ ...p, wrappingPattern: wp.id }))}
                    className={`h-14 w-14 rounded-lg border transition-all ${wp.preview} ${bouquet.wrappingPattern === wp.id ? 'border-foreground ring-1 ring-foreground/20' : 'border-border'}`}
                    title={wp.name}
                  />
                ))}
              </div>
            </div>

            {/* Bow */}
            <div>
              <p className="font-mono-label text-muted-foreground mb-4">Bow style</p>
              <div className="flex gap-2">
                {BOW_STYLES.map((bow) => (
                  <button
                    key={bow.id}
                    onClick={() => setBouquet((p) => ({ ...p, bowStyle: bow.id }))}
                    className={`px-5 py-3 rounded-lg border text-center transition-all ${bouquet.bowStyle === bow.id ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/20'}`}
                  >
                    <span className="text-lg block">{bow.emoji}</span>
                    <span className="text-[10px] text-muted-foreground">{bow.name}</span>
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
                  className="bg-transparent"
                />
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-elevated rounded-lg border border-border p-8 min-h-[420px] flex flex-col items-center justify-center relative">
              <p className="font-mono-label text-muted-foreground absolute top-4 left-4">Preview</p>

              <div className="relative w-56 h-64 flex flex-col items-center justify-end mt-8">
                {/* Flowers */}
                <div className="absolute bottom-20 flex flex-wrap items-end justify-center gap-0.5 px-2 max-w-[180px]">
                  <AnimatePresence>
                    {selectedFlowers.map((flower, i) => (
                      <motion.span
                        key={flower.id}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 20 }}
                        transition={{ type: 'spring', delay: i * 0.04 }}
                        className="text-3xl"
                        style={{ transform: `rotate(${(i - selectedFlowers.length / 2) * 10}deg)` }}
                      >
                        {flower.emoji}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bow */}
                <div className="absolute bottom-[68px] z-10 text-xl">
                  {BOW_STYLES.find((b) => b.id === bouquet.bowStyle)?.emoji}
                </div>

                {/* Vase */}
                <div className="w-24 h-20 bg-warm-cream rounded-b-[36px] rounded-t-md border border-border/60" />
              </div>

              {selectedFlowers.length === 0 && (
                <p className="text-xs text-muted-foreground mt-4">Select flowers above</p>
              )}

              {bouquet.messageCard && bouquet.messageText && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border border-border rounded-lg p-4 max-w-[200px] text-center">
                  <p className="text-xs italic text-muted-foreground leading-relaxed">{bouquet.messageText}</p>
                  {senderName && <p className="text-[10px] text-warm-wine mt-2 font-medium">— {senderName}</p>}
                </motion.div>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowPlanDialog(true)}
                disabled={selectedFlowers.length === 0}
                className="rounded-full px-10 py-6 bg-foreground text-background hover:bg-foreground/90 w-full"
              >
                Send bouquet
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
