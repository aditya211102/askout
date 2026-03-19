import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { FLOWERS, BOW_STYLES, WRAPPING_PATTERNS, type BouquetConfig, type PlacedFlower } from '@/lib/bouquet-types';

interface BouquetPreviewProps {
  bouquet: BouquetConfig;
  senderName?: string;
  recipientName?: string;
  onUpdateFlower?: (id: string, updates: Partial<PlacedFlower>) => void;
  onRemoveFlower?: (id: string) => void;
  onMoveFlowerForward?: (id: string) => void;
  onMoveFlowerBackward?: (id: string) => void;
  isEditable?: boolean;
}

const BOUQUET_BOUNDS = {
  maxRadiusX: 112,
  maxTop: -104,
  maxBottom: 58,
};

const clampFlowerPosition = (x: number, y: number) => {
  const clampedY = Math.min(BOUQUET_BOUNDS.maxBottom, Math.max(BOUQUET_BOUNDS.maxTop, y));
  const verticalProgress = (clampedY - BOUQUET_BOUNDS.maxTop) / (BOUQUET_BOUNDS.maxBottom - BOUQUET_BOUNDS.maxTop);
  const widthFactor = 1 - verticalProgress * 0.58;
  const maxX = Math.max(42, BOUQUET_BOUNDS.maxRadiusX * widthFactor);
  const clampedX = Math.min(maxX, Math.max(-maxX, x));

  return { x: clampedX, y: clampedY };
};

const GUIDE_SLOTS = [
  { x: 0, y: -64 },
  { x: -42, y: -34 },
  { x: 42, y: -34 },
  { x: -74, y: 0 },
  { x: 74, y: 0 },
  { x: -24, y: 16 },
  { x: 24, y: 16 },
];

