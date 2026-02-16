import { motion, AnimatePresence } from 'framer-motion';
import { FLOWERS, BOW_STYLES, WRAPPING_PATTERNS, type BouquetConfig } from '@/lib/bouquet-types';

interface BouquetPreviewProps {
  bouquet: BouquetConfig;
  senderName?: string;
  recipientName?: string;
}

const BouquetPreview = ({ bouquet, senderName, recipientName }: BouquetPreviewProps) => {
  const selectedFlowers = FLOWERS.filter((f) => bouquet.flowers.includes(f.id));
  const wrapping = WRAPPING_PATTERNS.find((w) => w.id === bouquet.wrappingPattern);
  const bow = BOW_STYLES.find((b) => b.id === bouquet.bowStyle);
  const n = selectedFlowers.length;

  // Position flowers in a semicircle arc above the vase
  const getFlowerPosition = (index: number, total: number) => {
    const maxAngle = Math.min(total * 22, 150); // total degrees
    const startAngle = -maxAngle / 2;
    const angle = total === 1 ? 0 : startAngle + (maxAngle / (total - 1)) * index;
    const radian = (angle - 90) * (Math.PI / 180); // -90 to start from top
    const radius = 65;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return { x, y, angle };
  };

  return (
    <div className="w-full flex flex-col items-center">
      {recipientName && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono-label text-warm-wine mb-3 text-center">
          For {recipientName}
        </motion.p>
      )}

      <div className="relative flex flex-col items-center">
        {/* Flower arrangement area */}
        <div className="relative w-60 h-44 mb-0">
          {/* Center point is at bottom-center of this div */}
          <AnimatePresence>
            {selectedFlowers.map((flower, i) => {
              const { x, y, angle } = getFlowerPosition(i, n);
              return (
                <motion.div
                  key={flower.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 180, delay: i * 0.05 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px - 28px)`,
                    bottom: `${-y - 10}px`,
                    zIndex: 10 + i,
                  }}
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="w-14 h-14 object-contain drop-shadow-md"
                    style={{ transform: `rotate(${angle * 0.15}deg)` }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Greenery accents */}
          {n > 0 && [...Array(Math.min(n + 1, 6))].map((_, i) => {
            const angle = ((i - 2.5) * 28 - 90) * (Math.PI / 180);
            const r = 50;
            return (
              <div
                key={`g-${i}`}
                className="absolute w-3 h-14 rounded-full bg-warm-sage/20 origin-bottom"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px - 6px)`,
                  bottom: `${-Math.sin(angle) * r - 20}px`,
                  transform: `rotate(${(i - 2.5) * 20}deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Bow */}
        {bouquet.bowStyle !== 'minimal' && n > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-20 flex flex-col items-center -mt-1">
            <div className="flex gap-0.5 -mb-1">
              <div className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: bow?.color }} />
              <div className="w-3 h-3 rounded-full opacity-50" style={{ backgroundColor: bow?.color }} />
            </div>
            <div className="w-10 h-3 rounded-full shadow-sm" style={{ backgroundColor: bow?.color }} />
          </motion.div>
        )}

        {/* Vase */}
        <div className="relative z-10">
          <div className={`w-28 h-24 rounded-b-[40px] rounded-t-lg border border-border/40 shadow-inner ${wrapping?.preview}`} />
        </div>
      </div>

      {n === 0 && (
        <p className="text-sm text-muted-foreground font-display italic mt-4">Select flowers above</p>
      )}

      {bouquet.messageCard && bouquet.messageText && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-warm-wine/50 shadow-sm z-10" />
          <div className="bg-card border border-border rounded-lg p-5 max-w-[220px] text-center shadow-sm">
            <p className="text-xs italic text-muted-foreground leading-relaxed font-display">"{bouquet.messageText}"</p>
            {senderName && <p className="text-[10px] text-warm-wine mt-3 font-medium font-mono-label">— {senderName}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BouquetPreview;
