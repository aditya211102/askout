import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, Eye, ArrowLeft } from 'lucide-react';
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
import PlanDialog, { type PlanType } from '@/components/PlanDialog';

type SectionId = 'names' | 'trick' | 'stickers' | 'theme';

const CreateCard = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(['names']));
  const [showPreview, setShowPreview] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [card, setCard] = useState<CrushCard>({
    theme: 'classic',
    question: 'Will you go out with me?',
    yesMessage: 'You just made my day! I can\'t wait to see you.',
    noButtonTrick: 'runaway',
    stickers: [],
  });

  const updateCard = (updates: Partial<CrushCard>) => setCard((prev) => ({ ...prev, ...updates }));
  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const canPreview = card.question.trim().length > 0 && card.yesMessage.trim().length > 0;

  const handlePlanSelect = (plan: PlanType) => {
    localStorage.setItem('pendingCard', JSON.stringify({ ...card, productType: 'askout' }));
    localStorage.setItem('pendingPlan', plan);
    localStorage.setItem('pendingProductType', 'askout');
    setShowPlanDialog(false);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background relative texture-grain">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-foreground hover:text-warm-wine transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono-label">Cards</span>
          </button>
          <span className="font-display text-sm text-muted-foreground italic">Ask Out Cards</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto px-6 py-12">
            <div className="mb-12">
              <p className="font-mono-label text-muted-foreground mb-3">Customize</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Create your card</h1>
            </div>

            <div className="space-y-3">
              <Section title="Names & Message" isOpen={openSections.has('names')} onToggle={() => toggleSection('names')}>
                <div className="space-y-5">
                  <Field label="Their name"><Input value={card.recipientName || ''} onChange={(e) => updateCard({ recipientName: e.target.value })} placeholder="Sarah" maxLength={50} className="bg-transparent" /></Field>
                  <Field label="Your name"><Input value={card.senderName || ''} onChange={(e) => updateCard({ senderName: e.target.value })} placeholder="Alex" maxLength={50} className="bg-transparent" /></Field>
                  <Field label="Your question"><Input value={card.question} onChange={(e) => updateCard({ question: e.target.value })} placeholder="Will you go out with me?" maxLength={100} className="bg-transparent" /></Field>
                  <Field label="Message after they say yes"><Textarea value={card.yesMessage} onChange={(e) => updateCard({ yesMessage: e.target.value })} placeholder="You just made my day!" rows={3} maxLength={300} className="bg-transparent" /></Field>
                </div>
              </Section>

              <Section title="Button trick" isOpen={openSections.has('trick')} onToggle={() => toggleSection('trick')}>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(TRICKS) as [NoButtonTrick, typeof TRICKS[NoButtonTrick]][]).map(([key, trick]) => (
                    <button
                      key={key}
                      onClick={() => updateCard({ noButtonTrick: key })}
                      className={`p-4 rounded-lg text-left transition-all border ${card.noButtonTrick === key ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/20'}`}
                    >
                      <div className="font-medium text-sm mb-1">{trick.name}</div>
                      <div className="text-xs text-muted-foreground">{trick.description}</div>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Stickers" isOpen={openSections.has('stickers')} onToggle={() => toggleSection('stickers')}>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(STICKERS) as [StickerType, typeof STICKERS[StickerType]][]).map(([key, sticker]) => {
                    const isAdded = card.stickers.some((s) => s.type === key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          if (isAdded) updateCard({ stickers: card.stickers.filter((s) => s.type !== key) });
                          else updateCard({ stickers: [...card.stickers, { type: key, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80, scale: 0.8 + Math.random() * 0.4, rotation: (Math.random() - 0.5) * 30 }] });
                        }}
                        className={`relative p-3 rounded-lg border text-center transition-all ${isAdded ? 'border-foreground bg-foreground/[0.03]' : 'border-border hover:border-foreground/20'}`}
                      >
                        {sticker.premium && <span className="absolute -top-1 -right-1 font-mono-label text-[8px] bg-warm-gold text-white px-1 py-0.5 rounded">PRO</span>}
                        {sticker.image ? <img src={sticker.image} alt={sticker.name} className="w-10 h-10 mx-auto object-contain" /> : <span className="text-2xl block">{sticker.emoji}</span>}
                        <div className="text-[10px] text-muted-foreground mt-1">{sticker.name}</div>
                      </button>
                    );
                  })}
                </div>
              </Section>

              <Section title="Theme" isOpen={openSections.has('theme')} onToggle={() => toggleSection('theme')}>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(THEMES) as [CardTheme, typeof THEMES[CardTheme]][]).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => updateCard({ theme: key })}
                      className={`p-3 rounded-lg text-left transition-all border ${card.theme === key ? 'border-foreground' : 'border-border hover:border-foreground/20'}`}
                    >
                      <div className={`w-full h-12 rounded-md mb-2 ${theme.bg} relative`}>
                        {theme.premium && <span className="absolute top-1 right-1 font-mono-label text-[8px] bg-warm-gold text-white px-1 py-0.5 rounded">PRO</span>}
                      </div>
                      <div className="font-medium text-xs">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            <div className="mt-12 text-center">
              <Button onClick={() => setShowPreview(true)} disabled={!canPreview} className="rounded-full px-10 py-6 bg-foreground text-background hover:bg-foreground/90">
                <Eye className="w-4 h-4 mr-2" /> Preview card
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-lg mx-auto px-6 py-12">
            <p className="font-mono-label text-muted-foreground text-center mb-8">Preview — try clicking the buttons</p>
            <CardPreview card={card} interactive />
            <div className="flex items-center gap-4 mt-10 justify-center">
              <Button variant="outline" className="rounded-full px-8" onClick={() => setShowPreview(false)}>Edit</Button>
              <Button className="rounded-full px-8 bg-foreground text-background" onClick={() => setShowPlanDialog(true)}>Save & share</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlanDialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} onSelect={handlePlanSelect} />
    </div>
  );
};

const Section = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
      <span className="font-medium text-sm">{title}</span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
          <div className="px-5 pb-5">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="font-mono-label text-muted-foreground block mb-2">{label}</label>
    {children}
  </div>
);

export default CreateCard;
