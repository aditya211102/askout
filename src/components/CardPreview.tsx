import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STICKERS, THEMES, type CrushCard } from '@/lib/card-types';

const noTexts = ['No', 'Are you sure?', 'Really?!', 'Think again!', 'Pretty please?', 'Please?'];

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

  const handleYes = () => {
    setAccepted(true);
    onAccept?.();
  };

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);

    if (card.noButtonTrick === 'shrinking') {
      setNoScale(Math.max(0.15, 1 - next * 0.2));
    }

    if (card.noButtonTrick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 180, y: (Math.random() - 0.5) * 80 });
    }

    if (card.noButtonTrick === 'disguise' && next >= 3) {
      handleYes();
    }
  };

  const getNoText = () => {
    if (card.noButtonTrick === 'swap') return noTexts[Math.min(noClicks, noTexts.length - 1)];
    if (card.noButtonTrick === 'disguise' && noClicks >= 2) return 'Yes';
    return 'No';
  };

  const yesScale = card.noButtonTrick === 'swap' ? 1 + noClicks * 0.12 : 1;

  return (
    <div
      className={`relative flex min-h-[430px] flex-col items-center justify-center overflow-hidden rounded-[32px] px-8 py-10 shadow-[0_30px_80px_rgba(70,47,31,0.16)] ${theme.bg}`}
    >
      <div className="pointer-events-none absolute inset-[1px] rounded-[30px] border border-white/45" />
      <div className="pointer-events-none absolute inset-x-12 top-6 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />

      {card.stickers.map((sticker, index) => {
        const stickerData = STICKERS[sticker.type];
        const edgeX = sticker.x < 50 ? Math.min(sticker.x, 15) : Math.max(sticker.x, 75);
        const edgeY = sticker.y < 50 ? Math.min(sticker.y, 15) : Math.max(sticker.y, 75);

        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute z-0"
            style={{ left: `${edgeX}%`, top: `${edgeY}%` }}
            initial={{ scale: 0, rotate: sticker.rotation }}
            animate={{ scale: sticker.scale, rotate: sticker.rotation }}
            transition={{ type: 'spring', delay: index * 0.05 }}
          >
            <img src={stickerData.image} alt={stickerData.name} className="h-10 w-10 object-contain opacity-90" />
          </motion.div>
        );
      })}

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative z-10 text-center"
          >
            {card.recipientName && (
              <p className={`mb-3 font-mono-label text-[11px] tracking-[0.24em] ${theme.accent}`}>
                FOR {card.recipientName.toUpperCase()}
              </p>
            )}

            <motion.div
              className="mb-6"
              animate={{ y: [0, -3, 0], scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            >
              <img
                src="/stickers/heart.png"
                alt=""
                className="mx-auto h-14 w-14 object-contain drop-shadow-[0_10px_14px_rgba(145,40,72,0.16)]"
              />
            </motion.div>

            <h2 className={`mx-auto mb-10 max-w-[14ch] font-display text-[2.15rem] font-bold leading-tight tracking-tight ${theme.text}`}>
              {card.question}
            </h2>

            <div className="relative flex min-h-[72px] items-center justify-center gap-4">
              <motion.button
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.05 }}
                whileTap={{ scale: yesScale * 0.95 }}
                onClick={interactive ? handleYes : undefined}
                className="rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-[0_14px_28px_rgba(121,48,60,0.24)]"
              >
                Yes!
              </motion.button>

              <motion.button
                animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                onHoverStart={interactive ? handleNoHover : undefined}
                onClick={interactive ? handleNoClick : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-full bg-[rgba(255,253,250,0.88)] px-7 py-3.5 font-medium text-muted-foreground shadow-[0_10px_20px_rgba(93,73,52,0.12)] backdrop-blur"
              >
                {getNoText()}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <motion.div
              className="mb-5"
              animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="/stickers/sparkles.png"
                alt=""
                className="mx-auto h-16 w-16 object-contain drop-shadow-[0_10px_14px_rgba(145,40,72,0.16)]"
              />
            </motion.div>

            <h2 className={`mb-3 font-display text-[2rem] font-bold tracking-tight ${theme.text}`}>Yay!</h2>
            <p className={`mx-auto max-w-[18ch] text-lg leading-relaxed ${theme.accent}`}>{card.yesMessage}</p>

            {card.senderName && (
              <p className={`mt-5 font-mono-label text-[11px] tracking-[0.24em] ${theme.accent}`}>
                FROM {card.senderName.toUpperCase()}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardPreview;
