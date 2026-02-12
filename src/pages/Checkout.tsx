import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { CrushCard } from '@/lib/card-types';

const Checkout = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'saving' | 'done'>('saving');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);

  const saveCard = async () => {
    const raw = sessionStorage.getItem('pendingCard');
    if (!raw) { navigate('/create'); return; }
    const card: CrushCard = JSON.parse(raw);
    setStarted(true);

    const { data, error } = await supabase.from('cards').insert({
      theme: card.theme,
      question: card.question,
      yes_message: card.yesMessage,
      no_button_trick: card.noButtonTrick,
      stickers: card.stickers as any,
      recipient_name: card.recipientName || null,
      sender_name: card.senderName || null,
      paid: true,
    }).select('id').single();

    if (error || !data) {
      console.error('Failed to save card', error);
      setStarted(false);
      return;
    }

    setShareLink(`${window.location.origin}/card/${data.id}`);
    sessionStorage.removeItem('pendingCard');
    setStage('done');
  };

  if (!started) {
    // Auto-save on mount
    saveCard();
  }

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
            <h2 className="font-display text-2xl font-bold">Creating your card...</h2>
            <p className="text-muted-foreground">Just a moment ✨</p>
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
