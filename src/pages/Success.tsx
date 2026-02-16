import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const productViewPaths: Record<string, string> = {
  askout: '/card',
  bouquet: '/bouquet',
  voice: '/voice',
};

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get('card_id');
  const productType = searchParams.get('product_type') || 'askout';
  const [status, setStatus] = useState<'polling' | 'done'>('polling');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState('');

  useEffect(() => {
    if (!cardId) { navigate('/'); return; }

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('cards')
        .select('id, paid, plan, product_type')
        .eq('id', cardId)
        .eq('paid', true)
        .maybeSingle();

      if (data) {
        clearInterval(interval);
        setPlan(data.plan);
        const viewPath = productViewPaths[data.product_type] || '/card';
        setShareLink(`${window.location.origin}${viewPath}/${data.id}`);
        setStatus('done');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [cardId, navigate]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-blush))] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {status === 'polling' && (
          <div className="glass-strong rounded-3xl p-8 shadow-xl text-center space-y-6">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mx-auto w-fit">
              <Sparkles className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold">Confirming payment...</h2>
            <p className="text-muted-foreground">Almost there ✨</p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" /> This usually takes a few seconds
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="glass-strong rounded-3xl p-8 shadow-xl text-center space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl">🎉</motion.div>
            <h1 className="font-display text-3xl font-bold">Moment Created!</h1>
            <p className="text-muted-foreground">Plan: <span className="font-semibold capitalize text-foreground">{plan}</span> ✨</p>
            <p className="text-muted-foreground">Share this link with someone special 💕</p>
            <div className="flex items-center gap-2 bg-muted/50 rounded-2xl p-3">
              <input readOnly value={shareLink} className="flex-1 bg-transparent text-sm font-mono outline-none truncate" />
              <Button size="sm" variant="outline" onClick={copyLink} className="rounded-full shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => window.open(shareLink, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-1" /> Preview
              </Button>
              <Button className="flex-1 rounded-full bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]" onClick={() => navigate('/')}>
                Create Another ✨
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Success;
