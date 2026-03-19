import { AnimatePresence, motion } from 'framer-motion';

interface EnvelopeProps {
    recipientName?: string;
    onOpen: () => void;
    isOpen: boolean;
}

const Envelope = ({ recipientName, onOpen, isOpen }: EnvelopeProps) => {
    return (
        <div
            className="relative w-[340px] h-[220px] cursor-pointer perspective-[1000px] group sm:w-[400px] sm:h-[260px]"
            onClick={!isOpen ? onOpen : undefined}
            role="button"
            tabIndex={isOpen ? -1 : 0}
            onKeyDown={(event) => {
                if (!isOpen && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onOpen();
                }
            }}
            aria-label={isOpen ? 'Envelope opening' : 'Open bouquet envelope'}
        >
            {/* Back of envelope (Texture) */}
            <div
                className="absolute inset-0 bg-[#e8e0d5] shadow-2xl overflow-hidden rounded-sm"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")'
                }}
            >
                {/* Inside pattern */}
                <div className="absolute inset-0 bg-warm-wine/5 pattern-dots" />
            </div>

            {/* Bottom Flap */}
            <div
                className="absolute inset-x-0 bottom-0 h-full origin-bottom"
                style={{ clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)' }}
            >
                <div className="absolute inset-0 bg-[#f4ebd8]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }} />
            </div>

            {/* Left Flap */}
            <div
                className="absolute inset-y-0 left-0 w-full origin-left drop-shadow-lg"
                style={{ clipPath: 'polygon(0 0, 55% 50%, 0 100%)' }}
            >
                <div className="absolute inset-0 bg-[#f0e6d3]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }} />
            </div>

            {/* Right Flap */}
            <div
                className="absolute inset-y-0 right-0 w-full origin-right drop-shadow-[-4px_0_8px_rgba(0,0,0,0.05)]"
                style={{ clipPath: 'polygon(100% 0, 45% 50%, 100% 100%)' }}
            >
                <div className="absolute inset-0 bg-[#f0e6d3]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }} />
            </div>

            {/* Top Flap (Animated) */}
            <motion.div
                initial={false}
                animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 0 : 20 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-0 h-[70%] origin-top drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformStyle: 'preserve-3d' }}
            >
                <div className="absolute inset-0 bg-[#fffdfa] backface-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")' }} />

                {/* Wax Seal */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-warm-wine rounded-full shadow-lg flex items-center justify-center border-2 border-warm-wine/80 group-hover:scale-105 transition-transform"
                            style={{
                                background: 'radial-gradient(circle at 35% 35%, #9d2b42, #5a1222)',
                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.2)'
                            }}
                        >
                            <span className="font-display italic text-white/50 text-sm">A</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Recipient Label on Front (but since we view from back of envelope, we put it here or as a hover text) */}
            {!isOpen && recipientName && (
                <motion.div
                    className="absolute -bottom-12 w-full text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="font-mono-label tracking-widest text-[#a89b88] text-xs uppercase bg-[#faf9f7] px-4 py-2 rounded-full border border-[#e8e0d5] shadow-sm">
                        PRIVATE: {recipientName}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default Envelope;
