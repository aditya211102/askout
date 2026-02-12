import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, ChevronDown, Sparkles, Type, Wand2, Palette, Eye } from 'lucide-react';
import {
  type CrushCard,
  type CardTheme,
  type NoButtonTrick,
  type StickerType,
  THEMES,
  TRICKS,
  STICKERS,
} from '@/lib/card-types';
import { Badge } from '@/components/ui/badge';
import CardPreview from '@/components/CardPreview';

type SectionId = 'names' | 'trick' | 'stickers' | 'theme';

const CreateCard = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(['names']));
  const [showPreview, setShowPreview] = useState(false);
  const [card, setCard] = useState<CrushCard>({
    theme: 'classic',
    question: 'Will you be my Valentine?',
    yesMessage: 'I promise to buy you snacks and send you cute cat memes!',
    noButtonTrick: 'runaway',
    stickers: [],
  });

  const updateCard = (updates: Partial<CrushCard>) => setCard((prev) => ({ ...prev, ...updates }));

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canPreview = card.question.trim().length > 0 && card.yesMessage.trim().length > 0;

  const handleSaveAndShare = () => {
    sessionStorage.setItem('pendingCard', JSON.stringify(card));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">
      {/* Header */}
      <header className="py-3 px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <span className="font-display text-lg font-bold">Valentine Maker</span>
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            className="max-w-2xl mx-auto px-4 py-8"
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Create Your Card</h1>
              <p className="text-muted-foreground">Customize every detail, then preview it</p>
            </div>

            <div className="space-y-4">
              {/* Names & Message Section */}
              <AccordionSection
                id="names"
                icon={<Heart className="w-5 h-5 text-primary fill-primary" />}
                title="Names & Message"
                isOpen={openSections.has('names')}
                onToggle={() => toggleSection('names')}
              >
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Their Name</label>
                    <Input
                      value={card.recipientName || ''}
                      onChange={(e) => updateCard({ recipientName: e.target.value })}
                      placeholder="e.g. Sarah"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Your Name</label>
                    <Input
                      value={card.senderName || ''}
                      onChange={(e) => updateCard({ senderName: e.target.value })}
                      placeholder="e.g. Alex"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-foreground flex items-center gap-1.5">
                      <Type className="w-4 h-4" /> Card Title
                    </label>
                    <Input
                      value={card.question}
                      onChange={(e) => updateCard({ question: e.target.value })}
                      placeholder="Will you be my Valentine?"
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Customize the main question on the card</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block text-foreground">Sweet Note</label>
                    <Textarea
                      value={card.yesMessage}
                      onChange={(e) => updateCard({ yesMessage: e.target.value })}
                      placeholder="I promise to buy you snacks and send you cute cat memes!"
                      rows={3}
                      maxLength={300}
                    />
                  </div>
                </div>
              </AccordionSection>

              {/* No Button Trick Section */}
              <AccordionSection
                id="trick"
                icon={<Wand2 className="w-5 h-5 text-primary" />}
                title={`"No" Button Trick`}
                isOpen={openSections.has('trick')}
                onToggle={() => toggleSection('trick')}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.entries(TRICKS) as [NoButtonTrick, typeof TRICKS[NoButtonTrick]][]).map(([key, trick]) => (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateCard({ noButtonTrick: key })}
                      className={`p-4 rounded-xl text-left transition-all border-2 ${
                        card.noButtonTrick === key
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{trick.emoji}</span>
                        <div>
                          <div className="font-semibold text-sm">{trick.name}</div>
                          <div className="text-xs text-muted-foreground">{trick.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </AccordionSection>

              {/* Stickers Section */}
              <AccordionSection
                id="stickers"
                icon={<Sparkles className="w-5 h-5 text-primary" />}
                title="Sticker / Decoration"
                isOpen={openSections.has('stickers')}
                onToggle={() => toggleSection('stickers')}
              >
                <p className="text-xs text-muted-foreground mb-3">Shown on the card</p>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {(Object.entries(STICKERS) as [StickerType, typeof STICKERS[StickerType]][]).map(([key, sticker]) => {
                    const isAdded = card.stickers.some((s) => s.type === key);
                    return (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => {
                          if (isAdded) {
                            updateCard({ stickers: card.stickers.filter((s) => s.type !== key) });
                          } else {
                            updateCard({
                              stickers: [
                                ...card.stickers,
                                {
                                  type: key,
                                  x: 10 + Math.random() * 80,
                                  y: 10 + Math.random() * 80,
                                  scale: 0.8 + Math.random() * 0.4,
                                  rotation: (Math.random() - 0.5) * 30,
                                },
                              ],
                            });
                          }
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          isAdded
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <span className="text-3xl block">{sticker.emoji}</span>
                        <div className="text-xs text-muted-foreground mt-1">{sticker.name}</div>
                        {isAdded && (
                          <div className="text-[10px] text-primary font-semibold mt-0.5">Added ✓</div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                {card.stickers.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => updateCard({ stickers: [] })} className="text-muted-foreground">
                    Clear all ({card.stickers.length})
                  </Button>
                )}
              </AccordionSection>

              {/* Theme Section */}
              <AccordionSection
                id="theme"
                icon={<Palette className="w-5 h-5 text-primary" />}
                title="Card Theme"
                isOpen={openSections.has('theme')}
                onToggle={() => toggleSection('theme')}
              >
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(THEMES) as [CardTheme, typeof THEMES[CardTheme]][]).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => updateCard({ theme: key })}
                      className={`p-3 rounded-xl text-left transition-all border-2 ${
                        card.theme === key
                          ? 'border-primary shadow-md ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg mb-2 ${theme.bg} relative`}>
                        {theme.premium && (
                          <Badge className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 text-[10px] px-1.5 py-0 shadow-sm">
                            ✦ Premium
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{theme.emoji}</span>
                        <div>
                          <div className="font-semibold text-xs">{theme.name}</div>
                          <div className="text-[10px] text-muted-foreground">{theme.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </AccordionSection>
            </div>

            {/* Preview Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => setShowPreview(true)}
                disabled={!canPreview}
                size="lg"
                className="rounded-full text-lg px-10 py-6 animate-pulse-glow"
              >
                <Eye className="w-5 h-5 mr-2" /> Preview Your Card
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="max-w-lg mx-auto px-4 py-8"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl font-bold text-foreground mb-1">Preview</h2>
              <p className="text-muted-foreground text-sm">Try clicking the buttons! This is what they'll see.</p>
            </div>

            <CardPreview card={card} interactive />

            <div className="flex items-center gap-4 mt-8 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8"
                onClick={() => setShowPreview(false)}
              >
                Go Back & Edit
              </Button>
              <Button
                size="lg"
                className="rounded-full px-8 bg-gradient-to-r from-primary to-rose-500 text-primary-foreground animate-pulse-glow"
                onClick={handleSaveAndShare}
              >
                Save & Share 💕
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Reusable accordion section */
const AccordionSection = ({
  id,
  icon,
  title,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-display text-lg font-semibold text-foreground">{title}</span>
      </div>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-5 pb-5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default CreateCard;
