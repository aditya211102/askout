import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackArticleCtaClick } from "@/lib/ideasAnalytics";

interface AskOutCtaCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  link?: string;
  articleSlug?: string;
}

export const AskOutCtaCard = ({
  title = "Create a Moment with AskOut",
  description = "Want to turn some of these ideas into an actual surprise? AskOut lets you create a personalized digital moment with messages, photos, interactive cards, and flowers that you can share through a single link.",
  buttonText = "Create Your Own Moment →",
  link = "/bouquet/create",
  articleSlug = "general",
}: AskOutCtaCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    trackArticleCtaClick(articleSlug, buttonText);
    navigate(link);
  };

  return (
    <div className="my-10 bg-gradient-to-br from-card via-warm-cream/40 to-card border border-border/80 rounded-2xl p-8 shadow-sm relative overflow-hidden texture-grain">
      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warm-wine/10 text-warm-wine font-mono-label text-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-warm-gold" />
          <span>AskOut Moments</span>
        </div>
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground mb-3">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {description}
        </p>
        <Button
          onClick={handleClick}
          className="rounded-full px-6 py-5 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all group"
        >
          {buttonText}
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default AskOutCtaCard;
