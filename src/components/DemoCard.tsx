import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const noTexts = ["No", "Are you sure?", "Really?!", "Think again!", "Pretty please?", "😢"];

interface DemoCardProps {}

const DemoCard = ({}: DemoCardProps) => {
  const [trick] = useState<'runaway' | 'shrinking' | 'swap' | 'disguise'>('runaway');
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoHover = useCallback(() => {
    if (trick === 'runaway') {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 100;
      setNoPos({ x, y });
    }
  }, [trick]);

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);
    if (trick === 'shrinking') {
      setNoScale(Math.max(0.2, 1 - next * 0.2));
    }
    if (trick === 'runaway') {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 100;
      setNoPos({ x, y });
    }
  };

  const reset = () => {
    setAccepted(false);
    setNoClicks(0);
    setNoPos({ x: 0, y: 0 });
    setNoScale(1);
  };

  const getNoText = () => {
    if (trick === 'swap') return noTexts[Math.min(noClicks, noTexts.length - 1)];
    if (trick === 'disguise' && noClicks >= 2) return 'Yes 💖';
    return 'No';
  };

  const yesScale = trick === 'swap' ? 1 + noClicks * 0.15 : 1;

  return (
    <div ref={containerRef} className="relative w-full max-w-sm mx-auto">
      <div className="bg-gradient-to-br from-rose-100 to-pink-200 rounded-2xl p-8 shadow-2xl border border-pink-200/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                💘
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-rose-900 mb-6">
                Will you be my Valentine?
              </h3>
              <div className="flex items-center justify-center gap-4 relative min-h-[60px]">
                <motion.button
                  animate={{ scale: yesScale }}
                  whileHover={{ scale: yesScale * 1.05 }}
                  whileTap={{ scale: yesScale * 0.95 }}
                  onClick={() => setAccepted(true)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg"
                >
                  Yes! 💖
                </motion.button>
                <motion.button
                  animate={{
                    x: noPos.x,
                    y: noPos.y,
                    scale: noScale,
                  }}
                  onHoverStart={handleNoHover}
                  onClick={handleNoClick}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="px-6 py-3 bg-muted text-muted-foreground rounded-full font-medium shadow-md"
                >
                  {getNoText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6 }}
              >
                🎉
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-rose-900 mb-2">Yay! 💕</h3>
              <p className="text-rose-700">You made my heart skip a beat!</p>
              <button onClick={reset} className="mt-4 text-sm text-rose-500 underline">
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DemoCard;
