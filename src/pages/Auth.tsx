import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) handlePostLogin();
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handlePostLogin();
    });
  }, []);

  const handlePostLogin = () => {
    const pendingCard = localStorage.getItem('pendingCard');
    if (pendingCard) navigate('/checkout');
    else navigate('/profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-blush))] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="glass-strong rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--sm-lavender))] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              {isLogin ? 'Welcome back ✨' : 'Join ShareMoments'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 rounded-xl" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 rounded-xl" required minLength={6} />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]" disabled={loading}>
              {loading ? '...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary font-semibold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
