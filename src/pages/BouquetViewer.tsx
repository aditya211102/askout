import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flower2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BouquetPreview from '@/components/BouquetPreview';
import Envelope from '@/components/Envelope';
import { FLOWERS, type BouquetConfig } from '@/lib/bouquet-types';

const BouquetViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bouquet, setBouquet] = useState<BouquetConfig | null>(null);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [stage, setStage] = useState<'envelope' | 'opening' | 'revealed'>('envelope');

  useEffect(() => {
    const load = async () => {
      if (!id) { setError('Not found'); setLoading(false); return; }
      const { data, error: err } = await supabase
        .from('cards').select('*').eq('id', id).eq('paid', true).eq('product_type', 'bouquet').single();
      if (err || !data) { setError('Bouquet not found'); setLoading(false); return; }
      setBouquet(data.bouquet_data as unknown as BouquetConfig);
      setSenderName(data.sender_name || '');
      setRecipientName(data.recipient_name || '');
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReveal = () => {
    if (stage !== 'envelope') return;
    setStage('opening');

    // Play subtle audio could go here

    setTimeout(() => {
      setStage('revealed');
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#8B4049', '#FFFDFA', '#E8E0D5', '#B8956A'],
        disableForReducedMotion: true
      });
    }, 1800); // give envelope 1.8s to finish animation and pause
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] texture-grain">
      <div className="w-8 h-8 border-2 border-warm-wine/20 border-t-warm-wine rounded-full animate-spin" />
    </div>
  );

  if (error || !bouquet) return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] texture-grain">
      <div className="text-center"><p className="font-display text-2xl font-semibold mb-2">Not found</p><p className="text-muted-foreground text-sm font-mono-label">{error}</p></div>
    </div>
  );

  const selectedFlowerSummaries = Array.from(new Set(bouquet.placedFlowers.map((flower) => flower.flowerId)))
    .map((flowerId) => FLOWERS.find((flower) => flower.id === flowerId))
    .filter((flower): flower is NonNullable<typeof flower> => Boolean(flower));

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#faf9f7] relative texture-grain overflow-hidden">
      <AnimatePresence mode="wait">
        {stage !== 'revealed' ? (
          <motion.div
            key="envelope-container"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <p className="font-display text-3xl md:text-5xl font-bold mb-16 italic text-foreground tracking-tight">
              A gift has arrived
            </p>
            <Envelope
              recipientName={recipientName}
              onOpen={handleReveal}
              isOpen={stage === 'opening'}
            />
            {stage === 'envelope' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <button
                  onClick={handleReveal}
                  className="rounded-full border border-[#d9c8b4] bg-[#fffdfa] px-6 py-3 font-mono-label text-xs uppercase tracking-[0.22em] text-warm-wine shadow-[0_10px_24px_rgba(61,42,26,0.08)] transition-transform hover:-translate-y-0.5 hover:bg-[#fffaf4]"
                >
                  Open Bouquet
                </button>
                <p className="text-muted-foreground font-mono-label text-xs tracking-[0.2em] uppercase animate-pulse">
                  Tap the seal or use the button
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="bouquet"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
            className="w-full flex justify-center py-10"
          >
            <div className="w-full max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center mb-8"
              >
                <p className="font-mono-label text-warm-wine mb-3">A DIGITAL BOUQUET</p>
                <h1 className="font-display text-3xl md:text-5xl font-bold italic tracking-tight text-foreground">
                  Arranged with care
                </h1>
                {senderName && (
                  <p className="text-muted-foreground text-sm mt-3">
                    from {senderName}{recipientName ? `, for ${recipientName}` : ''}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mx-auto max-w-4xl rounded-[32px] border border-[#e8e0d5] bg-[linear-gradient(180deg,rgba(255,253,250,0.96),rgba(246,239,231,0.96))] px-6 py-10 shadow-[0_30px_80px_rgba(61,42,26,0.10)]"
              >
                <div className="pointer-events-none absolute inset-x-14 top-6 h-px bg-gradient-to-r from-transparent via-[#d8cab5] to-transparent" />
                <div className="pointer-events-none absolute left-1/2 top-12 h-32 w-32 -translate-x-1/2 rounded-full bg-warm-gold/10 blur-3xl" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.6 }}
                  className="scale-90 sm:scale-105 origin-center pointer-events-none"
                >
                  <BouquetPreview bouquet={bouquet} senderName={senderName} recipientName={recipientName} />
                </motion.div>
              </motion.div>

              {(bouquet.bouquetIntent || selectedFlowerSummaries.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34 }}
                  className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-[1.2fr,0.8fr]"
                >
                  <div className="rounded-[28px] border border-[#e8e0d5] bg-white/92 px-6 py-6 shadow-[0_18px_45px_rgba(54,36,23,0.06)]">
                    <div className="flex items-center gap-2 text-warm-wine">
                      <Sparkles className="h-4 w-4" />
                      <p className="font-mono-label text-[11px] tracking-[0.2em]">THE THOUGHT BEHIND THIS BOUQUET</p>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                      {bouquet.bouquetIntent || 'Every flower here was chosen for how it feels, not just how it looks.'}
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-[#e8e0d5] bg-[#faf6f0] px-6 py-6 shadow-[0_18px_45px_rgba(54,36,23,0.05)]">
                    <div className="flex items-center gap-2 text-warm-wine">
                      <Flower2 className="h-4 w-4" />
                      <p className="font-mono-label text-[11px] tracking-[0.2em]">FLOWER LANGUAGE</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedFlowerSummaries.slice(0, 4).map((flower) => (
                        <div key={flower.id}>
                          <p className="text-sm font-medium text-foreground">{flower.name}</p>
                          <p className="text-xs leading-relaxed text-muted-foreground">{flower.symbolism}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BouquetViewer;
