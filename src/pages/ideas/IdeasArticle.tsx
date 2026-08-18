import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Clock,
  Calendar,
  User,
  List,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Seo from "@/components/Seo";
import IdeasNavbar from "@/components/ideas/IdeasNavbar";
import IdeasFooter from "@/components/ideas/IdeasFooter";
import AskOutCtaCard from "@/components/ideas/AskOutCtaCard";
import { getArticleBySlug, getRelatedArticles, Article } from "@/data/ideas/articles";
import { getCategoryBySlug } from "@/data/ideas/categories";
import { trackArticleView, trackArticleCtaClick } from "@/lib/ideasAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const IdeasArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const article = getArticleBySlug(slug || "");
  const category = article ? getCategoryBySlug(article.category) : undefined;
  const relatedArticles = article ? getRelatedArticles(article.slug, 3) : [];

  useEffect(() => {
    if (article) {
      trackArticleView(article.slug, article.title);
      window.scrollTo(0, 0);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground texture-grain flex flex-col justify-between">
        <IdeasNavbar />
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the article you were looking for.
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

  const canonicalUrl = `${SITE_URL}/ideas/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [article.heroImage.startsWith("/") ? `${SITE_URL}${article.heroImage}` : article.heroImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: article.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

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
        name: category ? category.name : article.category,
        item: `${SITE_URL}/ideas/${article.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  const jsonLdSchemas = [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean) as Record<string, unknown>[];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground texture-grain relative">
      <Seo
        title={`${article.title} | AskOut Ideas`}
        description={article.description}
        keywords={article.tags.join(", ")}
        path={`/ideas/${article.slug}`}
        type="article"
        jsonLd={jsonLdSchemas}
      />

      <IdeasNavbar />

      {/* Article Header & Breadcrumbs */}
      <header className="px-6 pt-10 pb-8 max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-mono-label text-muted-foreground mb-6 flex-wrap">
          <button onClick={() => navigate("/")} className="hover:text-foreground">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <button onClick={() => navigate("/ideas")} className="hover:text-foreground">
            Ideas
          </button>
          <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <button
            onClick={() => navigate(`/ideas/${article.category}`)}
            className="hover:text-foreground capitalize"
          >
            {category ? category.name : article.category}
          </button>
        </nav>

        <div className="mb-4">
          <button
            onClick={() => navigate(`/ideas/${article.category}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-wine/10 text-warm-wine font-mono-label text-xs font-semibold hover:bg-warm-wine/20 transition-colors"
          >
            <span>{category?.icon || "✨"}</span>
            <span>{(category?.name || article.category).toUpperCase()}</span>
          </button>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.15]">
          {article.title}
        </h1>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border/60 text-xs font-mono-label text-muted-foreground">
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <User className="w-3.5 h-3.5 text-warm-wine" />
            {article.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Published {article.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-warm-gold">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTime}
          </span>
        </div>
      </header>

      {/* Hero Visual Container */}
      <div className="max-w-4xl mx-auto px-6 mb-10">
        <div className="w-full aspect-[21/9] bg-gradient-to-br from-warm-cream via-background to-warm-cream/80 border border-border/80 rounded-3xl flex items-center justify-center p-8 shadow-sm relative overflow-hidden">
          <img
            src={article.heroImage}
            alt=""
            className="h-28 sm:h-36 object-contain drop-shadow-xl animate-float-gentle"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Table of Contents (Desktop sidebar / top) */}
        {article.sections.length > 1 && (
          <aside className="lg:col-span-4 lg:order-2">
            <div className="sticky top-24 bg-card border border-border/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 font-mono-label text-warm-wine mb-3">
                <List className="w-4 h-4" />
                <span>IN THIS ARTICLE</span>
              </div>
              <nav className="space-y-2 text-xs">
                {article.sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="block text-left text-muted-foreground hover:text-warm-wine transition-colors line-clamp-1 py-1 border-l-2 border-transparent hover:border-warm-wine pl-2"
                  >
                    {idx + 1}. {sec.heading.replace(/^\d+\.\s*/, "")}
                  </button>
                ))}
                {article.faq && article.faq.length > 0 && (
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="block text-left text-muted-foreground hover:text-warm-wine transition-colors py-1 border-l-2 border-transparent hover:border-warm-wine pl-2"
                  >
                    Frequently Asked Questions
                  </button>
                )}
              </nav>
            </div>
          </aside>
        )}

        {/* Article Body */}
        <div className={article.sections.length > 1 ? "lg:col-span-8 lg:order-1" : "lg:col-span-12"}>
          {/* Introduction */}
          <div className="text-lg sm:text-xl text-foreground/90 font-normal leading-relaxed mb-10 pb-8 border-b border-border/60 italic font-display">
            "{article.intro}"
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
                  {section.heading}
                </h2>

                <p className="text-foreground/80 leading-relaxed mb-4 text-base">
                  {section.content}
                </p>

                {section.items && section.items.length > 0 && (
                  <ul className="space-y-3 mb-6 my-4 pl-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm-wine shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* In-article contextual callout */}
                {section.callout && (
                  <div className="my-6 bg-warm-cream/60 border-l-4 border-warm-wine p-5 rounded-r-xl">
                    <p className="text-xs sm:text-sm text-foreground/90 font-medium mb-3">
                      {section.callout.text}
                    </p>
                    <button
                      onClick={() => {
                        trackArticleCtaClick(article.slug, section.callout?.ctaLabel || "Callout CTA");
                        navigate(section.callout?.ctaLink || "/bouquet/create");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-warm-wine hover:underline"
                    >
                      {section.callout.ctaLabel}
                    </button>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          {article.faq && article.faq.length > 0 && (
            <section id="faq" className="mt-16 pt-10 border-t border-border/80 scroll-mt-28">
              <p className="font-mono-label text-warm-wine mb-2">COMMON QUESTIONS</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                Frequently Asked Questions
              </h2>

              <div className="divide-y divide-border border border-border/80 rounded-2xl overflow-hidden bg-card">
                {article.faq.map((item, idx) => (
                  <div key={idx} className="transition-colors">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-medium text-sm hover:bg-warm-cream/40"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-background/50"
                        >
                          <p className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Primary Article CTA */}
          <AskOutCtaCard
            title={article.askOutCta?.title || "Turn This Idea into a Real Moment"}
            description={
              article.askOutCta?.description ||
              "AskOut lets you create personalized digital cards, flower bouquets, and voice note gifts delivered as a single link."
            }
            buttonText={article.askOutCta?.buttonText || "Create Your Surprise Moment →"}
            link={article.askOutCta?.link || "/bouquet/create"}
            articleSlug={article.slug}
          />
        </div>
      </main>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20 border-t border-border/60 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono-label text-warm-wine mb-1">KEEP READING</p>
              <h2 className="font-display text-2xl font-bold tracking-tight">Related Ideas & Guides</h2>
            </div>
            <button
              onClick={() => navigate("/ideas")}
              className="text-xs font-semibold text-warm-wine hover:underline"
            >
              View All Ideas →
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <article
                key={rel.slug}
                className="bg-card border border-border/80 rounded-2xl p-6 flex flex-col group hover:shadow-md hover:border-warm-wine/30 transition-all"
              >
                <div className="flex items-center justify-between font-mono-label text-[10px] text-muted-foreground mb-3">
                  <span className="text-warm-wine font-semibold uppercase">{rel.category}</span>
                  <span>{rel.readingTime}</span>
                </div>

                <h3 className="font-display text-lg font-bold tracking-tight mb-2 group-hover:text-warm-wine transition-colors line-clamp-2">
                  <button onClick={() => navigate(`/ideas/${rel.slug}`)} className="text-left">
                    {rel.title}
                  </button>
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                  {rel.description}
                </p>

                <div className="mt-auto pt-4 border-t border-border/50">
                  <button
                    onClick={() => navigate(`/ideas/${rel.slug}`)}
                    className="text-xs font-semibold text-warm-wine flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Read Article <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <IdeasFooter />
    </div>
  );
};

export default IdeasArticle;
