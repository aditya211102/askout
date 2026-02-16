import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const products = [
  {
    title: "Ask Out Cards",
    emoji: "💌",
    description: "Create a playful card with a tricky \"No\" button. They literally can't say no!",
    badge: "Most Popular",
    gradient: "from-[hsl(340,60%,85%)] to-[hsl(340,80%,75%)]",
    price: "$2.99",
    route: "/askout/create",
  },
  {
    title: "Digital Bouquet",
    emoji: "💐",
    description: "Handpick stunning flowers, customize the wrapping, and send a bouquet that blooms on screen.",
    badge: null,
    gradient: "from-[hsl(25,100%,90%)] to-[hsl(340,60%,85%)]",
    price: "$2.99",
    route: "/bouquet/create",
  },
  {
    title: "Voice Messages",
    emoji: "🎙️",
    description: "Record a heartfelt voice note on a vintage vinyl with a Polaroid photo reveal.",
    badge: null,
    gradient: "from-[hsl(280,52%,88%)] to-[hsl(280,40%,78%)]",
    price: "$2.99",
    route: "/voice/create",
  },
];

const Landing = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--sm-cream))] to-[hsl(var(--sm-blush))] overflow-hidden">
      {/* Floating petals */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-[0.07]"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: -30,
            }}
            animate={{ y: typeof window !== "undefined" ? window.innerHeight + 30 : 900 }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear",
            }}
          >
            {["🌸", "✨", "🌹", "💫", "🌷"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--sm-lavender))] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-gradient-brand">ShareMoments</span>
          </div>
          <div className="flex items-center gap-3">
            {loggedIn && (
              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                size="sm"
                className="rounded-full glass"
              >
                <User className="w-4 h-4 mr-1" /> My Moments
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            3 ways to express your feelings
          </motion.div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Turn Moments
            <br />
            Into <span className="text-gradient-brand">Magic</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create beautiful digital experiences — from playful ask-out cards to blooming bouquets and vinyl voice messages.
          </p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="rounded-full text-lg px-10 py-7 font-bold shadow-xl animate-glow bg-gradient-to-r from-primary to-[hsl(var(--sm-lavender))]"
            >
              Create Your Moment ✨
            </Button>
          </motion.div>
        </motion.div>

        {/* Product Cards */}
        <section id="products" className="scroll-mt-8">
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => navigate(product.route)}
                className="group cursor-pointer"
              >
                <div className="glass-strong rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                  {/* Gradient top */}
                  <div className={`h-48 bg-gradient-to-br ${product.gradient} relative flex items-center justify-center`}>
                    {product.badge && (
                      <span className="absolute top-4 right-4 text-[11px] font-bold px-3 py-1 rounded-full bg-foreground/90 text-background">
                        {product.badge}
                      </span>
                    )}
                    <motion.span
                      className="text-7xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
                    >
                      {product.emoji}
                    </motion.span>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold mb-2">{product.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-muted-foreground">Starting at {product.price}</span>
                      <span className="text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Create →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <h2 className="font-display text-4xl font-bold text-center mb-4">
            How it works
          </h2>
          <p className="text-center text-muted-foreground mb-16">Three simple steps to create something unforgettable</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", emoji: "🎨", title: "Choose & Customize", desc: "Pick a product, select your style, and personalize every detail" },
              { step: "02", emoji: "💳", title: "Quick Checkout", desc: "Secure payment starting at just $2.99" },
              { step: "03", emoji: "🔗", title: "Share the Magic", desc: "Send the link and watch their reaction unfold" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="text-center p-8 rounded-3xl glass-strong"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <div className="text-xs font-bold text-primary tracking-widest mb-3">STEP {item.step}</div>
                <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>Made with ✨ by ShareMoments</p>
      </footer>
    </div>
  );
};

export default Landing;
