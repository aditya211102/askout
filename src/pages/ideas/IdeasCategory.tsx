import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Calendar, ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";
import IdeasNavbar from "@/components/ideas/IdeasNavbar";
import IdeasFooter from "@/components/ideas/IdeasFooter";
import AskOutCtaCard from "@/components/ideas/AskOutCtaCard";
import { getCategoryBySlug } from "@/data/ideas/categories";
import { getArticlesByCategory } from "@/data/ideas/articles";
import { trackCategoryView } from "@/lib/ideasAnalytics";
import { SITE_URL } from "@/lib/site";

export const IdeasCategory = () => {
  const { category: categoryParam } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const category = getCategoryBySlug(categoryParam || "");
  const articles = getArticlesByCategory(categoryParam || "");

  useEffect(() => {
    if (categoryParam) {
      trackCategoryView(categoryParam);
    }
  }, [categoryParam]);

  if (!category) {
    return (
      <div className="min-h-screen bg-background text-foreground texture-grain flex flex-col justify-between">
        <IdeasNavbar />
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the ideas category you were looking for.
          </p>
          <button
            onClick={() => navigate("/ideas")}
            className="px-6 py-3 rounded-full bg-warm-wine text-white text-sm font-medium hover:bg-warm-wine/90"
          >
            Back to Ideas Hub
          </button>
        </div>
        <IdeasFooter />
      </div>
    );
  }

  const canonicalUrl = `${SITE_URL}/ideas/${category.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Ideas",
        item: `${SITE_URL}/ideas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground texture-grain relative">
      <Seo
        title={`${category.title} | AskOut Ideas`}
        description={category.description}
        keywords={`${category.name.toLowerCase()} ideas, ${category.name.toLowerCase()} surprises, romantic ${category.name.toLowerCase()} gifts`}
        path={`/ideas/${category.slug}`}
        jsonLd={[breadcrumbSchema]}
      />

      <IdeasNavbar />

      {/* Header & Breadcrumb */}
      <section className="px-6 pt-12 pb-12 max-w-5xl mx-auto border-b border-border/60">
        <nav className="flex items-center gap-2 text-xs font-mono-label text-muted-foreground mb-6">
          <button onClick={() => navigate("/")} className="hover:text-foreground">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          <button onClick={() => navigate("/ideas")} className="hover:text-foreground">
            Ideas
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
          <span className="text-warm-wine font-semibold">{category.name}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <span className="font-mono-label text-warm-wine bg-warm-wine/10 px-3 py-1 rounded-full">
              CATEGORY
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {category.title}
          </h1>

          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </motion.div>
      </section>

      {/* Category Articles Listing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {articles.length} {articles.length === 1 ? "Article" : "Articles"} in {category.name}
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">No articles in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {articles.map((article, i) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border/80 rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:border-warm-wine/30 transition-all"
              >
                <button
                  onClick={() => navigate(`/ideas/${article.slug}`)}
                  className="w-full text-left aspect-[16/9] bg-warm-cream/60 p-6 flex items-center justify-center relative border-b border-border/50"
                >
                  <img
                    src={article.heroImage}
                    alt=""
                    className="w-20 h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                  />
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

                  <h3 className="font-display text-xl font-bold tracking-tight mb-2.5 group-hover:text-warm-wine transition-colors">
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
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <AskOutCtaCard
          title={`Make Your ${category.name} Special`}
          description={`Turn these ${category.name.toLowerCase()} ideas into a personalized digital moment. Send interactive bouquets, custom cards, or voice gifts instantly.`}
          buttonText={`Create a ${category.name} Moment →`}
          link="/bouquet/create"
        />
      </section>

      <IdeasFooter />
    </div>
  );
};

export default IdeasCategory;
