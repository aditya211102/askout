import Seo from "@/components/Seo";
import IdeasFooter from "@/components/ideas/IdeasFooter";
import IdeasNavbar from "@/components/ideas/IdeasNavbar";
import { SITE_NAME } from "@/lib/site";

const About = () => (
  <div className="min-h-screen bg-background text-foreground texture-grain flex flex-col">
    <Seo
      title={`About AskOut Editorial | ${SITE_NAME}`}
      description="Learn how AskOut creates and reviews practical ideas for meaningful digital surprises, dates, messages, and celebrations."
      path="/about"
    />
    <IdeasNavbar />
    <main className="max-w-3xl mx-auto w-full px-6 py-20 flex-1">
      <p className="font-mono-label text-warm-wine mb-3">ABOUT ASKOUT EDITORIAL</p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-8">Ideas should feel like they came from someone who knows you.</h1>
      <div className="space-y-6 text-foreground/80 leading-relaxed">
        <p>AskOut makes shareable digital moments for people who want to say something thoughtful, even when they cannot be there in person. Our guides start with the same principle: a good surprise reflects a real person, a real relationship, and the moment you are celebrating.</p>
        <p>Articles are planned and reviewed by the AskOut editorial team. We prioritise ideas that are specific, practical, and adaptable to different budgets, locations, and relationship styles. We update a guide when we make a meaningful improvement, rather than changing dates just to make it appear new.</p>
        <p>Some guides mention AskOut products where they are genuinely useful, such as sending a private bouquet, card, or voice note over distance. Those mentions are part of our own service; they do not change the editorial goal of giving readers ideas they can use with or without AskOut.</p>
        <p>Have a suggestion or spot something that needs correcting? Contact us through the support link in your account. Reader feedback helps us make these guides more useful.</p>
      </div>
    </main>
    <IdeasFooter />
  </div>
);

export default About;
