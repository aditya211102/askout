import { track } from "@vercel/analytics";

export const trackIdeasPageView = () => {
  try {
    track("ideas_page_view");
  } catch (e) {
    // Analytics fallback safeguard
  }
};

export const trackArticleView = (slug: string, title: string) => {
  try {
    track("article_view", { slug, title });
  } catch (e) {
    // Analytics fallback safeguard
  }
};

export const trackCategoryView = (category: string) => {
  try {
    track("category_view", { category });
  } catch (e) {
    // Analytics fallback safeguard
  }
};

export const trackArticleSearch = (query: string) => {
  try {
    if (query.trim().length > 1) {
      track("article_search", { query: query.trim() });
    }
  } catch (e) {
    // Analytics fallback safeguard
  }
};

export const trackArticleCtaClick = (articleSlug: string, ctaLabel: string) => {
  try {
    track("article_cta_click", { articleSlug, ctaLabel });
  } catch (e) {
    // Analytics fallback safeguard
  }
};

export const trackCreateMomentClick = (source: string) => {
  try {
    track("create_moment_click", { source });
  } catch (e) {
    // Analytics fallback safeguard
  }
};
