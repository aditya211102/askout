import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { type CrushCard, THEMES, STICKERS } from '@/lib/card-types';
import { supabase } from '@/integrations/supabase/client';

const noTexts = ["No", "Are you sure?", "Really?!", "Think again!", "Pretty please?", "Last chance!", "😢"];

const CardViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CrushCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) { setError('Card not found'); setLoading(false); return; }
      try {
        const { data, error: dbError } = await supabase
          .from('cards')
          .select('*')
          .eq('id', id)
          .eq('paid', true)
          .single();
        if (dbError || !data) { setError('Card not found or not yet paid for'); setLoading(false); return; }
        setCard({
          id: data.id,
          theme: data.theme as CrushCard['theme'],
          question: data.question,
          yesMessage: data.yes_message,
          noButtonTrick: data.no_button_trick as CrushCard['noButtonTrick'],
          stickers: (data.stickers as any) || [],
          recipientName: data.recipient_name || undefined,
          paid: data.paid,
        });
      } catch {
        setError('Failed to load card');
      }
      setLoading(false);
    };
    loadCard();
  }, [id]);

  const fireCelebration = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#e11d48', '#ec4899', '#f43f5e', '#f59e0b', '#8b5cf6'];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const handleNoHover = useCallback(() => {
    if (card?.noButtonTrick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 250, y: (Math.random() - 0.5) * 150 });
    }
  }, [card?.noButtonTrick]);

  const handleNoClick = () => {
    if (!card) return;
    const next = noClicks + 1;
    setNoClicks(next);
    if (card.noButtonTrick === 'shrinking') setNoScale(Math.max(0.1, 1 - next * 0.18));
    if (card.noButtonTrick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 250, y: (Math.random() - 0.5) * 150 });
    }
    if (card.noButtonTrick === 'disguise' && next >= 3) handleYes();
  };

  const handleYes = () => {
    setAccepted(true);
    fireCelebration();
  };

  const getNoText = () => {
    if (!card) return 'No';
    if (card.noButtonTrick === 'swap') return noTexts[Math.min(noClicks, noTexts.length - 1)];
    if (card.noButtonTrick === 'disguise' && noClicks >= 2) return 'Yes 💖';
    return 'No';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">💘</motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-rose-200">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">💔</div>
          <h1 className="font-display text-2xl font-bold text-rose-900 mb-2">Oops!</h1>
          <p className="text-rose-700">{error || 'Card not found'}</p>
        </div>
      </div>
    );
  }

  const theme = THEMES[card.theme];
  const yesScale = card.noButtonTrick === 'swap' ? 1 + noClicks * 0.15 : 1;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
      {/* Floating stickers */}
      {card.stickers.map((s, i) => (
        <motion.div
          key={i}
          className="fixed text-3xl pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          initial={{ scale: 0, rotate: s.rotation }}
          animate={{ scale: s.scale, rotate: s.rotation, y: [0, -10, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2 + i * 0.3 }, scale: { delay: i * 0.1 } }}
        >
          {STICKERS[s.type].emoji}
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-card/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-border text-center"
            >
              {card.recipientName && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-sm font-medium mb-1 ${theme.accent}`}>
                  Dear {card.recipientName},
                </motion.p>
              )}
              <motion.div
                className="text-6xl mb-6"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                💘
              </motion.div>
              <h1 className={`font-display text-3xl md:text-4xl font-bold mb-10 ${theme.text}`}>
                {card.question}
              </h1>
              <div className="flex items-center justify-center gap-6 relative min-h-[80px]">
                <motion.button
                  animate={{ scale: yesScale }}
                  whileHover={{ scale: yesScale * 1.08 }}
                  whileTap={{ scale: yesScale * 0.95 }}
                  onClick={handleYes}
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold text-xl shadow-xl"
                >
                  Yes! 💖
                </motion.button>
                <motion.button
                  animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                  onHoverStart={handleNoHover}
                  onClick={handleNoClick}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="px-8 py-4 bg-muted text-muted-foreground rounded-full font-medium text-lg shadow-md"
                >
                  {getNoText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-card/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-border text-center"
            >
              <motion.div
                className="text-7xl mb-6"
                animate={{ rotate: [0, -15, 15, -15, 0], scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8 }}
              >
                🎉
              </motion.div>
              <h1 className={`font-display text-4xl font-bold mb-4 ${theme.text}`}>Yay! 💕</h1>
              <p className={`text-xl leading-relaxed ${theme.accent}`}>{card.yesMessage}</p>
              <div className="mt-8 flex justify-center gap-2">
                {['💖', '💕', '💗', '💘', '❤️'].map((h, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                  >
                    {h}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardViewer;
