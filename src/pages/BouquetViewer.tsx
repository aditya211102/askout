import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/integrations/supabase/client';
import { FLOWERS, BOW_STYLES, WRAPPING_PATTERNS, type BouquetConfig } from '@/lib/bouquet-types';
import { Button } from '@/components/ui/button';

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
    setRevealed(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#8B4049', '#B8956A', '#A8B5A0'] });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background texture-grain">
      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );

  if (error || !bouquet) return (
    <div className="min-h-screen flex items-center justify-center bg-background texture-grain">
      <div className="text-center"><p className="font-display text-xl font-semibold mb-2">Not found</p><p className="text-muted-foreground text-sm">{error}</p></div>
    </div>
  );

  const selectedFlowers = FLOWERS.filter((f) => bouquet.flowers.includes(f.id));
  const wrapping = WRAPPING_PATTERNS.find(w => w.id === bouquet.wrappingPattern);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative texture-grain">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div key="envelope" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center">
            {recipientName && <p className="text-muted-foreground text-sm mb-6">For {recipientName}</p>}
            <p className="font-display text-3xl font-bold mb-2 italic">You received a bouquet</p>
            <p className="text-muted-foreground text-sm mb-8">Tap to unwrap</p>
            <Button onClick={handleReveal} className="rounded-full px-10 py-6 bg-foreground text-background">
              Open
            </Button>
          </motion.div>
        ) : (
          <motion.div key="bouquet" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 150 }} className="surface-elevated rounded-lg border border-border p-10 max-w-sm w-full text-center">
            {recipientName && <p className="font-mono-label text-warm-wine mb-6">For {recipientName}</p>}
            <div className="relative w-56 h-64 mx-auto flex flex-col items-center justify-end mb-6">
              <div className="absolute bottom-20 flex flex-wrap items-end justify-center gap-0 px-2 max-w-[200px]">
                {selectedFlowers.map((flower, i) => (
                  <motion.img
                    key={flower.id}
                    src={flower.image}
                    alt={flower.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 + i * 0.08 }}
                    className="w-14 h-14 object-contain -mx-1"
                    style={{ transform: `rotate(${(i - selectedFlowers.length / 2) * 10}deg)` }}
                  />
                ))}
              </div>
              {bouquet.bowStyle !== 'minimal' && (
                <div
                  className="absolute bottom-[68px] z-10 w-10 h-3 rounded-full"
                  style={{ backgroundColor: BOW_STYLES.find((b) => b.id === bouquet.bowStyle)?.color }}
                />
              )}
              <div className={`w-24 h-20 rounded-b-[36px] rounded-t-md border border-border/60 ${wrapping?.preview}`} />
            </div>
            {bouquet.messageCard && bouquet.messageText && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="border border-border rounded-lg p-4 max-w-[220px] mx-auto mb-4">
                <p className="text-sm italic text-muted-foreground font-display">{bouquet.messageText}</p>
              </motion.div>
            )}
            {senderName && <p className="text-sm text-muted-foreground">From {senderName}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BouquetViewer;
