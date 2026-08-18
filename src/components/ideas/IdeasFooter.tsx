import { Link } from "react-router-dom";
import { CATEGORIES } from "@/data/ideas/categories";
import { ARTICLES } from "@/data/ideas/articles";

export const IdeasFooter = () => {
  return (
    <footer className="bg-card border-t border-border/70 py-16 px-6 mt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="md:col-span-1">
          <Link to="/" className="text-left mb-4 block">
            <span className="font-display text-2xl font-bold text-foreground">Askout Ideas</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Thoughtful ideas, romantic surprises, messages, and gifts for the people who matter most.
          </p>
          <Link to="/about" className="text-sm text-warm-wine hover:underline">
            About AskOut Editorial
          </Link>
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
                <Link
                  to={`/ideas/${cat.slug}`}
                  className="hover:text-foreground transition-colors text-left flex items-center gap-1.5"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
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
                <Link
                  to={`/ideas/${art.slug}`}
                  className="hover:text-foreground transition-colors text-left line-clamp-1"
                >
                  {art.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Column */}
        <div>
          <h4 className="font-mono-label text-warm-wine mb-4">AskOut Products</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/bouquet/create" className="hover:text-foreground transition-colors">
                Digital Bouquets
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-foreground transition-colors">
                Ask Out Cards
              </Link>
            </li>
            <li>
              <Link to="/voice/create" className="hover:text-foreground transition-colors">
                Voice Note Gifts
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                AskOut Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default IdeasFooter;
