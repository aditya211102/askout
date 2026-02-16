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
    price: "From $2.99",
    route: "/askout/create",
    accent: "bg-warm-wine",
  },
  {
    title: "Digital Bouquets",
    label: "BOUQUETS",
    number: "02",
    description: "Handpick flowers, wrap them beautifully, and send a bouquet that blooms on screen.",
    price: "From $2.99",
    route: "/bouquet/create",
    accent: "bg-warm-gold",
  },
  {
    title: "Voice Messages",
    label: "VOICE",
    number: "03",
    description: "Record a heartfelt message. Delivered on a vintage vinyl with your photo.",
    price: "From $2.99",
    route: "/voice/create",
    accent: "bg-warm-brown",
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

      {/* Products */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono-label text-muted-foreground mb-16"
        >
          Three products
        </motion.p>

        <div className="space-y-0">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={() => navigate(product.route)}
                className="w-full text-left group border-b border-border py-10 md:py-14 flex items-start md:items-center justify-between gap-6 hover:pl-4 transition-all duration-500"
              >
                <div className="flex items-start md:items-center gap-6 md:gap-10 flex-1">
                  <span className="font-mono-label text-muted-foreground/50 pt-1 md:pt-0">
                    {product.number}
                  </span>
                  <div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight group-hover:text-warm-wine transition-colors duration-500">
                      {product.title}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm md:text-base leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono-label text-muted-foreground hidden md:block">
                    {product.price}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-500">
                    <ArrowRight className="w-4 h-4 text-foreground group-hover:text-background transition-colors duration-500" />
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
            { num: "02", title: "Quick checkout", body: "Secure payment starting at $2.99. No subscriptions, ever." },
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
