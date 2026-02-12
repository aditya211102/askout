import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  type CrushCard,
  type CardTheme,
  type NoButtonTrick,
  type StickerType,
  THEMES,
  TRICKS,
  STICKERS,
} from '@/lib/card-types';
import CardPreview from '@/components/CardPreview';

const STEPS = ['Theme', 'Message', 'Trick', 'Stickers', 'Preview', 'Details'];

const CreateCard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [card, setCard] = useState<CrushCard>({
    theme: 'classic',
    question: 'Will you be my Valentine?',
    yesMessage: 'You just made my day! 💕',
    noButtonTrick: 'runaway',
    stickers: [],
  });

  const updateCard = (updates: Partial<CrushCard>) => setCard((prev) => ({ ...prev, ...updates }));

  const canProceed = () => {
    if (step === 1) return card.question.trim().length > 0 && card.yesMessage.trim().length > 0;
    if (step === 5) return (card.recipientName?.trim().length ?? 0) > 0 && (card.senderName?.trim().length ?? 0) > 0;
    return true;
  };

  const handleCheckout = () => {
    sessionStorage.setItem('pendingCard', JSON.stringify(card));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-4 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="font-display text-xl font-bold text-gradient-crush">CrushCards</span>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Steps indicator */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-4 sm:w-10 h-0.5 mx-2 ${i < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Choose a Theme 🎨</h2>
              <p className="text-muted-foreground mb-6">Pick the vibe for your card</p>
              <div className="grid grid-cols-2 gap-4">
                {(Object.entries(THEMES) as [CardTheme, typeof THEMES[CardTheme]][]).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateCard({ theme: key })}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      card.theme === key ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-full h-20 rounded-lg mb-3 ${theme.bg}`} />
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{theme.emoji}</span>
                      <div>
                        <div className="font-bold text-sm">{theme.name}</div>
                        <div className="text-xs text-muted-foreground">{theme.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="message" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Write Your Message ✍️</h2>
              <p className="text-muted-foreground mb-6">What do you want to ask?</p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold mb-2 block">The Big Question</label>
                  <Input
                    value={card.question}
                    onChange={(e) => updateCard({ question: e.target.value })}
                    placeholder="Will you be my Valentine?"
                    className="text-lg"
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{card.question.length}/100</p>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Message after they say Yes 💖</label>
                  <Textarea
                    value={card.yesMessage}
                    onChange={(e) => updateCard({ yesMessage: e.target.value })}
                    placeholder="You just made my day! 💕"
                    rows={4}
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{card.yesMessage.length}/300</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="trick" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Pick a Trick 😈</h2>
              <p className="text-muted-foreground mb-6">How should the "No" button misbehave?</p>
              <div className="grid grid-cols-1 gap-4">
                {(Object.entries(TRICKS) as [NoButtonTrick, typeof TRICKS[NoButtonTrick]][]).map(([key, trick]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateCard({ noButtonTrick: key })}
                    className={`p-5 rounded-xl text-left transition-all border-2 flex items-center gap-4 ${
                      card.noButtonTrick === key ? 'border-primary shadow-lg ring-2 ring-primary/20 bg-secondary' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-3xl">{trick.emoji}</span>
                    <div>
                      <div className="font-bold text-lg">{trick.name}</div>
                      <div className="text-sm text-muted-foreground">{trick.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="stickers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Add Stickers ✨</h2>
              <p className="text-muted-foreground mb-6">Tap to add stickers to your card</p>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {(Object.entries(STICKERS) as [StickerType, typeof STICKERS[StickerType]][]).map(([key, sticker]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
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
                    }}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors text-center"
                  >
                    <span className="text-3xl">{sticker.emoji}</span>
                    <div className="text-xs text-muted-foreground mt-1">{sticker.name}</div>
                  </motion.button>
                ))}
              </div>
              {card.stickers.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{card.stickers.length} sticker(s) added</span>
                  <Button variant="ghost" size="sm" onClick={() => updateCard({ stickers: [] })}>
                    Clear all
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Preview Your Card 👀</h2>
              <p className="text-muted-foreground mb-6">This is how your crush will see it — try clicking the buttons!</p>
              <CardPreview card={card} interactive />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-3xl font-bold mb-2">Who's it for? 💌</h2>
              <p className="text-muted-foreground mb-6">Add names to make it personal</p>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold mb-2 block">Recipient's Name 💘</label>
                  <Input
                    value={card.recipientName || ''}
                    onChange={(e) => updateCard({ recipientName: e.target.value })}
                    placeholder="Your crush's name..."
                    maxLength={50}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Your Name (sender) 💝</label>
                  <Input
                    value={card.senderName || ''}
                    onChange={(e) => updateCard({ senderName: e.target.value })}
                    placeholder="Your name..."
                    maxLength={50}
                    className="text-lg"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="rounded-full"
            >
              {step === 4 ? 'Looks great!' : 'Next'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCheckout} disabled={!canProceed()} className="rounded-full animate-pulse-glow text-lg px-8">
              Send It — $2.99 💳
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
