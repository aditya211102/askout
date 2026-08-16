export interface CategoryInfo {
  slug: string;
  name: string;
  icon: string;
  title: string;
  description: string;
  heroTagline: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "birthday",
    name: "Birthday",
    icon: "❤️",
    title: "Birthday Ideas to Make Someone Feel Special",
    description: "Discover thoughtful birthday surprises, romantic messages, creative gifts, and digital ideas for your girlfriend, boyfriend, partner, or best friend.",
    heroTagline: "Make their birthday unforgettable with personal gestures and thoughtful surprises.",
  },
  {
    slug: "anniversary",
    name: "Anniversary",
    icon: "💍",
    title: "Anniversary Surprise Ideas & Romantic Gestures",
    description: "Celebrate your love story with unique anniversary gifts, cute date ideas, romantic messages, and digital memories created just for them.",
    heroTagline: "Commemorate every milestone with romance, nostalgia, and meaningful moments.",
  },
  {
    slug: "love-letters",
    name: "Love Letters",
    icon: "💌",
    title: "Romantic Love Letter Examples & Writing Guides",
    description: "Learn how to write a heartfelt love letter with genuine wording ideas, emotional examples, and cute messages for every stage of love.",
    heroTagline: "Put your innermost feelings into words that leave a lasting emotional impression.",
  },
  {
    slug: "long-distance",
    name: "Long Distance",
    icon: "🌍",
    title: "Long Distance Relationship Gift & Date Ideas",
    description: "Bridge the distance with creative digital gifts, online date night ideas, and heartfelt surprises you can send instantly anywhere in the world.",
    heroTagline: "Keep the spark burning brightly no matter how many miles lie between you.",
  },
  {
    slug: "romantic-gifts",
    name: "Romantic Gifts",
    icon: "💐",
    title: "Meaningful Romantic Gift Ideas for Couples",
    description: "Find romantic gifts for your girlfriend or boyfriend, from personalized digital keepsakes to heartfelt surprises that express your love.",
    heroTagline: "Gifts that carry emotional weight and show how deeply you care.",
  },
  {
    slug: "proposals",
    name: "Proposals",
    icon: "✨",
    title: "Creative & Memorable Proposal Ideas",
    description: "Plan an intimate, unforgettable proposal with creative ask-out cards, romantic setups, and sweet ways to ask them to be yours.",
    heroTagline: "Pop the question in a way that feels intimate, personal, and undeniably special.",
  },
  {
    slug: "date-ideas",
    name: "Date Ideas",
    icon: "🥂",
    title: "Romantic & Creative Date Ideas for Couples",
    description: "Explore unique date ideas for weekend hangouts, anniversaries, stay-at-home dates, and distance-friendly virtual meetups.",
    heroTagline: "Create memories together with dates designed for deep connection and fun.",
  },
  {
    slug: "special-occasions",
    name: "Special Occasions",
    icon: "🎉",
    title: "Surprise Ideas for Special Occasions",
    description: "Sweet ways to celebrate promotions, Valentine's Day, apologies, just-because moments, and life's meaningful achievements.",
    heroTagline: "Turn ordinary days and big milestones into cherished memories.",
  },
];

export const getCategoryBySlug = (slug: string): CategoryInfo | undefined => {
  return CATEGORIES.find((cat) => cat.slug === slug.toLowerCase());
};
