import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { CrushCard } from '@/lib/card-types';

// Placeholder Dodo checkout links — user will replace these later
const DODO_LINKS: Record<string, string> = {
  basic: 'https://checkout.dodopayments.com/buy/pdt_0NYMC9vsP1ltfLoco7LtW?quantity=1',
  premium: 'https://checkout.dodopayments.com/buy/PREMIUM_PRODUCT_ID?quantity=1',
};

const Checkout = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'saving' | 'waiting' | 'done'>('saving');
  const [cardId, setCardId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // On mount: save card to DB then redirect to Dodo
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const raw = localStorage.getItem('pendingCard');
      const plan = localStorage.getItem('pendingPlan') || 'basic';
      if (!raw) { navigate('/create'); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }

      const card: CrushCard = JSON.parse(raw);

      const { data, error } = await supabase.from('cards').insert({
        theme: card.theme,
        question: card.question,
        yes_message: card.yesMessage,
        no_button_trick: card.noButtonTrick,
        stickers: card.stickers as any,
        recipient_name: card.recipientName || null,
        sender_name: card.senderName || null,
        user_id: session.user.id,
        plan,
        paid: false,
      }).select('id').single();

      if (error || !data || cancelled) {
        console.error('Failed to save card', error);
        return;
      }

      setCardId(data.id);
      localStorage.removeItem('pendingCard');
      localStorage.removeItem('pendingPlan');

      // Redirect to Dodo checkout with metadata
      const dodoPlan = plan as keyof typeof DODO_LINKS;
      const checkoutUrl = `${DODO_LINKS[dodoPlan]}&metadata[card_id]=${data.id}`;
      window.location.href = checkoutUrl;
    };

    run();
    return () => { cancelled = true; };
  }, []);

  // Poll for payment confirmation when we have a cardId and return from Dodo
  // The user lands back here via Dodo's return URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const returnedCardId = urlParams.get('card_id') || cardId;

    if (!returnedCardId) return;
    setCardId(returnedCardId);
    setStage('waiting');

    const interval = setInterval(async () => {
      // Use service-side check: card becomes visible once paid=true via RLS
      const { data } = await supabase
        .from('cards')
        .select('id, paid')
        .eq('id', returnedCardId)
        .eq('paid', true)
        .maybeSingle();

      if (data) {
        clearInterval(interval);
        setShareLink(`${window.location.origin}/card/${data.id}`);
        setStage('done');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [cardId]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {stage === 'saving' && (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl mx-auto w-fit">💘</motion.div>
            <h2 className="font-display text-2xl font-bold">Saving your card...</h2>
            <p className="text-muted-foreground">Redirecting to payment ✨</p>
          </div>
        )}

        {stage === 'waiting' && (
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-5xl mx-auto w-fit">
              <Heart className="w-12 h-12 text-primary fill-primary" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold">Confirming payment...</h2>
            <p className="text-muted-foreground">Waiting for payment confirmation 💕</p>
            <p className="text-xs text-muted-foreground">This usually takes a few seconds</p>
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
