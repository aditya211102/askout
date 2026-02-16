import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
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
    supabase.auth.onAuthStateChange((_, session) => { if (session) handlePostLogin(); });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) handlePostLogin(); });
  }, []);

  const handlePostLogin = () => {
    if (localStorage.getItem('pendingCard')) navigate('/checkout');
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
    } catch (err: any) { setError(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative texture-grain">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-10">
          <button onClick={() => navigate('/')} className="font-display text-xl font-semibold text-foreground">
            ShareMoments
          </button>
        </div>

        <div className="surface-elevated border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin ? 'Sign in to continue' : 'Join ShareMoments'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-transparent" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-transparent" required minLength={6} />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full rounded-full bg-foreground text-background" disabled={loading}>
              {loading ? '...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : 'Already have one?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-foreground font-medium hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
