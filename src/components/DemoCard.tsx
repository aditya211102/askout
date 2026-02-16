import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const noTexts = ["No", "Are you sure?", "Really?!", "Think again!", "Pretty please?", "😢"];

const DemoCard = () => {
  const [trick] = useState<'runaway' | 'shrinking' | 'swap' | 'disguise'>('runaway');
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoHover = useCallback(() => {
    if (trick === 'runaway') {
      setNoPos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 100 });
    }
  }, [trick]);

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);
    if (trick === 'shrinking') setNoScale(Math.max(0.2, 1 - next * 0.2));
    if (trick === 'runaway') setNoPos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 100 });
  };

  const reset = () => { setAccepted(false); setNoClicks(0); setNoPos({ x: 0, y: 0 }); setNoScale(1); };
  const getNoText = () => {
    if (trick === 'swap') return noTexts[Math.min(noClicks, noTexts.length - 1)];
    if (trick === 'disguise' && noClicks >= 2) return 'Yes!';
    return 'No';
  };
  const yesScale = trick === 'swap' ? 1 + noClicks * 0.15 : 1;

  return (
    <div ref={containerRef} className="relative w-full max-w-sm mx-auto">
      <div className="surface-elevated rounded-lg p-10 border border-border overflow-hidden">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div key="q" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center">
              <p className="font-mono-label text-muted-foreground mb-6">From Alex</p>
              <h3 className="font-display text-2xl font-bold text-foreground mb-8">
                Will you go out with me?
              </h3>
              <div className="flex items-center justify-center gap-4 relative min-h-[60px]">
                <motion.button
                  animate={{ scale: yesScale }}
                  whileHover={{ scale: yesScale * 1.03 }}
                  whileTap={{ scale: yesScale * 0.97 }}
                  onClick={() => setAccepted(true)}
                  className="px-8 py-3 bg-foreground text-background rounded-full font-medium text-sm"
                >
                  Yes
                </motion.button>
                <motion.button
                  animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                  onHoverStart={handleNoHover}
                  onClick={handleNoClick}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="px-6 py-3 border border-border text-muted-foreground rounded-full font-medium text-sm"
                >
                  {getNoText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="yes" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                You made my day
              </h3>
              <p className="text-muted-foreground text-sm">I can't stop smiling right now.</p>
              <button onClick={reset} className="mt-6 font-mono-label text-muted-foreground/60 hover:text-foreground transition-colors">
                Reset demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DemoCard;
