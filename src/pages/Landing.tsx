import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const products = [
  {
    title: "Ask Out Cards",
    label: "CARDS",
    number: "01",
    description: "A playful card with a trick \"No\" button. They literally can't say no.",
    price: "$2.99",
    route: "/askout/create",
    preview: (
      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur rounded-lg p-5 shadow-sm text-center max-w-[180px]">
          <p className="font-display text-sm italic text-rose-900 mb-3">Will you go out with me?</p>
          <div className="flex gap-2 justify-center">
            <span className="px-3 py-1 bg-rose-500 text-white rounded text-xs">Yes!</span>
            <span className="px-3 py-1 bg-rose-200 text-rose-700 rounded text-xs">No</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Digital Bouquets",
    label: "BOUQUETS",
    number: "02",
    description: "Handpick watercolor blooms and wrap them into a bouquet that unfolds on screen.",
    price: "$2.99",
    route: "/bouquet/create",
    preview: (
      <div className="w-full h-full bg-[hsl(40,33%,97%)] rounded-lg flex items-center justify-center p-4">
        <div className="flex flex-wrap items-end justify-center gap-0 max-w-[160px]">
          {['/flowers/red-rose.png', '/flowers/daisy.png', '/flowers/tulip.png', '/flowers/lavender.png', '/flowers/pink-rose.png'].map((src, i) => (
            <img key={src} src={src} alt="" className="w-12 h-12 object-contain -mx-1" style={{ transform: `rotate(${(i - 2) * 14}deg)` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Voice Notes",
    label: "VOICE",
    number: "03",
    description: "Record a heartfelt message. Delivered on a warm journal with a waveform.",
    price: "$2.99",
    route: "/voice/create",
    preview: (
      <div className="w-full h-full bg-[hsl(30,20%,18%)] rounded-lg flex flex-col items-center justify-center p-4">
        <div className="bg-[hsl(38,25%,92%)] rounded-lg p-4 w-full max-w-[180px]">
          <div className="flex items-center gap-[2px] h-8 justify-center">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="w-[2px] rounded-full bg-[hsl(352,36%,50%)]" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
          </div>
          <p className="font-mono text-[9px] text-center mt-2 text-[hsl(20,18%,40%)]">00:00 / 00:42</p>
        </div>
      </div>
    ),
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
    <div className="min-h-screen bg-background relative texture-grain">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            ShareMoments
          </span>
          <div className="flex items-center gap-4">
            {loggedIn && (
              <button
                onClick={() => navigate("/profile")}
                className="font-mono-label text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
            )}
            <Button
              onClick={() => navigate(loggedIn ? "/profile" : "/auth")}
              variant="outline"
              size="sm"
              className="rounded-full border-foreground/15 text-xs font-medium hover:bg-foreground hover:text-background transition-all"
            >
              {loggedIn ? <><User className="w-3.5 h-3.5 mr-1.5" /> Account</> : "Sign In"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl"
        >
          <p className="font-mono-label text-muted-foreground mb-6">
            Digital moments, beautifully crafted
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8">
            Turn feelings into
            <br />
            <span className="font-display italic font-normal text-warm-wine">
              unforgettable
            </span>{" "}
            moments
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Three ways to say what matters. Crafted with intention, 
            delivered with delight.
          </p>
          <Button
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full px-8 py-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all group"
          >
            Explore Products
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Products with Previews */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono-label text-muted-foreground mb-16"
        >
          Three products — $2.99 each
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => navigate(product.route)}
                className="w-full text-left group"
              >
                {/* Preview card */}
                <div className="aspect-[4/3] rounded-lg border border-border overflow-hidden mb-5 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                  {product.preview}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono-label text-muted-foreground/50 mb-1">{product.number}</p>
                    <h2 className="font-display text-xl font-bold tracking-tight group-hover:text-warm-wine transition-colors duration-300">
                      {product.title}
                    </h2>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 mt-6 group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 text-foreground group-hover:text-background transition-colors duration-300" />
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="h-px bg-border mb-24" />
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { num: "01", title: "Choose & customize", body: "Pick a product and personalize every detail to make it yours." },
            { num: "02", title: "Quick checkout", body: "Secure payment at $2.99. No subscriptions, ever." },
            { num: "03", title: "Share the link", body: "Send it to someone special and watch the magic unfold." },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <span className="font-mono-label text-warm-gold block mb-4">{step.num}</span>
              <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display text-sm text-muted-foreground">ShareMoments</span>
          <span className="font-mono-label text-muted-foreground/60">© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
