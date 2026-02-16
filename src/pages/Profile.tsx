import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, ExternalLink, LogOut, Plus, Crown, Sparkles } from 'lucide-react';
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
}

const Profile = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setEmail(session.user.email || '');

      const { data } = await supabase
        .from('cards')
        .select('id, theme, question, plan, paid, created_at, recipient_name, sender_name')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setCards(data || []);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const copyLink = (cardId: string) => {
    const link = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const planBadge = (plan: string) => {
    if (plan === 'premium') return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
        <Crown className="w-3 h-3" /> Premium
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
        <Sparkles className="w-3 h-3" /> Basic
      </span>
    );
  };

  const themeEmojis: Record<string, string> = {
    classic: '💖', neon: '💜', retro: '🌸', pastel: '🩷',
    galaxy: '🌌', garden: '🌹', sunset: '🌅', ocean: '🌊',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">
      {/* Header */}
      <header className="py-6 px-6 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-primary fill-primary" />
            <span className="font-display text-xl font-bold text-gradient-crush">CrushCards</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{email}</span>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Your Cards 💌</h1>
          <p className="text-muted-foreground">All the cards you've created and shared.</p>
        </motion.div>

        {/* Create new CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button onClick={() => navigate('/create')} className="rounded-full mb-8 shadow-lg">
            <Plus className="w-4 h-4 mr-1" /> Create New Card 💘
          </Button>
        </motion.div>

        {/* Cards list */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your cards...</div>
        ) : cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card rounded-3xl border border-border shadow-md"
          >
            <div className="text-5xl mb-4">💔</div>
            <h2 className="font-display text-xl font-bold mb-2">No cards yet</h2>
            <p className="text-muted-foreground mb-6">Create your first card and share it with your crush!</p>
            <Button onClick={() => navigate('/create')} className="rounded-full">
              Get Started 💖
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-5 shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{themeEmojis[card.theme] || '💖'}</span>
                      <h3 className="font-display text-lg font-bold truncate">{card.question}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      {planBadge(card.plan)}
                      {card.recipient_name && (
                        <span>To: {card.recipient_name}</span>
                      )}
                      <span>·</span>
                      <span>{new Date(card.created_at).toLocaleDateString()}</span>
                      {card.paid ? (
                        <span className="text-emerald-600 font-medium">✓ Paid</span>
                      ) : (
                        <span className="text-amber-500 font-medium">⏳ Pending</span>
                      )}
                    </div>
                  </div>

                  {card.paid && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => copyLink(card.id)}
                      >
                        {copiedId === card.id ? (
                          <><Check className="w-4 h-4 mr-1" /> Copied!</>
                        ) : (
                          <><Copy className="w-4 h-4 mr-1" /> Copy Link</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => window.open(`/card/${card.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
