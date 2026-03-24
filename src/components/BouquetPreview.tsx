import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { FLOWERS, BOW_STYLES, type BouquetConfig, type PlacedFlower } from '@/lib/bouquet-types';

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

const resolveWrapSettings = (bouquet: BouquetConfig) => {
  const legacy = bouquet.wrappingPattern;
  const style = bouquet.wrappingStyle
    || (legacy === 'layered' ? 'layered' : legacy === 'market' ? 'market' : legacy === 'none' ? 'none' : 'cone');
  const color = bouquet.wrappingColor
    || (legacy === 'ivory' || legacy === 'sage' || legacy === 'blush' || legacy === 'charcoal' || legacy === 'kraft'
      ? legacy
      : legacy === 'layered'
        ? 'blush'
        : legacy === 'market'
          ? 'kraft'
          : 'kraft');

  return { style, color };
};

const getDisplayRotation = (_flowerId: string, rotation: number) => rotation;

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
  const wrap = resolveWrapSettings(bouquet);
  const bow = BOW_STYLES.find((b) => b.id === bouquet.bowStyle);
  const count = bouquet.placedFlowers.length;
  const { greeneryStyle = 'mixed' } = bouquet;
  const showWrapping = count > 0 && wrap.style !== 'none';
  const wrapOffset = wrap.style === 'layered'
    ? (count >= 8 ? '-120px' : count >= 5 ? '-112px' : '-104px')
    : wrap.style === 'market'
      ? (count >= 8 ? '-112px' : count >= 5 ? '-104px' : '-96px')
      : (count >= 8 ? '-108px' : count >= 5 ? '-100px' : '-92px');
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

    if (wrap.style === 'layered') {
      const width = 214 + Math.min(count, 10) * 5;
      const height = 176 + Math.min(count, 10) * 4;
      const layeredCone =
        wrap.color === 'ivory' ? ['#f4efe7', '#e5ddd1']
        : wrap.color === 'sage' ? ['#dfe9d8', '#b8c9ad']
        : wrap.color === 'charcoal' ? ['#6b6766', '#3c3938']
        : wrap.color === 'kraft' ? ['#ead2a1', '#d5b071']
        : ['#f6d4db', '#efb9c4'];
      const layeredSheet =
        wrap.color === 'charcoal' ? 'rgba(255,255,255,0.14)'
        : wrap.color === 'sage' ? 'rgba(246,250,243,0.74)'
        : wrap.color === 'ivory' ? 'rgba(255,255,255,0.88)'
        : 'rgba(255,253,250,0.50)';

      return (
        <div
          className="relative z-[8] flex justify-center"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.12))',
          }}
        >
          <svg viewBox="0 0 200 160" className="h-full w-full">
            <defs>
              <linearGradient id="layeredCone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={layeredCone[0]} />
                <stop offset="100%" stopColor={layeredCone[1]} />
              </linearGradient>
              <linearGradient id="layeredShadow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
                <stop offset="100%" stopColor="rgba(120,88,96,0.14)" />
              </linearGradient>
            </defs>

            <path d="M16 36 L88 58 L74 148 L18 148 Z" fill={layeredSheet} />
            <path d="M184 36 L112 58 L126 148 L182 148 Z" fill={layeredSheet} />
            <path d="M54 54 L146 54 Q138 88 120 148 L80 148 Q62 88 54 54 Z" fill="url(#layeredCone)" />
            <path d="M92 58 L108 58 L104 148 L96 148 Z" fill="rgba(117,82,90,0.10)" />
            <path d="M62 60 Q100 38 138 60" stroke="rgba(255,255,255,0.34)" strokeWidth="1.5" fill="none" />
            <path d="M52 54 L148 54 Q132 42 100 42 Q68 42 52 54 Z" fill="rgba(255,255,255,0.12)" />
            <path d="M20 40 L86 60 L72 84 L24 68 Z" fill={layeredSheet} />
            <path d="M180 40 L114 60 L128 84 L176 68 Z" fill={layeredSheet} />
            <path d="M54 54 L146 54 Q138 88 120 148 L80 148 Q62 88 54 54 Z" fill="url(#layeredShadow)" opacity="0.24" />
          </svg>
        </div>
      );
    }

    if (wrap.style === 'market') {
      const width = 220 + Math.min(count, 10) * 5;
      const height = 176 + Math.min(count, 10) * 4;
      const marketPaper =
        wrap.color === 'ivory' ? ['#f6f1e7', '#d9cdbd']
        : wrap.color === 'sage' ? ['#dbe8d4', '#a9be9e']
        : wrap.color === 'blush' ? ['#f5dbd7', '#dba29d']
        : wrap.color === 'charcoal' ? ['#595756', '#2a2928']
        : ['#eed4a3', '#c7984f'];

      return (
        <div
          className="relative z-[8] flex justify-center"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.12))',
          }}
        >
          <svg viewBox="0 0 200 160" className="h-full w-full">
            <defs>
              <linearGradient id="marketPaper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={marketPaper[0]} />
                <stop offset="100%" stopColor={marketPaper[1]} />
              </linearGradient>
              <linearGradient id="marketEdge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                <stop offset="100%" stopColor="rgba(120,95,68,0.14)" />
              </linearGradient>
            </defs>

            <path d="M32 36 L88 46 L80 148 L28 148 Z" fill="url(#marketEdge)" opacity="0.46" />
            <path d="M168 36 L112 46 L120 148 L172 148 Z" fill="url(#marketEdge)" opacity="0.46" />
            <path d="M46 38 L154 38 L138 148 L62 148 Z" fill="url(#marketPaper)" />
            <path d="M52 40 Q100 30 148 40" stroke="rgba(255,246,223,0.44)" strokeWidth="2" fill="none" />
            <path d="M92 40 L108 40 L104 148 L96 148 Z" fill="rgba(114,80,34,0.08)" />
          </svg>
        </div>
      );
    }

    const fullness = Math.min(count, 12);
    const wrapWidth = 208 + fullness * 5;
    const wrapHeight = 164 + fullness * 4;
    const topInset = 18 - Math.min(count, 6);

    const colorMap: Record<string, { top: string; bottom: string }> = {
      kraft: { top: '#ecd29a', bottom: '#c59648' },
      ivory: { top: '#fffef9', bottom: '#e7ddd2' },
      sage: { top: '#e2eedf', bottom: '#9ab391' },
      blush: { top: '#fde6e4', bottom: '#e0a6a0' },
      charcoal: { top: '#575654', bottom: '#232321' },
    };

    const colors = colorMap[wrap.color] || colorMap.kraft;
    const patternStroke = wrap.color === 'charcoal' ? 'rgba(255,255,255,0.08)' : 'rgba(120,95,68,0.12)';
    const edgeShade = wrap.color === 'charcoal' ? 'rgba(255,255,255,0.06)' : 'rgba(92,69,44,0.08)';
    const innerSheet = wrap.color === 'ivory'
      ? 'rgba(255,255,255,0.96)'
      : wrap.color === 'charcoal'
        ? 'rgba(247,247,245,0.16)'
        : wrap.color === 'sage'
          ? 'rgba(246,250,243,0.88)'
          : wrap.color === 'blush'
            ? 'rgba(255,244,241,0.9)'
            : 'rgba(255,247,232,0.82)';

    return (
      <div
        className="relative z-[8] flex justify-center drop-shadow-2xl"
        style={{
          width: `${wrapWidth}px`,
          height: `${wrapHeight}px`,
          filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.14))',
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
            <linearGradient id="wrapShadow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(0,0,0,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
            </linearGradient>
            <filter id="texture">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
              <feBlend mode="multiply" in="texture" in2="SourceGraphic" />
            </filter>
          </defs>

          <path d={`M30 ${topInset + 2} L84 ${topInset + 20} L70 100 L28 90 Z`} fill={innerSheet} opacity="0.92" />
          <path d={`M170 ${topInset + 2} L116 ${topInset + 20} L130 100 L172 90 Z`} fill={innerSheet} opacity="0.92" />
          <path d={`M34 ${topInset + 10} L86 ${topInset + 22} L72 148 L34 148 Q28 106 34 ${topInset + 10} Z`} fill="url(#wrapEdge)" opacity="0.68" />
          <path d={`M166 ${topInset + 10} L114 ${topInset + 22} L128 148 L166 148 Q172 106 166 ${topInset + 10} Z`} fill="url(#wrapEdge)" opacity="0.68" />
          <path d={`M58 ${topInset + 20} L142 ${topInset + 20} Q136 58 118 146 L82 146 Q64 58 58 ${topInset + 20} Z`} fill="url(#wrapGrad)" filter="url(#texture)" />
          <path d={`M62 ${topInset + 20} L138 ${topInset + 20} Q120 42 100 42 Q80 42 62 ${topInset + 20} Z`} fill="rgba(255,255,255,0.12)" />
          <path d={`M72 ${topInset + 24} Q100 ${topInset + 30} 128 ${topInset + 24}`} stroke="rgba(255,255,255,0.24)" strokeWidth="1.3" fill="none" />
          <path d="M94 48 L106 48 L103 146 L97 146 Z" fill="url(#wrapShadow)" opacity="0.42" />

          <g opacity={wrap.color === 'kraft' ? 0.28 : wrap.color === 'charcoal' ? 0.18 : 0.22}>
            {wrap.color === 'blush' && (
              <>
                <path d="M58 56 C84 48 116 48 142 56" stroke={patternStroke} strokeWidth="1.8" fill="none" />
                <path d="M64 88 C86 82 114 82 136 88" stroke={patternStroke} strokeWidth="1.8" fill="none" />
              </>
            )}
            {wrap.color === 'sage' && (
              <>
                <path d="M68 52 C80 70 80 96 72 134" stroke={patternStroke} strokeWidth="1.4" fill="none" />
                <path d="M132 52 C120 70 120 96 128 134" stroke={patternStroke} strokeWidth="1.4" fill="none" />
              </>
            )}
            {wrap.color === 'ivory' && (
              <>
                <path d="M58 60 C82 54 118 54 142 60" stroke={patternStroke} strokeWidth="1.3" fill="none" />
                <path d="M62 92 C84 88 116 88 138 92" stroke={patternStroke} strokeWidth="1.3" fill="none" />
              </>
            )}
            {wrap.color === 'kraft' && (
              <>
                <circle cx="70" cy="64" r="1.8" fill={patternStroke} />
                <circle cx="128" cy="80" r="1.8" fill={patternStroke} />
                <circle cx="92" cy="102" r="1.5" fill={patternStroke} />
              </>
            )}
            {wrap.color === 'charcoal' && (
              <>
                <path d="M60 58 C84 52 116 52 140 58" stroke={patternStroke} strokeWidth="1.6" fill="none" />
                <path d="M66 98 C86 92 114 92 134 98" stroke={patternStroke} strokeWidth="1.6" fill="none" />
              </>
            )}
          </g>
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
        style={{ top: count >= 8 ? '18px' : '20px' }}
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
        x: -30,
        y: -18,
        angle: -16,
        scale: 0.78,
        variant: greeneryStyle === 'mixed' ? 'eucalyptus' : greeneryStyle,
      },
      {
        x: 28,
        y: -16,
        angle: 14,
        scale: 0.76,
        variant: greeneryStyle === 'mixed' ? 'ferns' : greeneryStyle,
      },
      {
        x: 2,
        y: -10,
        angle: 2,
        scale: 0.64,
        variant: greeneryStyle === 'ferns' ? 'ferns' : 'eucalyptus',
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

      const opacity = greeneryStyle === 'mixed' ? 0.48 : greeneryStyle === 'eucalyptus' ? 0.42 : 0.5;

      return (
        <motion.div
          key={`leaf-${index}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity }}
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
            <svg width="34" height="68" viewBox="0 0 34 68" fill="none" className="drop-shadow-sm">
              <defs>
                <linearGradient id={`fernStem-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#91ad87" />
                  <stop offset="55%" stopColor="#628055" />
                  <stop offset="100%" stopColor="#35533a" />
                </linearGradient>
              </defs>
              <path d="M17 62 C17 48 17 30 17 10" stroke={`url(#fernStem-${index})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.58" />
              {[18, 26, 34, 42, 50, 58].map((yy, idx) => (
                <g key={idx}>
                  <path d={`M17 ${yy} C9 ${yy - 3} 8 ${yy - 8} 9 ${yy - 13}`} stroke="#66855c" strokeWidth="1" strokeLinecap="round" opacity="0.58" />
                  <path d={`M17 ${yy} C25 ${yy - 3} 26 ${yy - 8} 25 ${yy - 13}`} stroke="#66855c" strokeWidth="1" strokeLinecap="round" opacity="0.58" />
                </g>
              ))}
            </svg>
          ) : (
            <svg width="32" height="62" viewBox="0 0 32 62" fill="none" className="drop-shadow-sm">
              <defs>
                <linearGradient id={`eucalyptusStem-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ab299" />
                  <stop offset="100%" stopColor="#647a67" />
                </linearGradient>
              </defs>
              <path d="M16 56 C16 44 16 28 16 10" stroke={`url(#eucalyptusStem-${index})`} strokeWidth="1.2" strokeLinecap="round" opacity="0.34" />
              {[18, 26, 34, 42, 50].map((yy, idx) => (
                <g key={idx}>
                  <path
                    d={idx % 2 === 0
                      ? `M16 ${yy} C9 ${yy - 3} 8 ${yy - 8} 12 ${yy - 12} C16 ${yy - 15} 22 ${yy - 11} 21 ${yy - 6} C20 ${yy - 1} 16 ${yy + 1} 16 ${yy}`
                      : `M16 ${yy} C23 ${yy - 3} 24 ${yy - 8} 20 ${yy - 12} C16 ${yy - 15} 10 ${yy - 11} 11 ${yy - 6} C12 ${yy - 1} 16 ${yy + 1} 16 ${yy}`}
                    fill="#96ae99"
                    opacity="0.38"
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
                    rotate: getDisplayRotation(placedFlower.flowerId, placedFlower.rotation),
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

        <div className="relative flex w-full justify-center" style={{ marginTop: wrapOffset }}>
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
