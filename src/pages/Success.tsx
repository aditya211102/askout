import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const productViewPaths: Record<string, string> = { askout: '/card', bouquet: '/bouquet', voice: '/voice' };

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get('card_id');
  const [status, setStatus] = useState<'polling' | 'done'>('polling');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState('');

  useEffect(() => {
    if (!cardId) { navigate('/'); return; }
    const interval = setInterval(async () => {
      const { data } = await supabase.from('cards').select('id, paid, plan, product_type').eq('id', cardId).eq('paid', true).maybeSingle();
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative texture-grain">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {status === 'polling' && (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6" />
            <p className="font-display text-lg font-semibold">Confirming payment</p>
            <p className="text-muted-foreground text-sm mt-1">This usually takes a few seconds.</p>
          </div>
        )}

        {status === 'done' && (
          <div className="surface-elevated border border-border rounded-lg p-8 text-center">
            <p className="font-mono-label text-warm-wine mb-3">Confirmed</p>
            <h1 className="font-display text-3xl font-bold mb-2">It's ready</h1>
            <p className="text-muted-foreground text-sm mb-1">
              Plan: <span className="text-foreground font-medium capitalize">{plan}</span>
            </p>
            <p className="text-muted-foreground text-sm mb-6">Share this link with someone special.</p>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 mb-6">
              <input readOnly value={shareLink} className="flex-1 bg-transparent text-xs font-mono outline-none truncate text-foreground" />
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="rounded-full shrink-0 border-border">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full border-border text-sm" onClick={() => window.open(shareLink, '_blank')}>
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Preview
              </Button>
              <Button className="flex-1 rounded-full bg-foreground text-background text-sm" onClick={() => navigate('/')}>
                Create another
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Success;
