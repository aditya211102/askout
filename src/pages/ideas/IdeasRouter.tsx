import { useParams } from "react-router-dom";
import IdeasCategory from "./IdeasCategory";
import IdeasArticle from "./IdeasArticle";
import NotFound from "@/pages/NotFound";
import { getCategoryBySlug } from "@/data/ideas/categories";
import { getArticleBySlug } from "@/data/ideas/articles";

export const IdeasRouter = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <NotFound />;
  }

  const category = getCategoryBySlug(slug);
  if (category) {
    return <IdeasCategory />;
  }

  const article = getArticleBySlug(slug);
  if (article) {
    return <IdeasArticle />;
  }

  return <NotFound />;
};

export default IdeasRouter;
