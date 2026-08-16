import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight, Clock, Calendar, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import IdeasNavbar from "@/components/ideas/IdeasNavbar";
import IdeasFooter from "@/components/ideas/IdeasFooter";
import AskOutCtaCard from "@/components/ideas/AskOutCtaCard";
import { CATEGORIES } from "@/data/ideas/categories";
import { ARTICLES, searchArticles } from "@/data/ideas/articles";
import { trackIdeasPageView, trackArticleSearch } from "@/lib/ideasAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const IdeasHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(ARTICLES);

  useEffect(() => {
    trackIdeasPageView();
  }, []);

  useEffect(() => {
    const results = searchArticles(searchQuery);
    setFilteredArticles(results);
    if (searchQuery.trim()) {
      trackArticleSearch(searchQuery);
    }
  }, [searchQuery]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AskOut Ideas",
    url: `${SITE_URL}/ideas`,
    description: "Thoughtful ideas, romantic surprises, messages and gifts for the people who matter most.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground texture-grain relative">
      <Seo
        title={`Ideas for Making Someone Feel Special | AskOut Ideas`}
        description="Thoughtful ideas, romantic surprises, love letters, messages, and gifts for birthdays, anniversaries, long-distance relationships, and special moments."
        keywords="romantic ideas, birthday surprises, anniversary gift ideas, love letter examples, long distance relationship ideas, digital gifts"
        path="/ideas"
        jsonLd={[websiteSchema]}
      />

      <IdeasNavbar />

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/80 text-warm-wine font-mono-label text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-warm-gold" />
            <span>ASKOUT IDEAS HUB</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            Make someone feel <span className="font-display italic font-normal text-warm-wine">special</span>.
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Thoughtful ideas, romantic surprises, messages and gifts for the people who matter most.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-8">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search ideas, e.g. 'birthday', 'long distance', 'love letter'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-6 rounded-full border-border bg-card shadow-sm text-base focus-visible:ring-warm-wine transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">Explore by Category</h2>
          <span className="font-mono-label text-muted-foreground/60">8 CATEGORIES</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, index) => (
            <motion.button
              key={cat.slug}
              onClick={() => navigate(`/ideas/${cat.slug}`)}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-card hover:bg-warm-cream/50 border border-border/80 hover:border-warm-wine/30 rounded-2xl p-5 text-left transition-all duration-300 group shadow-sm hover:shadow"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </span>
              <h3 className="font-display text-base font-semibold group-hover:text-warm-wine transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{cat.heroTagline}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Main Articles Section */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex items-center justify-between mb-8 border-b border-border/60 pb-4">
          <div>
            <p className="font-mono-label text-warm-wine mb-1">CURATED ARTICLES</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              {searchQuery ? `Search Results (${filteredArticles.length})` : "Popular Ideas"}
            </h2>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">No articles found matching "{searchQuery}". Try another topic!</p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              size="sm"
              className="mt-4 rounded-full"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredArticles.map((article, i) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.08, duration: 0.5 }}
                className="bg-card border border-border/80 rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:border-warm-wine/30 transition-all duration-300"
              >
                {/* Hero preview graphic */}
                <button
                  onClick={() => navigate(`/ideas/${article.slug}`)}
                  className="w-full text-left aspect-[16/9] bg-warm-cream/60 p-6 flex items-center justify-center relative overflow-hidden border-b border-border/50"
                >
                  <img
                    src={article.heroImage}
                    alt=""
                    className="w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-warm-wine font-mono-label text-[10px] px-2.5 py-1 rounded-full border border-border">
                    {article.category.toUpperCase()}
                  </span>
                </button>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 font-mono-label text-[10px] text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-warm-gold" />
                      {article.readingTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {article.publishedAt}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-tight mb-2.5 group-hover:text-warm-wine transition-colors leading-snug">
                    <button onClick={() => navigate(`/ideas/${article.slug}`)} className="text-left">
                      {article.title}
                    </button>
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {article.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">{article.author}</span>
                    <button
                      onClick={() => navigate(`/ideas/${article.slug}`)}
                      className="text-xs font-semibold text-warm-wine flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Made for moments that matter - Product Introduction */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <p className="font-mono-label text-warm-wine mb-2">MADE FOR MOMENTS THAT MATTER</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Turn ideas into unforgettably personal digital gifts
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              AskOut helps you transform genuine feelings into shareable digital surprises. Create interactive ask-out cards, bouquets that unfold petal by petal, or voice gifts wrapped in vintage reveals—delivered instantly as a single link.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-background border border-border/80 rounded-2xl p-6">
              <span className="font-mono-label text-warm-gold block mb-2">01. CARDS</span>
              <h3 className="font-display text-lg font-bold mb-2">Ask Out Cards</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Playful digital cards with trick buttons and custom reveals for date proposals.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="text-xs font-semibold text-warm-wine flex items-center gap-1"
              >
                Create Card <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-background border border-border/80 rounded-2xl p-6">
              <span className="font-mono-label text-warm-gold block mb-2">02. BOUQUETS</span>
              <h3 className="font-display text-lg font-bold mb-2">Digital Bouquets</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Custom flowers, ribbons, and letter reveals for birthdays and anniversaries.
              </p>
              <button
                onClick={() => navigate("/bouquet/create")}
                className="text-xs font-semibold text-warm-wine flex items-center gap-1"
              >
                Build Bouquet <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-background border border-border/80 rounded-2xl p-6">
              <span className="font-mono-label text-warm-gold block mb-2">03. VOICE</span>
              <h3 className="font-display text-lg font-bold mb-2">Voice Notes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Record a warm audio message wrapped in a sound wave reveal.
              </p>
              <button
                onClick={() => navigate("/voice/create")}
                className="text-xs font-semibold text-warm-wine flex items-center gap-1"
              >
                Record Voice Gift <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <AskOutCtaCard
            title="Create a Moment with AskOut"
            description="No waiting, no shipping delays. Create a personalized digital moment in under two minutes."
            buttonText="Create Your Moment →"
            link="/bouquet/create"
          />
        </div>
      </section>

      <IdeasFooter />
    </div>
  );
};

export default IdeasHome;
