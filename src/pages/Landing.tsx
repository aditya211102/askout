import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DemoCard from "@/components/DemoCard";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: (typeof window !== "undefined" ? window.innerHeight : 800) + 50,
            }}
            animate={{
              y: -50,
              x: `+=${Math.sin(i) * 100}`,
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {["💖", "💕", "💗", "❤️", "🌹"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="font-display text-2xl font-bold text-gradient-crush">CrushCards</span>
          </div>
          <div className="flex items-center gap-3">
            {loggedIn && (
              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                size="sm"
                className="rounded-full"
              >
                <User className="w-4 h-4 mr-1" /> My Cards
              </Button>
            )}
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="rounded-full font-bold shadow-lg animate-pulse-glow"
            >
              Create Your Card 💌
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💘
            </motion.div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Make them say <span className="text-gradient-crush">Yes!</span>
              <br />
              <span className="text-3xl md:text-4xl font-bold text-muted-foreground">
                (because they literally can't say no 😈)
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Create a playful Valentine's card with a tricky "No" button that runs away, shrinks, or changes text. Send
              it to your crush and watch the magic happen!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/create")}
                size="lg"
                className="rounded-full text-lg px-10 py-6 font-bold shadow-xl animate-pulse-glow"
              >
                Create Your Card 💖
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">✨ 8 Themes</span>
              <span className="flex items-center gap-1">🎭 4 Tricks</span>
              <span className="flex items-center gap-1">🎉 Animated Stickers</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="animate-float"
          >
            <p className="text-center text-sm font-medium text-muted-foreground mb-4">
              👇 Try hovering over the "No" button
            </p>
            <DemoCard />
          </motion.div>
        </div>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <h2 className="font-display text-4xl font-bold text-center mb-16">
            How it works <span className="text-gradient-crush">💕</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", emoji: "🎨", title: "Pick a Theme", desc: "Choose from 8 gorgeous Valentine's themes" },
              { step: "2", emoji: "✍️", title: "Write Your Message", desc: "Add your personal question and love note" },
              { step: "3", emoji: "😈", title: "Choose a Trick", desc: 'Pick how the "No" button misbehaves' },
              { step: "4", emoji: "🔗", title: "Share the Link", desc: "Send it to your crush and wait for the magic" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card shadow-md border border-border"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>Made with 💖 by CrushCards </p>
      </footer>
    </div>
  );
};

export default Landing;
