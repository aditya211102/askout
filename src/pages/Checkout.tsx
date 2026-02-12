import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border text-center space-y-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl mx-auto w-fit">💘</motion.div>
          <h2 className="font-display text-2xl font-bold">Saving your card...</h2>
          <p className="text-muted-foreground">Redirecting to payment ✨</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
