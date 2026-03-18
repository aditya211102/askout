import { motion, AnimatePresence } from 'framer-motion';
import { FLOWERS, BOW_STYLES, WRAPPING_PATTERNS, type BouquetConfig } from '@/lib/bouquet-types';
import { useMemo } from 'react';

interface BouquetPreviewProps {
  bouquet: BouquetConfig;
  senderName?: string;
  recipientName?: string;
}

const BouquetPreview = ({ bouquet, senderName, recipientName }: BouquetPreviewProps) => {
  const selectedFlowers = bouquet.flowers
    .map(id => FLOWERS.find(f => f.id === id))
    .filter((f): f is typeof FLOWERS[0] => f !== undefined);

  const wrapping = WRAPPING_PATTERNS.find((w) => w.id === bouquet.wrappingPattern);
  const bow = BOW_STYLES.find((b) => b.id === bouquet.bowStyle);
  const n = selectedFlowers.length;
  const { arrangementStyle = 'tight', greeneryStyle = 'mixed' } = bouquet;
  const showWrapping = wrapping && wrapping.id !== 'none';

  // Deterministic pseudo-random
  const seed = (i: number) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  /*
   * FLOWER POSITIONS
   * Coordinates: x = horizontal (+ is right), y = vertical (+ is UP from dome center)
   * The dome center sits in the middle of the flower area.
   * IMPORTANT: Rotation kept very small (±8°) so flowers always look natural.
   */
  const flowerPositions = useMemo(() => {
    return selectedFlowers.map((_, index) => {
      const total = selectedFlowers.length;
      if (total === 0) return { x: 0, y: 0, angle: 0, z: 10, size: 76 };

      let x = 0, y = 0, angle = 0;
      const baseSize = total <= 3 ? 80 : total <= 5 ? 72 : total <= 7 ? 66 : 60;

      if (arrangementStyle === 'tight') {
        if (total === 1) {
          x = 0; y = 0;
        } else if (total === 2) {
          x = index === 0 ? -20 : 20; y = 0;
        } else if (total === 3) {
          const pts = [{ x: 0, y: 16 }, { x: -22, y: -10 }, { x: 22, y: -10 }];
          x = pts[index].x; y = pts[index].y;
        } else if (total <= 5) {
          // Top 1 + bottom row
          if (index === 0) { x = 0; y = 18; }
          else {
            const cols = total - 1;
            const col = index - 1;
            x = ((col / (cols - 1)) - 0.5) * (cols * 28);
            y = -12;
          }
        } else if (total <= 7) {
          // Top row (2-3) + bottom row (rest)
          if (index === 0) { x = 0; y = 22; }
          else if (index <= 3) {
            const a = ((index - 1) / 2) - 0.5;
            x = a * 55;
            y = 4;
          } else {
            const cols = total - 4;
            const col = index - 4;
            x = cols > 1 ? ((col / (cols - 1)) - 0.5) * (cols * 30) : 0;
            y = -20;
          }
        } else {
          // 3 rows for 8+ flowers
          if (index === 0) { x = 0; y = 26; }
          else if (index <= 3) {
            const a = ((index - 1) / 2) - 0.5;
            x = a * 52;
            y = 6;
          } else if (index <= 7) {
            const cols = Math.min(total - 4, 4);
            const col = index - 4;
            x = cols > 1 ? ((col / (cols - 1)) - 0.5) * (cols * 28) : 0;
            y = -16;
          } else {
            const cols = total - 8;
            const col = index - 8;
            x = cols > 1 ? ((col / (cols - 1)) - 0.5) * (cols * 28) : 0;
            y = -38;
          }
        }
        // Very subtle organic jitter - keep angles SMALL
        x += (seed(index * 3) - 0.5) * 5;
        y += (seed(index * 7) - 0.5) * 4;
        angle = (seed(index * 11) - 0.5) * 8; // ±4° max

      } else if (arrangementStyle === 'wild') {
        const spread = Math.min(total * 16, 70);
        x = (seed(index * 5) - 0.5) * spread * 2;
        y = (seed(index * 9) - 0.5) * spread * 1.0;
        angle = (seed(index * 13) - 0.5) * 25;
      } else {
        // Classic arc
        const maxArc = Math.min(total * 25, 160);
        const startA = -maxArc / 2;
        const arcA = total === 1 ? 0 : startA + (maxArc / (total - 1)) * index;
        const rad = (arcA - 90) * (Math.PI / 180);
        const r = 50;
        x = Math.cos(rad) * r;
        y = -Math.sin(rad) * r * 0.5;
        angle = arcA * 0.1;
      }

      return { x, y, angle, z: 10 + index, size: baseSize };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, arrangementStyle, bouquet.flowers.join(',')]);

  /* WRAPPING PAPER - Soft rounded rectangular shape sitting below flowers with NO GAP */
  const renderWrapping = () => {
    if (!showWrapping) return null;
    const colorMap: Record<string, { top: string; bottom: string }> = {
      kraft: { top: '#fceff0', bottom: '#f0d8a8' }, // Adjusted to match the soft yellow from user's reference image
      ivory: { top: '#ffffff', bottom: '#f2eae1' },
      sage: { top: '#e3f0d5', bottom: '#abc49d' },
      blush: { top: '#ffebe8', bottom: '#f0b4ae' },
      charcoal: { top: '#787878', bottom: '#424242' },
    };
    // Specifically overriding kraft to directly match the user's reference image colors
    const kraftColors = { top: '#fceaa1', bottom: '#f5d66c' };
    const colors = wrapping.id === 'kraft' ? kraftColors : (colorMap[wrapping.id] || kraftColors);

    return (
      <svg width="160" height="120" viewBox="0 0 160 120" className="drop-shadow-lg drop-shadow-color-black/10">
        <defs>
          <linearGradient id="wrapGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.top} />
            <stop offset="100%" stopColor={colors.bottom} />
          </linearGradient>
        </defs>
        <path d="M15 0 L145 0 L145 70 Q145 115 100 115 L60 115 Q15 115 15 70 Z" fill="url(#wrapGrad)" />
      </svg>
    );
  };

  /* BOW / RIBBON - SVG, sits ON TOP of the wrapping paper's top edge */
  const renderBow = () => {
    if (bouquet.bowStyle === 'minimal' || n === 0 || !bow) return null;
    const c = bow.color;
    return (
      <svg width="70" height="36" viewBox="0 0 70 36" className="drop-shadow-sm">
        <ellipse cx="18" cy="14" rx="16" ry="10" fill={c} opacity="0.7" />
        <ellipse cx="52" cy="14" rx="16" ry="10" fill={c} opacity="0.7" />
        <ellipse cx="35" cy="15" rx="7" ry="6" fill={c} />
        <path d="M30 22 Q25 33 20 35" stroke={c} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
        <path d="M40 22 Q45 33 50 35" stroke={c} strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
      </svg>
    );
  };

  /* GREENERY - positioned around the dome EDGES, close to flowers */
  const renderGreenery = () => {
    if (greeneryStyle === 'none' || n === 0) return null;

    const configs = [
      { angle: -40, dist: 55, scale: 1.0 },
      { angle: 40, dist: 55, scale: 1.0 },
      { angle: -65, dist: 48, scale: 0.8 },
      { angle: 65, dist: 48, scale: 0.8 },
      { angle: -18, dist: 58, scale: 0.9 },
      { angle: 18, dist: 58, scale: 0.9 },
      { angle: -80, dist: 42, scale: 0.7 },
      { angle: 80, dist: 42, scale: 0.7 },
    ];

    const count = Math.min(n + 2, configs.length);

    return configs.slice(0, count).map((cfg, i) => {
      const rad = (cfg.angle - 90) * Math.PI / 180;
      const lx = Math.cos(rad) * cfg.dist;
      const ly = -Math.sin(rad) * cfg.dist;

      const useFern = greeneryStyle === 'ferns' || (greeneryStyle === 'mixed' && i % 2 === 0);

      return (
        <motion.div
          key={`leaf-${i}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={{ delay: 0.1 + i * 0.04, type: 'spring', damping: 15 }}
          className="absolute"
          style={{
            left: `calc(50% + ${lx}px)`,
            top: `calc(50% + ${ly}px)`,
            transform: `rotate(${cfg.angle}deg) scale(${cfg.scale})`,
            transformOrigin: 'bottom center',
            zIndex: 3,
          }}
        >
          {useFern ? (
            <svg width="24" height="60" viewBox="0 0 24 60" fill="none">
              <path d="M12 60 L12 0" stroke="#3a7233" strokeWidth="1.5" opacity="0.6" />
              {[6, 16, 26, 36, 46].map((yy, j) => (
                <g key={j}>
                  <path d={`M12 ${yy} Q${2} ${yy - 4} ${4} ${yy - 7}`} stroke="#3a7e32" strokeWidth="1.2" fill="#4a8e42" fillOpacity="0.4" />
                  <path d={`M12 ${yy} Q${22} ${yy - 4} ${20} ${yy - 7}`} stroke="#3a7e32" strokeWidth="1.2" fill="#4a8e42" fillOpacity="0.4" />
                </g>
              ))}
            </svg>
          ) : (
            <svg width="20" height="55" viewBox="0 0 20 55" fill="none">
              <path d="M10 55 L10 0" stroke="#5a8c6c" strokeWidth="1.2" opacity="0.5" />
              {[8, 20, 32, 44].map((yy, j) => (
                <ellipse key={j} cx={j % 2 === 0 ? 5 : 15} cy={yy} rx="6" ry="4.5" fill="#6a9c7c" opacity={0.4} />
              ))}
            </svg>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {recipientName && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono-label text-warm-wine mb-2 text-center">
          For {recipientName}
        </motion.p>
      )}

      {/* ═══ COMPLETE BOUQUET ═══ */}
      <div className="relative flex flex-col items-center">

        {/* ── FLOWER DOME + GREENERY ── */}
        <div className="relative flex items-center justify-center" style={{ width: '280px', height: '170px' }}>
          {renderGreenery()}
          <AnimatePresence mode="popLayout">
            {selectedFlowers.map((flower, i) => {
              const pos = flowerPositions[i];
              if (!pos) return null;
              return (
                <motion.div
                  key={`${flower.id}-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: i * 0.06 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${pos.x}px - ${pos.size / 2}px)`,
                    top: `calc(45% + ${-pos.y}px - ${pos.size / 2}px)`,
                    zIndex: pos.z,
                    width: pos.size,
                    height: pos.size,
                  }}
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="w-full h-full object-contain drop-shadow-md"
                    style={{ transform: `rotate(${pos.angle}deg)` }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ── BOW at junction (overlaps onto wrapping top) ── */}
        {bouquet.bowStyle !== 'minimal' && n > 0 && bow && (
          <div className="relative z-[25] flex justify-center" style={{ marginTop: '-28px', marginBottom: '-16px' }}>
            {renderBow()}
          </div>
        )}

        {/* ── WRAPPING PAPER (directly touching flowers, no gap) ── */}
        {showWrapping && (
          <div className="relative z-[8]" style={{ marginTop: bouquet.bowStyle !== 'minimal' ? '-6px' : '-28px' }}>
            {renderWrapping()}
          </div>
        )}
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
