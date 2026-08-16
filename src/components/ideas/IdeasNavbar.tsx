import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackCreateMomentClick } from "@/lib/ideasAnalytics";

export const IdeasNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
  }, []);

  const handleCreateClick = () => {
    trackCreateMomentClick("ideas_navbar");
    navigate("/bouquet/create");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60 transition-all">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo & Editorial Badge */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-left group flex items-center gap-2">
            <span className="font-display text-xl font-bold text-foreground group-hover:text-warm-wine transition-colors">
              Askout
            </span>
          </button>
          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4">
            <button
              onClick={() => navigate("/ideas")}
              className={`font-mono-label px-2.5 py-1 rounded-full text-[11px] transition-colors ${
                location.pathname === "/ideas"
                  ? "bg-warm-wine/10 text-warm-wine font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              IDEAS HUB
            </button>
          </div>
        </div>

        {/* Links & CTA */}
        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigate("/ideas")}
            className={`text-sm font-medium transition-colors hidden sm:block ${
              location.pathname.startsWith("/ideas")
                ? "text-warm-wine font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ideas
          </button>

          <Button
            onClick={handleCreateClick}
            variant="ghost"
            size="sm"
            className="text-xs font-medium text-foreground hover:text-warm-wine hover:bg-warm-wine/5 rounded-full transition-colors hidden xs:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-warm-gold" />
            Create
          </Button>

          <Button
            onClick={() => navigate(loggedIn ? "/profile" : "/auth")}
            variant="outline"
            size="sm"
            className="rounded-full border-foreground/15 text-xs font-medium hover:bg-foreground hover:text-background transition-all"
          >
            {loggedIn ? (
              <>
                <User className="w-3.5 h-3.5 mr-1.5" /> Account
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default IdeasNavbar;
