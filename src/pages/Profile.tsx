import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, LogOut, Plus } from 'lucide-react';
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

const productMeta: Record<string, { label: string; viewPath: string }> = {
  askout: { label: 'CARD', viewPath: '/card' },
  bouquet: { label: 'BOUQUET', viewPath: '/bouquet' },
  voice: { label: 'VOICE', viewPath: '/voice' },
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

  const copyLink = (card: CardRow) => {
    const meta = productMeta[card.product_type] || productMeta.askout;
    navigator.clipboard.writeText(`${window.location.origin}${meta.viewPath}/${card.id}`);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const viewLink = (card: CardRow) => {
    const meta = productMeta[card.product_type] || productMeta.askout;
    window.open(`${meta.viewPath}/${card.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background relative texture-grain">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="font-display text-lg font-semibold text-foreground">
            ShareMoments
          </button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">{email}</span>
            <Button variant="outline" size="sm" className="rounded-full text-xs border-border" onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}>
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="font-mono-label text-muted-foreground mb-3">Dashboard</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Your moments</h1>
        </div>

        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full mb-10 border-border text-sm">
          <Plus className="w-4 h-4 mr-2" /> Create new
        </Button>

        {loading ? (
          <p className="text-muted-foreground text-sm py-20 text-center">Loading...</p>
        ) : cards.length === 0 ? (
          <div className="text-center py-24 border border-border rounded-lg">
            <p className="font-display text-xl font-semibold mb-2">No moments yet</p>
            <p className="text-muted-foreground text-sm mb-6">Create your first one and share it.</p>
            <Button onClick={() => navigate('/')} className="rounded-full bg-foreground text-background">Get started</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map((card, i) => {
              const meta = productMeta[card.product_type] || productMeta.askout;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border border-border rounded-lg p-5 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono-label text-muted-foreground/60">{meta.label}</span>
                        <span className="font-mono-label text-muted-foreground/40">
                          {card.plan === 'premium' ? 'PRO' : 'BASIC'}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm truncate">{card.question}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {card.recipient_name && <span>To {card.recipient_name}</span>}
                        <span>{new Date(card.created_at).toLocaleDateString()}</span>
                        {card.paid ? (
                          <span className="text-emerald-700">Paid</span>
                        ) : (
                          <span className="text-amber-600">Pending</span>
                        )}
                      </div>
                    </div>

                    {card.paid && (
                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" className="rounded-full text-xs border-border" onClick={() => copyLink(card)}>
                          {copiedId === card.id ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full border-border" onClick={() => viewLink(card)}>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
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
