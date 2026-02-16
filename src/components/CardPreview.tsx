import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CrushCard, THEMES, STICKERS } from '@/lib/card-types';

const noTexts = ["No", "Are you sure?", "Really?!", "Think again!", "Pretty please?", "😢"];

interface CardPreviewProps {
  card: CrushCard;
  interactive?: boolean;
  onAccept?: () => void;
}

const CardPreview = ({ card, interactive = false, onAccept }: CardPreviewProps) => {
  const theme = THEMES[card.theme];
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);

  const handleNoHover = useCallback(() => {
    if (card.noButtonTrick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 180, y: (Math.random() - 0.5) * 80 });
    }
  }, [card.noButtonTrick]);

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);
    if (card.noButtonTrick === 'shrinking') setNoScale(Math.max(0.15, 1 - next * 0.2));
    if (card.noButtonTrick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 180, y: (Math.random() - 0.5) * 80 });
    }
    if (card.noButtonTrick === 'disguise' && next >= 3) {
      handleYes();
    }
  };

  const handleYes = () => {
    setAccepted(true);
    onAccept?.();
  };

  const getNoText = () => {
    if (card.noButtonTrick === 'swap') return noTexts[Math.min(noClicks, noTexts.length - 1)];
    if (card.noButtonTrick === 'disguise' && noClicks >= 2) return 'Yes 💖';
    return 'No';
  };

  const yesScale = card.noButtonTrick === 'swap' ? 1 + noClicks * 0.12 : 1;

  return (
    <div className={`relative rounded-2xl p-8 shadow-2xl overflow-hidden min-h-[350px] flex flex-col items-center justify-center ${theme.bg}`}>
      {/* Stickers — positioned around the edges to avoid overlapping text */}
      {card.stickers.map((s, i) => {
        const stickerData = STICKERS[s.type];
        // Push stickers to edges: x constrained to 0-15% or 75-95%, y to 0-15% or 75-95%
        const edgeX = s.x < 50 ? Math.min(s.x, 15) : Math.max(s.x, 75);
        const edgeY = s.y < 50 ? Math.min(s.y, 15) : Math.max(s.y, 75);
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none z-0"
            style={{ left: `${edgeX}%`, top: `${edgeY}%` }}
            initial={{ scale: 0, rotate: s.rotation }}
            animate={{ scale: s.scale, rotate: s.rotation }}
            transition={{ type: 'spring', delay: i * 0.05 }}
          >
            <img src={stickerData.image} alt={stickerData.name} className="w-10 h-10 object-contain" />
          </motion.div>
        );
      })}

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div key="q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center relative z-10">
            {card.recipientName && (
              <p className={`text-sm font-medium mb-2 ${theme.accent}`}>Dear {card.recipientName},</p>
            )}
            <motion.div className="text-5xl mb-4" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              💘
            </motion.div>
            <h2 className={`font-display text-2xl font-bold mb-8 ${theme.text}`}>{card.question}</h2>
            <div className="flex items-center justify-center gap-4 relative min-h-[60px]">
              <motion.button
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.05 }}
                whileTap={{ scale: yesScale * 0.95 }}
                onClick={interactive ? handleYes : undefined}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg"
              >
                Yes! 💖
              </motion.button>
              <motion.button
                animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                onHoverStart={interactive ? handleNoHover : undefined}
                onClick={interactive ? handleNoClick : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-full font-medium shadow-md"
              >
                {getNoText()}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="yes" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center relative z-10">
            <motion.div className="text-6xl mb-4" animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.3, 1] }} transition={{ duration: 0.6 }}>
              🎉
            </motion.div>
            <h2 className={`font-display text-2xl font-bold mb-3 ${theme.text}`}>Yay! 💕</h2>
            <p className={`text-lg ${theme.accent}`}>{card.yesMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardPreview;
