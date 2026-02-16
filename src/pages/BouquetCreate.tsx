import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

  const handleSave = () => setShowPlanDialog(true);

  const handlePlanSelect = (plan: PlanType) => {
    localStorage.setItem(
      'pendingCard',
      JSON.stringify({
        productType: 'bouquet',
        bouquetData: bouquet,
        recipientName,
        senderName,
        question: `A bouquet for ${recipientName || 'you'}`,
        yesMessage: bouquet.messageText || 'Enjoy these flowers! 💐',
      })
    );
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingProductType', 'bouquet');
    setShowPlanDialog(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-peach))] relative overflow-hidden">
      {/* Floating petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-[0.08]"
            style={{ left: `${10 + i * 12}%` }}
            animate={{ y: ['-5%', '105%'] }}
            transition={{ duration: 12 + Math.random() * 6, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="py-3 px-6 border-b border-border/50 glass-strong sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-lg font-bold">Digital Bouquet</span>
            <span className="text-lg">💐</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Build Your Bouquet</h1>
          <p className="text-muted-foreground">Pick flowers, customize, and send a blooming surprise</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Names */}
            <div className="glass-strong rounded-3xl p-5 space-y-4">
              <h3 className="font-display text-lg font-semibold">Names</h3>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their name" maxLength={50} />
              <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Your name" maxLength={50} />
            </div>

            {/* Flower selection */}
            <div className="glass-strong rounded-3xl p-5">
              <h3 className="font-display text-lg font-semibold mb-3">Choose Flowers</h3>
              <div className="grid grid-cols-3 gap-3">
                {FLOWERS.map((flower) => {
                  const selected = bouquet.flowers.includes(flower.id);
                  return (
                    <motion.button
                      key={flower.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFlower(flower.id)}
                      className={`relative p-3 rounded-2xl border-2 text-center transition-all ${
                        selected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      {flower.premium && (
                        <Badge className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[hsl(var(--sm-gold))] to-amber-400 text-foreground border-0 text-[9px] px-1.5 py-0 shadow-sm z-10">
                          Premium
                        </Badge>
                      )}
                      <span className="text-3xl block">{flower.emoji}</span>
                      <div className="text-xs text-muted-foreground mt-1">{flower.name}</div>
                      {selected && <Check className="w-3.5 h-3.5 text-primary mx-auto mt-1" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Wrapping */}
            <div className="glass-strong rounded-3xl p-5">
              <h3 className="font-display text-lg font-semibold mb-3">Wrapping Paper</h3>
              <div className="grid grid-cols-5 gap-2">
                {WRAPPING_PATTERNS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => setBouquet((p) => ({ ...p, wrappingPattern: wp.id }))}
                    className={`h-14 rounded-xl border-2 transition-all ${wp.preview} ${
                      bouquet.wrappingPattern === wp.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                    title={wp.name}
                  />
                ))}
              </div>
            </div>

            {/* Bow */}
            <div className="glass-strong rounded-3xl p-5">
              <h3 className="font-display text-lg font-semibold mb-3">Bow Style</h3>
              <div className="flex gap-3">
                {BOW_STYLES.map((bow) => (
                  <button
                    key={bow.id}
                    onClick={() => setBouquet((p) => ({ ...p, bowStyle: bow.id }))}
                    className={`flex-1 p-3 rounded-2xl border-2 text-center transition-all ${
                      bouquet.bowStyle === bow.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-2xl block">{bow.emoji}</span>
                    <span className="text-xs text-muted-foreground">{bow.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message card */}
            <div className="glass-strong rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Message Card</h3>
                <button
                  onClick={() => setBouquet((p) => ({ ...p, messageCard: !p.messageCard }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${bouquet.messageCard ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${bouquet.messageCard ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              {bouquet.messageCard && (
                <Textarea
                  value={bouquet.messageText}
                  onChange={(e) => setBouquet((p) => ({ ...p, messageText: e.target.value }))}
                  placeholder="Write a heartfelt message..."
                  rows={3}
                  maxLength={200}
                />
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="glass-strong rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center">
              <h3 className="font-display text-lg font-semibold mb-6 text-center">Your Bouquet</h3>

              {/* Vase */}
              <div className="relative w-64 h-72 flex flex-col items-center justify-end">
                {/* Flowers */}
                <div className="absolute bottom-20 flex flex-wrap items-end justify-center gap-1 px-4 max-w-[200px]">
                  <AnimatePresence>
                    {selectedFlowers.map((flower, i) => (
                      <motion.span
                        key={flower.id}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 20 }}
                        transition={{ type: 'spring', delay: i * 0.05 }}
                        className="text-4xl"
                        style={{ transform: `rotate(${(i - selectedFlowers.length / 2) * 8}deg)` }}
                      >
                        {flower.emoji}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bow */}
                <div className="absolute bottom-[72px] z-10 text-2xl">
                  {BOW_STYLES.find((b) => b.id === bouquet.bowStyle)?.emoji}
                </div>

                {/* Vase shape */}
                <div className="w-28 h-24 bg-gradient-to-b from-[hsl(var(--sm-lavender))]/40 to-[hsl(var(--sm-lavender))]/60 rounded-b-[40px] rounded-t-lg border border-[hsl(var(--sm-lavender))]/30 backdrop-blur-sm" />
              </div>

              {selectedFlowers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">Select flowers to fill your bouquet</p>
              )}

              {bouquet.messageCard && bouquet.messageText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-white/80 rounded-2xl p-4 max-w-[220px] text-center shadow-sm border border-border/50"
                >
                  <p className="text-sm italic text-muted-foreground">{bouquet.messageText}</p>
                  {senderName && <p className="text-xs text-primary mt-2 font-medium">— {senderName}</p>}
                </motion.div>
              )}
            </div>

            {/* Save button */}
            <div className="mt-6 text-center">
              <Button
                onClick={handleSave}
                disabled={selectedFlowers.length === 0}
                size="lg"
                className="rounded-full text-lg px-10 py-6 animate-glow bg-gradient-to-r from-primary to-[hsl(var(--sm-peach))]"
              >
                <Sparkles className="w-5 h-5 mr-2" /> Send Bouquet 💐
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
