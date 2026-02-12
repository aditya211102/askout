import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { CrushCard } from '@/lib/card-types';

const Checkout = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'review' | 'processing' | 'done'>('review');
  const [card, setCard] = useState<CrushCard | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pendingCard');
    if (!raw) { navigate('/create'); return; }
    setCard(JSON.parse(raw));
  }, [navigate]);

  const handlePay = async () => {
    if (!card) return;
    setStage('processing');

    // Mock payment delay
    await new Promise((r) => setTimeout(r, 1800));

    const { data, error } = await supabase.from('cards').insert({
      theme: card.theme,
      question: card.question,
      yes_message: card.yesMessage,
      no_button_trick: card.noButtonTrick,
      stickers: card.stickers as any,
      recipient_name: card.recipientName || null,
      paid: true,
    }).select('id').single();

    if (error || !data) {
      console.error('Failed to save card', error);
      setStage('review');
      return;
    }

    const link = `${window.location.origin}/card/${data.id}`;
    setShareLink(link);
    sessionStorage.removeItem('pendingCard');
    setStage('done');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!card) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {stage === 'review' && (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
            <Heart className="w-12 h-12 text-primary fill-primary mx-auto" />
            <h1 className="font-display text-3xl font-bold">Almost there! 💘</h1>
            <p className="text-muted-foreground">Your card is ready. Complete payment to get your shareable link.</p>
            <div className="bg-muted rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Theme</span><span className="font-medium capitalize">{card.theme}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Trick</span><span className="font-medium capitalize">{card.noButtonTrick}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stickers</span><span className="font-medium">{card.stickers.length}</span></div>
              {card.recipientName && <div className="flex justify-between"><span className="text-muted-foreground">To</span><span className="font-medium">{card.recipientName}</span></div>}
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span><span>$2.99</span>
              </div>
              <Button onClick={handlePay} className="w-full rounded-full text-lg py-6 animate-pulse-glow">
                Pay $2.99 💳
              </Button>
              <p className="text-xs text-muted-foreground mt-3">🔒 Mock payment — no real charge</p>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl mx-auto w-fit">💘</motion.div>
            <h2 className="font-display text-2xl font-bold">Processing...</h2>
            <p className="text-muted-foreground">Creating your card ✨</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl">🎉</motion.div>
            <h1 className="font-display text-3xl font-bold">Card Created!</h1>
            <p className="text-muted-foreground">Share this link with your crush 💕</p>
            <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
              <input readOnly value={shareLink} className="flex-1 bg-transparent text-sm font-mono outline-none truncate" />
              <Button size="sm" variant="outline" onClick={copyLink} className="rounded-full shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => window.open(shareLink, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-1" /> Preview
              </Button>
              <Button className="flex-1 rounded-full" onClick={() => navigate('/create')}>
                Create Another 💘
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Checkout;
