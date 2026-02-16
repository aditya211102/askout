import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';
import { FLOWERS, BOW_STYLES, type BouquetConfig } from '@/lib/bouquet-types';

const BouquetViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bouquet, setBouquet] = useState<BouquetConfig | null>(null);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) { setError('Not found'); setLoading(false); return; }
      const { data, error: err } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .eq('paid', true)
        .eq('product_type', 'bouquet')
        .single();
      if (err || !data) { setError('Bouquet not found'); setLoading(false); return; }
      setBouquet(data.bouquet_data as unknown as BouquetConfig);
      setSenderName(data.sender_name || '');
      setRecipientName(data.recipient_name || '');
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReveal = () => {
    setRevealed(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#ec4899', '#f472b6', '#fbbf24', '#a855f7'] });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-peach))]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">💐</motion.div>
    </div>
  );

  if (error || !bouquet) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-peach))]">
      <div className="text-center p-8"><div className="text-5xl mb-4">🥀</div><p className="text-muted-foreground">{error}</p></div>
    </div>
  );

  const selectedFlowers = FLOWERS.filter((f) => bouquet.flowers.includes(f.id));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-peach))] relative overflow-hidden">
      {/* Falling petals */}
      {revealed && Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed text-2xl pointer-events-none"
          style={{ left: `${Math.random() * 100}%` }}
          initial={{ y: '-5%', opacity: 1 }}
          animate={{ y: '110%', opacity: 0 }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: i * 0.5 }}
        >
          🌸
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="envelope" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8, y: -50 }} className="text-center">
            {recipientName && <p className="text-lg text-muted-foreground mb-4">For {recipientName}</p>}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-8xl mb-8">💌</motion.div>
            <Button onClick={handleReveal} size="lg" className="rounded-full text-lg px-10 py-6 animate-glow bg-gradient-to-r from-primary to-[hsl(var(--sm-peach))]">
              Open Your Gift ✨
            </Button>
          </motion.div>
        ) : (
          <motion.div key="bouquet" initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 150 }} className="glass-strong rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
            {recipientName && <p className="text-sm font-medium text-primary mb-2">For {recipientName} 💕</p>}

            <div className="relative w-64 h-72 mx-auto flex flex-col items-center justify-end mb-4">
              <div className="absolute bottom-20 flex flex-wrap items-end justify-center gap-1 px-4 max-w-[200px]">
                {selectedFlowers.map((flower, i) => (
                  <motion.span
                    key={flower.id}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: (i - selectedFlowers.length / 2) * 8 }}
                    transition={{ type: 'spring', delay: 0.3 + i * 0.1 }}
                    className="text-4xl"
                  >
                    {flower.emoji}
                  </motion.span>
                ))}
              </div>
              <div className="absolute bottom-[72px] z-10 text-2xl">
                {BOW_STYLES.find((b) => b.id === bouquet.bowStyle)?.emoji}
              </div>
              <div className="w-28 h-24 bg-gradient-to-b from-[hsl(var(--sm-lavender))]/40 to-[hsl(var(--sm-lavender))]/60 rounded-b-[40px] rounded-t-lg border border-[hsl(var(--sm-lavender))]/30 backdrop-blur-sm" />
            </div>

            {bouquet.messageCard && bouquet.messageText && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white/60 rounded-2xl p-4 max-w-[250px] mx-auto shadow-sm border border-border/50 mb-4">
                <p className="text-sm italic text-foreground">{bouquet.messageText}</p>
              </motion.div>
            )}

            {senderName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-muted-foreground">
                With love, {senderName} 💕
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Need Button import
import { Button } from '@/components/ui/button';

export default BouquetViewer;