const BouquetPreview = ({
  bouquet,
  senderName,
  recipientName,
  onUpdateFlower,
  onRemoveFlower,
  onMoveFlowerForward,
  onMoveFlowerBackward,
  isEditable = false,
}: BouquetPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFlowerId, setSelectedFlowerId] = useState<string | null>(null);
  const wrapping = WRAPPING_PATTERNS.find((w) => w.id === bouquet.wrappingPattern);
  const bow = BOW_STYLES.find((b) => b.id === bouquet.bowStyle);
  const count = bouquet.placedFlowers.length;
  const { greeneryStyle = 'mixed' } = bouquet;
  const showWrapping = wrapping && wrapping.id !== 'none';
  const orderedFlowers = useMemo(
    () => [...bouquet.placedFlowers].sort((a, b) => a.zIndex - b.zIndex),
    [bouquet.placedFlowers],
  );
  const selectedFlower = orderedFlowers.find((flower) => flower.id === selectedFlowerId) || null;

  useEffect(() => {
    if (!selectedFlowerId) return;
    if (!bouquet.placedFlowers.some((flower) => flower.id === selectedFlowerId)) {
      setSelectedFlowerId(null);
    }
  }, [bouquet.placedFlowers, selectedFlowerId]);

  const renderWrapping = () => {
    if (!showWrapping) return null;

    const wrapWidth = 176 + Math.min(count, 10) * 5;
    const wrapHeight = 136 + Math.min(count, 10) * 3;
    const topInset = 18 - Math.min(count, 8);

    const colorMap: Record<string, { top: string; bottom: string }> = {
      kraft: { top: '#fceaa1', bottom: '#e0b85c' },
      ivory: { top: '#ffffff', bottom: '#e8e0d5' },
      sage: { top: '#e3f0d5', bottom: '#9eb88d' },
      blush: { top: '#ffebe8', bottom: '#e39d95' },
      charcoal: { top: '#5e5e5e', bottom: '#262626' },
    };

    const colors = colorMap[wrapping.id] || colorMap.kraft;
    const patternStroke = wrapping.id === 'charcoal' ? 'rgba(255,255,255,0.08)' : 'rgba(120,95,68,0.12)';
    const edgeShade = wrapping.id === 'charcoal' ? 'rgba(255,255,255,0.06)' : 'rgba(92,69,44,0.08)';

    return (
      <div
        className="relative z-[8] flex justify-center drop-shadow-2xl"
        style={{
          width: `${wrapWidth}px`,
          height: `${wrapHeight}px`,
          filter: 'drop-shadow(0 22px 28px rgba(0,0,0,0.14))',
        }}
      >
        <svg viewBox="0 0 200 150" className="h-full w-full">
          <defs>
            <linearGradient id="wrapGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.top} />
              <stop offset="100%" stopColor={colors.bottom} />
            </linearGradient>
            <linearGradient id="wrapEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
              <stop offset="100%" stopColor={edgeShade} />
            </linearGradient>
            <filter id="texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
              <feBlend mode="multiply" in="texture" in2="SourceGraphic" />
            </filter>
            <clipPath id="wrapClip">
              <path d={`M32 ${topInset} L168 ${topInset} Q176 54 156 142 L44 142 Q24 54 32 ${topInset} Z`} />
            </clipPath>
          </defs>

          <path d={`M26 ${topInset + 6} L74 ${topInset + 12} L58 144 L18 144 Q20 78 26 ${topInset + 6} Z`} fill="url(#wrapEdge)" opacity="0.7" />
          <path d={`M174 ${topInset + 6} L126 ${topInset + 12} L142 144 L182 144 Q180 78 174 ${topInset + 6} Z`} fill="url(#wrapEdge)" opacity="0.7" />

          <path d={`M32 ${topInset} L168 ${topInset} Q176 54 156 142 L44 142 Q24 54 32 ${topInset} Z`} fill="url(#wrapGrad)" filter="url(#texture)" />

          <g clipPath="url(#wrapClip)" opacity={wrapping.id === 'kraft' ? 0.28 : wrapping.id === 'charcoal' ? 0.18 : 0.22}>
            {wrapping.id === 'blush' && (
              <>
                <path d="M24 48 C78 34 132 34 178 50" stroke={patternStroke} strokeWidth="2" fill="none" />
                <path d="M20 84 C76 68 136 70 182 88" stroke={patternStroke} strokeWidth="2" fill="none" />
              </>
            )}
            {wrapping.id === 'sage' && (
              <>
                <path d="M52 30 C82 64 74 94 60 136" stroke={patternStroke} strokeWidth="1.8" fill="none" />
                <path d="M148 28 C120 66 128 96 142 136" stroke={patternStroke} strokeWidth="1.8" fill="none" />
              </>
            )}
            {wrapping.id === 'ivory' && (
              <>
                <path d="M36 56 C78 46 126 48 166 60" stroke={patternStroke} strokeWidth="1.6" fill="none" />
                <path d="M42 96 C88 88 120 88 160 98" stroke={patternStroke} strokeWidth="1.6" fill="none" />
              </>
            )}
            {wrapping.id === 'kraft' && (
              <>
                <circle cx="58" cy="56" r="2.4" fill={patternStroke} />
                <circle cx="136" cy="72" r="2" fill={patternStroke} />
                <circle cx="88" cy="98" r="1.8" fill={patternStroke} />
              </>
            )}
            {wrapping.id === 'charcoal' && (
              <>
                <path d="M40 44 C82 38 126 40 166 50" stroke={patternStroke} strokeWidth="1.8" fill="none" />
                <path d="M34 104 C78 96 126 98 170 110" stroke={patternStroke} strokeWidth="1.8" fill="none" />
              </>
            )}
          </g>

          <path d={`M32 ${topInset} L168 ${topInset} Q148 34 100 42 Q52 34 32 ${topInset} Z`} fill="rgba(255,255,255,0.16)" />
          <path d={`M42 ${topInset + 8} Q100 ${topInset + 18} 158 ${topInset + 8}`} stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    );
  };

  const renderBow = () => {
    if (bouquet.bowStyle === 'minimal' || count === 0 || !bow) return null;

    const color = bow.color;
    return (
      <svg
        width={count >= 8 ? 102 : 90}
        height={count >= 8 ? 56 : 50}
        viewBox="0 0 90 50"
        className="absolute z-[25] drop-shadow-lg"
        style={{ top: count >= 8 ? '-18px' : '-15px' }}
      >
        <defs>
          <filter id="bowShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        <path d="M45 25 Q35 45 25 50" stroke={color} strokeWidth="4" fill="none" filter="url(#bowShadow)" strokeLinecap="round" />
        <path d="M45 25 Q55 45 65 50" stroke={color} strokeWidth="4" fill="none" filter="url(#bowShadow)" strokeLinecap="round" />
        <ellipse cx="25" cy="20" rx="20" ry="12" fill={color} filter="url(#bowShadow)" transform="rotate(-15 25 20)" />
        <ellipse cx="65" cy="20" rx="20" ry="12" fill={color} filter="url(#bowShadow)" transform="rotate(15 65 20)" />
        <ellipse cx="45" cy="22" rx="8" ry="7" fill={color} filter="url(#bowShadow)" />
      </svg>
    );
  };

  const renderGreenery = () => {
    if (greeneryStyle === 'none' || count === 0) return null;

    const anchors = [
      {
        x: -50,
        y: 18,
        angle: -14,
        scale: 1.02,
        variant: greeneryStyle === 'mixed' ? 'ferns' : greeneryStyle,
      },
      {
        x: -8,
        y: 24,
        angle: -4,
        scale: 0.92,
        variant: greeneryStyle === 'ferns' ? 'ferns' : 'eucalyptus',
      },
      {
        x: 42,
        y: 20,
        angle: 12,
        scale: 0.98,
        variant: greeneryStyle === 'mixed' ? 'eucalyptus' : greeneryStyle,
      },
    ].filter((_, index) => {
      if (count <= 3) return index < 1;
      if (count <= 6) return index < 2;
      return true;
    }) as Array<{
      x: number;
      y: number;
      angle: number;
      scale: number;
      variant: 'eucalyptus' | 'ferns' | 'mixed';
    }>;

    return anchors.map((anchor, index) => {
      const useFern = anchor.variant === 'ferns';

      return (
        <motion.div
          key={`leaf-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.68 }}
          transition={{ delay: 0.08 + index * 0.05, type: 'spring', damping: 16 }}
          className="absolute z-[3]"
          style={{
            left: `calc(50% + ${anchor.x}px)`,
            top: `calc(50% + ${anchor.y}px)`,
            transform: `rotate(${anchor.angle}deg) scale(${anchor.scale})`,
            transformOrigin: 'bottom center',
          }}
        >
          {useFern ? (
            <svg width="40" height="92" viewBox="0 0 40 92" fill="none" className="drop-shadow-sm">
              <defs>
                <linearGradient id={`fernStem-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9bcf86" />
                  <stop offset="55%" stopColor="#5ea25b" />
                  <stop offset="100%" stopColor="#3d7741" />
                </linearGradient>
              </defs>
              <path d="M20 88 C19 68 19 46 20 10" stroke={`url(#fernStem-${index})`} strokeWidth="2.3" strokeLinecap="round" opacity="0.88" />
              {[22, 32, 42, 52, 62, 72].map((yy, idx) => (
                <g key={idx}>
                  <path d={`M20 ${yy} C10 ${yy - 3} 8 ${yy - 10} 10 ${yy - 17}`} stroke="#4f964d" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                  <path d={`M20 ${yy} C30 ${yy - 3} 32 ${yy - 10} 30 ${yy - 17}`} stroke="#4f964d" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                  <path d={`M20 ${yy + 1} C13 ${yy - 1} 12 ${yy - 6} 13 ${yy - 11}`} stroke="#9ad68f" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  <path d={`M20 ${yy + 1} C27 ${yy - 1} 28 ${yy - 6} 27 ${yy - 11}`} stroke="#9ad68f" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                </g>
              ))}
            </svg>
          ) : (
            <svg width="30" height="72" viewBox="0 0 30 72" fill="none" className="drop-shadow-sm">
              <defs>
                <linearGradient id={`eucalyptusStem-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a9c3ad" />
                  <stop offset="100%" stopColor="#729079" />
                </linearGradient>
              </defs>
              <path d="M15 68 C15 54 15 40 15 10" stroke={`url(#eucalyptusStem-${index})`} strokeWidth="1.8" strokeLinecap="round" opacity="0.68" />
              {[20, 31, 42, 53].map((yy, idx) => (
                <g key={idx}>
                  <path
                    d={idx % 2 === 0
                      ? `M15 ${yy} C7 ${yy - 3} 6 ${yy - 10} 11 ${yy - 14} C15 ${yy - 17} 20 ${yy - 11} 19 ${yy - 5} C18 ${yy} 13 ${yy + 1} 15 ${yy}`
                      : `M15 ${yy} C23 ${yy - 3} 24 ${yy - 10} 19 ${yy - 14} C15 ${yy - 17} 10 ${yy - 11} 11 ${yy - 5} C12 ${yy} 17 ${yy + 1} 15 ${yy}`}
                    fill="#9ab5a1"
                    opacity="0.72"
                  />
                  <path
                    d={idx % 2 === 0
                      ? `M14 ${yy - 3} C11 ${yy - 6} 10 ${yy - 9} 12 ${yy - 11}`
                      : `M16 ${yy - 3} C19 ${yy - 6} 20 ${yy - 9} 18 ${yy - 11}`}
                    stroke="#dfe9de"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    opacity="0.4"
                  />
                </g>
              ))}
            </svg>
          )}
        </motion.div>
      );
    });
  };

  const renderCompositionGuide = () => {
    if (!isEditable) return null;

    return (
      <>
        <div
          className="absolute left-1/2 top-1/2 z-[1] h-[176px] w-[212px] -translate-x-1/2 -translate-y-[48%] rounded-[999px] border border-white/45"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(110, 92, 71, 0.03)' }}
        />
        <div className="absolute left-1/2 top-[62%] z-[1] h-[1px] w-[170px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c8bcaa] to-transparent opacity-50" />
        {GUIDE_SLOTS.map((slot, index) => (
          <div
            key={index}
            className="absolute z-[1] h-2.5 w-2.5 rounded-full border border-[#bda98e]/50 bg-white/55"
            style={{
              left: `calc(50% + ${slot.x}px)`,
              top: `calc(50% + ${slot.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div className="relative flex h-full w-full select-none flex-col items-center justify-center">
      {recipientName && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center font-mono-label tracking-widest text-warm-wine">
          WAITING FOR {recipientName.toUpperCase()}
        </motion.p>
      )}

      <div className="relative flex flex-col items-center" ref={containerRef}>
        <div className="relative flex items-center justify-center" style={{ width: '300px', height: '260px' }}>
          {renderCompositionGuide()}
          {renderGreenery()}

          <AnimatePresence mode="popLayout">
            {orderedFlowers.map((placedFlower) => {
              const flower = FLOWERS.find((item) => item.id === placedFlower.flowerId);
              if (!flower) return null;
              const isSelected = selectedFlowerId === placedFlower.id;

              return (
                <motion.div
                  key={placedFlower.id}
                  drag={isEditable}
                  dragConstraints={containerRef}
                  dragElastic={0.1}
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    if (onUpdateFlower && isEditable) {
                      const nextPosition = clampFlowerPosition(
                        placedFlower.x + info.offset.x,
                        placedFlower.y + info.offset.y,
                      );

                      onUpdateFlower(placedFlower.id, {
                        x: nextPosition.x,
                        y: nextPosition.y,
                      });
                    }
                  }}
                  whileHover={isEditable ? { cursor: 'grab' } : {}}
                  whileDrag={{ scale: placedFlower.scale * 1.1, cursor: 'grabbing', zIndex: 100 }}
                  onTap={() => {
                    if (isEditable) setSelectedFlowerId(placedFlower.id);
                  }}
                  onClick={() => {
                    if (isEditable) setSelectedFlowerId(placedFlower.id);
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    x: placedFlower.x,
                    y: placedFlower.y,
                    rotate: placedFlower.rotation,
                    scale: placedFlower.scale,
                    opacity: 1,
                    filter: isSelected ? 'drop-shadow(0 16px 22px rgba(91, 55, 43, 0.28))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))',
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="absolute group"
                  style={{
                    zIndex: placedFlower.zIndex,
                    width: '90px',
                    height: '90px',
                    touchAction: 'none',
                  }}
                >
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="pointer-events-none h-full w-full object-contain"
                  />

                  {isEditable && isSelected && (
                    <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/80 ring-offset-2 ring-offset-transparent" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="relative flex w-full justify-center" style={{ marginTop: '-40px' }}>
          {showWrapping && renderWrapping()}
          <div className="absolute top-0 flex w-full justify-center">
            {renderBow()}
          </div>
        </div>
      </div>

      {count === 0 && (
        <p className="mt-6 font-display text-sm italic text-muted-foreground">Canvas is empty. Add flowers above.</p>
      )}

      {isEditable && selectedFlower && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 w-full max-w-md rounded-[28px] border border-[#e8e0d5] bg-white/92 px-5 py-4 shadow-[0_18px_45px_rgba(54,36,23,0.08)] backdrop-blur"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono-label text-muted-foreground">Flower Tools</p>
              <p className="mt-1 font-display text-lg italic text-foreground">
                {FLOWERS.find((flower) => flower.id === selectedFlower.flowerId)?.name}
              </p>
            </div>
            <button
              onClick={() => setSelectedFlowerId(null)}
              className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Done
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#fffdfa] px-3 py-2 text-xs text-foreground shadow-sm transition-colors hover:bg-muted"
              onClick={() => onUpdateFlower?.(selectedFlower.id, { rotation: selectedFlower.rotation - 20 })}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rotate Left
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#fffdfa] px-3 py-2 text-xs text-foreground shadow-sm transition-colors hover:bg-muted"
              onClick={() => onUpdateFlower?.(selectedFlower.id, { rotation: selectedFlower.rotation + 20 })}
            >
              <RotateCw className="h-3.5 w-3.5" />
              Rotate Right
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#fffdfa] px-3 py-2 text-xs text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-40"
              onClick={() => onMoveFlowerBackward?.(selectedFlower.id)}
              disabled={!onMoveFlowerBackward}
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Send Back
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#fffdfa] px-3 py-2 text-xs text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-40"
              onClick={() => onMoveFlowerForward?.(selectedFlower.id)}
              disabled={!onMoveFlowerForward}
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Bring Forward
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 shadow-sm transition-colors hover:bg-red-100 disabled:opacity-40"
              onClick={() => {
                onRemoveFlower?.(selectedFlower.id);
                setSelectedFlowerId(null);
              }}
              disabled={!onRemoveFlower}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </motion.div>
      )}

      {bouquet.messageCard && bouquet.messageText && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-30 mt-8">
          <div className="absolute -top-3 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full bg-warm-wine shadow-md" />
          <div className="max-w-[260px] rounded-sm border border-[#e8e0d5] bg-[#fffdfa] p-6 text-center shadow-lg" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }}>
            <p className="font-display text-sm italic leading-relaxed text-foreground">"{bouquet.messageText}"</p>
            {senderName && <p className="mt-4 font-mono-label text-xs font-medium tracking-widest text-warm-wine">- {senderName}</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BouquetPreview;
