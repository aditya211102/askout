import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const products = [
  {
    title: "Ask Out Cards",
    label: "CARDS",
    number: "01",
    description: "A playful card with a trick \"No\" button. They literally can't say no.",
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
    route: "/bouquet/create",
    preview: (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(247,241,234,0.98)_58%,rgba(241,232,221,1))] p-4">
        <div className="pointer-events-none absolute inset-x-12 top-5 h-px bg-gradient-to-r from-transparent via-[#dccdb9] to-transparent opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full bg-[#f8e6d7] opacity-60 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-[30px] h-[150px] w-[220px] -translate-x-1/2 rounded-[999px] border border-white/55" />

        <div className="relative flex h-full items-center justify-center">
          <div className="relative h-[210px] w-[230px]">
            <img
              src="/flowers/lavender.png"
              alt=""
              className="absolute left-[26px] top-[70px] h-[38px] w-[38px] object-contain opacity-85"
              style={{ transform: "rotate(-14deg)" }}
            />
            <img
              src="/flowers/pink-rose.png"
              alt=""
              className="absolute left-1/2 top-[18px] h-[72px] w-[72px] -translate-x-1/2 object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.16)]"
            />
            <img
              src="/flowers/daisy.png"
              alt=""
              className="absolute left-[66px] top-[48px] h-[66px] w-[66px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]"
            />
            <img
              src="/flowers/tulip.png"
              alt=""
              className="absolute right-[38px] top-[46px] h-[62px] w-[62px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]"
              style={{ transform: "rotate(10deg)" }}
            />
            <img
              src="/flowers/white-rose.png"
              alt=""
              className="absolute left-[28px] top-[76px] h-[62px] w-[62px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]"
              style={{ transform: "rotate(-10deg)" }}
            />
            <img
              src="/flowers/pink-rose.png"
              alt=""
              className="absolute left-[82px] top-[88px] h-[62px] w-[62px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]"
            />
            <img
              src="/flowers/white-rose.png"
              alt=""
              className="absolute right-[28px] top-[78px] h-[62px] w-[62px] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.14)]"
              style={{ transform: "rotate(10deg)" }}
            />
            <div className="absolute left-[52px] top-[90px] h-[64px] w-[126px] rounded-[999px] bg-[radial-gradient(circle,rgba(160,180,150,0.28),rgba(160,180,150,0)_72%)] blur-md" />

            <div className="absolute bottom-[14px] left-[28px] h-[108px] w-[176px] overflow-hidden">
              <svg viewBox="0 0 176 108" className="h-full w-full drop-shadow-[0_18px_28px_rgba(57,42,27,0.2)]">
                <defs>
                  <linearGradient id="landingWrap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f9e1a6" />
                    <stop offset="100%" stopColor="#e8bf54" />
                  </linearGradient>
                  <linearGradient id="landingWrapEdge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(124,88,38,0.12)" />
                  </linearGradient>
                </defs>
                <path d="M28 10 L148 10 Q160 40 138 102 L38 102 Q16 40 28 10 Z" fill="url(#landingWrap)" />
                <path d="M20 16 L62 24 L48 104 L18 104 Q16 54 20 16 Z" fill="url(#landingWrapEdge)" opacity="0.65" />
                <path d="M156 16 L114 24 L128 104 L158 104 Q160 54 156 16 Z" fill="url(#landingWrapEdge)" opacity="0.65" />
                <path d="M28 10 L148 10 Q128 28 88 34 Q48 28 28 10 Z" fill="rgba(255,255,255,0.24)" />
                <path d="M40 20 Q88 30 136 20" stroke="rgba(255,255,255,0.32)" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <svg
              viewBox="0 0 96 44"
              className="absolute bottom-[70px] left-1/2 h-[40px] w-[96px] -translate-x-1/2 drop-shadow-[0_8px_12px_rgba(91,55,43,0.22)]"
            >
              <path d="M48 20 Q38 36 28 42" stroke="#7d3140" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M48 20 Q58 36 68 42" stroke="#7d3140" strokeWidth="4" fill="none" strokeLinecap="round" />
              <ellipse cx="28" cy="16" rx="18" ry="10" fill="#8b4049" transform="rotate(-12 28 16)" />
              <ellipse cx="68" cy="16" rx="18" ry="10" fill="#8b4049" transform="rotate(12 68 16)" />
              <ellipse cx="48" cy="18" rx="8" ry="7" fill="#8b4049" />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Voice Notes",
    label: "VOICE",
    number: "03",
    description: "Record a heartfelt message. Delivered on a warm journal with a waveform.",
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

const faqs = [
  { q: "How does it work?", a: "Pick a product, customize it, and check out in seconds. You'll get a unique link to share with whoever you have in mind." },
  { q: "Is it a one-time payment?", a: "Yes — no subscriptions, no hidden fees. You pay once per creation." },
  { q: "Do they need an account to view it?", a: "No. The recipient just opens the link — no sign-up required on their end." },
  { q: "Can I send it to anyone?", a: "Absolutely. Share the link however you like — text, DM, email, or even a QR code." },
  { q: "What happens after they open it?", a: "You'll be able to see that it was opened from your dashboard. Their response (if any) is part of the experience you designed." },
  { q: "Is my payment secure?", a: "Yes. Payments are processed via Stripe, so your card details never touch our servers." },
];

const FaqList = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
      {faqs.map((faq, i) => (
        <motion.div key={i} initial={false}>
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-card/60 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-medium text-sm">{faq.q}</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

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
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-left">
            <span className="font-display text-lg font-semibold text-foreground">ShareMoments</span>
            <span className="block font-mono-label text-muted-foreground/70 mt-1">Digital moments, beautifully crafted</span>
          </button>

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

      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 mb-6">
            <span className="font-mono-label text-warm-wine">Personal</span>
            <span className="text-sm text-muted-foreground">Made for one meaningful reveal</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5.5rem] font-bold leading-[0.95] tracking-tight mb-8">
            Turn feelings into
            <br />
            <span className="font-display italic font-normal text-warm-wine">
              unforgettable
            </span>{" "}
            moments
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Three thoughtful formats for sharing something personal, playful, or heartfelt without making it feel generic.
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

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      <section id="products" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-8">
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

      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="h-px bg-border mb-24" />
        <div className="grid md:grid-cols-3 gap-16">
          {[
            { num: "01", title: "Choose & customize", body: "Pick a product and personalize every detail to make it yours." },
            { num: "02", title: "Quick checkout", body: "A simple one-time checkout with no subscriptions or clutter." },
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

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="h-px bg-border mb-24" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-muted-foreground/50 mb-2">TESTIMONIALS</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">What people are saying</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { quote: "Sent my crush an Ask Out Card and she said yes before I could even blink. Best $2 I've ever spent.", name: "Jordan M.", label: "Ask Out Cards" },
            { quote: "The bouquet opened petal by petal and she literally started crying. Way more impact than sending flowers.", name: "Liam R.", label: "Digital Bouquets" },
            { quote: "I recorded a 30-second voice note for my girlfriend's birthday and she's listened to it like 20 times. It's her favorite gift.", name: "Priya K.", label: "Voice Notes" },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4"
            >
              <p className="text-foreground/80 text-sm leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-auto">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="font-mono-label text-warm-wine text-xs mt-0.5">{t.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="h-px bg-border mb-24" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono-label text-muted-foreground/50 mb-2">FAQ</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">Questions answered</h2>
        </motion.div>
        <FaqList />
      </section>

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
