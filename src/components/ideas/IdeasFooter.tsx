import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/data/ideas/categories";
import { ARTICLES } from "@/data/ideas/articles";

export const IdeasFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-card border-t border-border/70 py-16 px-6 mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="md:col-span-1">
          <button onClick={() => navigate("/")} className="text-left mb-4 block">
            <span className="font-display text-2xl font-bold text-foreground">Askout Ideas</span>
          </button>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Thoughtful ideas, romantic surprises, messages, and gifts for the people who matter most.
          </p>
          <p className="font-mono-label text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Askout Moments
          </p>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="font-mono-label text-warm-wine mb-4">Categories</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <button
                  onClick={() => navigate(`/ideas/${cat.slug}`)}
                  className="hover:text-foreground transition-colors text-left flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Articles Column */}
        <div>
          <h4 className="font-mono-label text-warm-wine mb-4">Popular Guides</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {ARTICLES.slice(0, 5).map((art) => (
              <li key={art.slug}>
                <button
                  onClick={() => navigate(`/ideas/${art.slug}`)}
                  className="hover:text-foreground transition-colors text-left line-clamp-1"
                >
                  {art.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Column */}
        <div>
          <h4 className="font-mono-label text-warm-wine mb-4">AskOut Products</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <button onClick={() => navigate("/bouquet/create")} className="hover:text-foreground transition-colors">
                Digital Bouquets
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/create")} className="hover:text-foreground transition-colors">
                Ask Out Cards
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/voice/create")} className="hover:text-foreground transition-colors">
                Voice Note Gifts
              </button>
            </li>
            <li>
              <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">
                AskOut Home
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default IdeasFooter;
