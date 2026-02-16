import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, LogOut, Plus, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface CardRow {
  id: string;
  theme: string;
  question: string;
  plan: string;
  paid: boolean;
  created_at: string;
  recipient_name: string | null;
  sender_name: string | null;
  product_type: string;
}

const productMeta: Record<string, { label: string; emoji: string; viewPath: string }> = {
  askout: { label: 'Ask Out', emoji: '💌', viewPath: '/card' },
  bouquet: { label: 'Bouquet', emoji: '💐', viewPath: '/bouquet' },
  voice: { label: 'Voice', emoji: '🎙️', viewPath: '/voice' },
};

const Profile = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setEmail(session.user.email || '');

      const { data } = await supabase
        .from('cards')
        .select('id, theme, question, plan, paid, created_at, recipient_name, sender_name, product_type')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setCards(data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/'); };

  const copyLink = (card: CardRow) => {
    const meta = productMeta[card.product_type] || productMeta.askout;
    const link = `${window.location.origin}${meta.viewPath}/${card.id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const viewLink = (card: CardRow) => {
    const meta = productMeta[card.product_type] || productMeta.askout;
    window.open(`${meta.viewPath}/${card.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-blush))]">
      {/* Header */}
      <header className="py-6 px-6 border-b border-border/50 glass-strong">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--sm-lavender))] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-brand">ShareMoments</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{email}</span>
            <Button variant="outline" size="sm" className="rounded-full glass" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Your Moments ✨</h1>
          <p className="text-muted-foreground">All the moments you've created and shared.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button onClick={() => navigate('/')} className="rounded-full mb-8 shadow-lg bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]">
            <Plus className="w-4 h-4 mr-1" /> Create New Moment
          </Button>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your moments...</div>
        ) : cards.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 glass-strong rounded-3xl shadow-md">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="font-display text-xl font-bold mb-2">No moments yet</h2>
            <p className="text-muted-foreground mb-6">Create your first moment and share it!</p>
            <Button onClick={() => navigate('/')} className="rounded-full bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]">Get Started ✨</Button>
          </motion.div>
        ) : (
          /* Masonry-style grid */
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {cards.map((card, i) => {
              const meta = productMeta[card.product_type] || productMeta.askout;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="break-inside-avoid glass-strong rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{meta.emoji}</span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{meta.label}</span>
                    <div className="ml-auto">
                      {card.plan === 'premium' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[hsl(var(--sm-gold))]/20 text-[hsl(var(--sm-wine))]">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <Sparkles className="w-3 h-3" /> Basic
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold truncate mb-1">{card.question}</h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                    {card.recipient_name && <span>To: {card.recipient_name}</span>}
                    <span>{new Date(card.created_at).toLocaleDateString()}</span>
                    {card.paid ? (
                      <span className="text-emerald-600 font-medium">✓ Paid</span>
                    ) : (
                      <span className="text-amber-500 font-medium">⏳ Pending</span>
                    )}
                  </div>

                  {card.paid && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-full flex-1 text-xs" onClick={() => copyLink(card)}>
                        {copiedId === card.id ? <><Check className="w-3 h-3 mr-1" /> Copied!</> : <><Copy className="w-3 h-3 mr-1" /> Copy Link</>}
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full" onClick={() => viewLink(card)}>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
