export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
  items?: string[];
  callout?: {
    text: string;
    ctaLabel: string;
    ctaLink: string;
  };
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  heroImage: string;
  tags: string[];
  intro: string;
  sections: ArticleSection[];
  faq?: ArticleFaq[];
  relatedSlugs: string[];
  askOutCta?: {
    title: string;
    description: string;
    buttonText: string;
    link: string;
  };
}

export const ARTICLES: Article[] = [
  {
    slug: "birthday-surprise-ideas-for-girlfriend",
    title: "20 Personal Birthday Surprise Ideas for Your Girlfriend",
    description: "Looking for birthday surprise ideas for your girlfriend? Explore 25 thoughtful, romantic, and creative ideas ranging from digital keepsakes to intimate experiences.",
    category: "birthday",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-10",
    updatedAt: "2026-03-01",
    readingTime: "7 min read",
    heroImage: "/flowers/pink-rose.png",
    tags: ["birthday", "girlfriend", "surprises", "romance", "gifts"],
    intro: "Making your girlfriend feel truly celebrated on her birthday isn't about spending thousands—it's about intentionality. The best birthday surprises are those that show you pay attention to the little things: her favorite songs, shared memories, or quiet moments she treasures.",
    sections: [
      {
        id: "digital-surprises",
        heading: "1. Digital & Distance-Friendly Surprises",
        content: "If you are apart, or want to start her day with something personal, digital gestures can arrive before the in-person celebration begins.",
        items: [
          "Send a custom digital bouquet that reveals blossom by blossom with a personalized letter.",
          "Curate a 12-song playlist where each track represents a specific memory from your relationship.",
          "Record a voice note sharing what you have admired most about her over the past year.",
          "Create a digital scavenger hunt with clues hidden across her favorite websites or photos.",
          "Schedule surprise text messages throughout the day at times matching her birth date (e.g., 9:15 AM for Sept 15)."
        ],
        callout: {
          text: "Want to turn a message into a keepsake? Build a personalized bouquet or card in a few minutes.",
          ctaLabel: "Create a Birthday Surprise →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "thoughtful-gestures",
        heading: "2. Thoughtful Daily Gestures & Morning Moments",
        content: "How her birthday starts sets the tone for the entire day. Surprise her before her normal daily routine begins.",
        items: [
          "Prepare breakfast in bed featuring her exact coffee order and favorite warm pastries.",
          "Leave handwritten sticky notes in hidden spots—inside her jacket pocket, mirror frame, or book.",
          "Upgrade an everyday item she uses constantly (like a cozy throw blanket or ceramic mug).",
          "Deliver flowers to her workspace with a handwritten card instead of an anonymous receipt.",
          "Recreate her ideal morning routine with relaxing music, aromatic tea, and a clear plan for the chores."
        ]
      },
      {
        id: "experiential-ideas",
        heading: "3. Experiential & Interactive Celebrations",
        content: "Memories stay long after wrapping paper is discarded. Gift her an experience tailored to her personality.",
        items: [
          "Recreate your very first date together down to the exact table or playlist.",
          "Host an intimate backyard picnic with fairy lights, her favorite wine, and cozy cushions.",
          "Plan a surprise day trip to a nearby town or scenic viewpoint she's been saving on Instagram.",
          "Book a private workshop together—like pottery making, candle crafting, or pasta cooking.",
          "Plan a sunset picnic with a pre-packed basket of snacks she actually enjoys."
        ]
      },
      {
        id: "sentimental-keepsakes",
        heading: "4. Sentimental & Personalized Keepsakes",
        content: "Sentimental gifts communicate depth and commitment in ways off-the-shelf items cannot.",
        items: [
          "Assemble an open-when letter bundle (Open when you're stressed, Open when you miss me).",
          "Commission a custom illustration of your favorite photo together.",
          "Frame a custom star map showing the night sky on the day you met.",
          "Compile a video montage with video messages from her closest friends and family.",
          "Gift a piece of birthstone jewelry with a subtle engraved date or initial."
        ]
      }
    ],
    faq: [
      {
        question: "How can I surprise my girlfriend on a budget?",
        answer: "Focus on details that show you notice her. A personalized digital bouquet, a handwritten letter, or a first-date dinner at home can feel more meaningful than an expensive generic gift."
      },
      {
        question: "What is a good morning birthday surprise?",
        answer: "Sending a personalized digital card or voice note right when she wakes up, accompanied by her favorite breakfast in bed or coffee order, is one of the sweetest ways to start her day."
      }
    ],
    relatedSlugs: [
      "cute-birthday-messages-for-girlfriend",
      "romantic-gifts-for-girlfriend",
      "digital-gift-ideas-for-someone-you-love"
    ],
    askOutCta: {
      title: "Make Her Birthday Truly Special",
      description: "Send a custom digital bouquet or romantic card that opens with interactive magic. Made in 2 minutes, shared as a private link.",
      buttonText: "Create Her Surprise Moment",
      link: "/bouquet/create"
    }
  },

  {
    slug: "birthday-surprise-ideas-for-boyfriend",
    title: "15 Birthday Surprise Ideas for Your Boyfriend That He'll Actually Love",
    description: "Discover 20 creative, fun, and meaningful birthday surprise ideas for your boyfriend. From unexpected experiences to thoughtful digital gifts.",
    category: "birthday",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-12",
    updatedAt: "2026-03-01",
    readingTime: "6 min read",
    heroImage: "/flowers/tulip.png",
    tags: ["birthday", "boyfriend", "surprises", "gifts", "couples"],
    intro: "Finding the right birthday surprise for your boyfriend comes down to understanding how he likes to feel appreciated. Whether he loves quiet sentimental moments, adventurous outdoor dates, or playful digital surprises, the secret is making it personal.",
    sections: [
      {
        id: "creative-surprises",
        heading: "1. Fun & Playful Surprises",
        content: "Inject excitement into his birthday with playful activities and creative reveals.",
        items: [
          "Send him an interactive Ask-Out card asking him on a secret birthday date night.",
          "Set up a retro game tournament or game night featuring his childhood favorites and specialty snacks.",
          "Organize a clue-based treasure hunt around his apartment leading to his main gift.",
          "Plan a surprise weekend road trip, making sure he has agreed to keep the dates free and knows what to pack.",
          "Order a custom cake decorated with inside jokes or his favorite pop culture reference."
        ],
        callout: {
          text: "Plan a surprise date with a playful interactive card that invites him to say yes.",
          ctaLabel: "Build an Ask-Out Card →",
          ctaLink: "/create"
        }
      },
      {
        id: "relaxed-ideas",
        heading: "2. Relaxed & Low-Key Experiences",
        content: "Not everyone wants a big party. For many people, protected quality time is the most thoughtful gift.",
        items: [
          "Host an intimate movie marathon complete with theater-style popcorn, snacks, and no interruptions.",
          "Cook his favourite comfort meal from scratch and set the table for an unrushed evening.",
          "Book a relaxing couple's massage or create a soothing spa night at home.",
          "Take him to a live sporting event or concert featuring his favorite team or band.",
          "Plan a craft beer or whiskey tasting session at home with curated tasting notes."
        ]
      },
      {
        id: "meaningful-gifts",
        heading: "3. Meaningful & Personal Touches",
        content: "Show him how deeply you know him with gifts that tie into his passions.",
        items: [
          "Record a warm voice note sharing 5 things you respect and admire most about him.",
          "Gift a high-quality leather accessory engraved with his initials or a special coordinate.",
          "Frame a photo from one of your favorite trips together with a note on the back.",
          "Upgrade a daily tech or lounge essential he wouldn't buy for himself.",
          "Write a list of '30 Reasons I Love You' sealed in individual tiny envelopes."
        ]
      }
    ],
    faq: [
      {
        question: "What is a good low-cost birthday surprise for a boyfriend?",
        answer: "Cooking his favorite meal, sending him a playful voice note gift, or planning a cozy movie night with his favorite snacks are low-cost but deeply appreciated surprises."
      }
    ],
    relatedSlugs: [
      "romantic-gifts-for-boyfriend",
      "cute-ways-to-surprise-your-partner",
      "proposal-ideas-for-couples"
    ],
    askOutCta: {
      title: "Surprise Him in Seconds",
      description: "Send him a playful card or voice note reveal directly to his phone.",
      buttonText: "Create a Boyfriend Surprise",
      link: "/create"
    }
  },

  {
    slug: "anniversary-surprise-ideas",
    title: "10 Romantic Anniversary Surprise Ideas for Couples (Local & Distance)",
    description: "Celebrate your anniversary with 18 romantic surprise ideas, from nostalgic memory walks to personal digital keepsakes.",
    category: "anniversary",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-14",
    updatedAt: "2026-03-02",
    readingTime: "6 min read",
    heroImage: "/flowers/white-rose.png",
    tags: ["anniversary", "couples", "romance", "surprises", "love"],
    intro: "Anniversaries are milestones that deserve to be paused for and honored. Whether it is your 1st year or 10th anniversary, the key to a memorable celebration is honoring the journey you have built together.",
    sections: [
      {
        id: "nostalgic-ideas",
        heading: "1. Nostalgic & Memory-Driven Surprises",
        content: "Looking back on where your story started brings warmth and deep romantic connection.",
        items: [
          "Revisit the place where you first met, first kissed, or got engaged.",
          "Send a digital bouquet wrapped with your wedding or anniversary song lyrics.",
          "Recreate your wedding menu or your very first anniversary dinner at home.",
          "Create a timeline photo album spanning every year of your relationship.",
          "Write a love letter reflecting on how your love has grown and matured."
        ],
        callout: {
          text: "Mark your anniversary with a digital bouquet that unfolds petal by petal with your love story.",
          ctaLabel: "Build Anniversary Bouquet →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "luxurious-gestures",
        heading: "2. Intimate & Special Date Experiences",
        content: "Step away from daily responsibilities to focus entirely on each other.",
        items: [
          "Book a cozy weekend getaway at a cabin, boutique stay, or beachside retreat.",
          "Plan a surprise candlelit dinner under the stars with a custom playlist.",
          "Take a sunset boat cruise or scenic drive together.",
          "Renew your vows or promises privately with written notes to each other.",
          "Schedule a full day away from screens to enjoy uninterrupted conversation."
        ]
      }
    ],
    faq: [
      {
        question: "What can I do for an anniversary if we are long distance?",
        answer: "Send a digital bouquet or voice note gift, order their favorite food to their doorstep at the exact same time as yours, and hold a virtual candlelit dinner over video call."
      }
    ],
    relatedSlugs: [
      "anniversary-messages-for-partner",
      "how-to-write-a-love-letter",
      "long-distance-date-ideas"
    ],
    askOutCta: {
      title: "Celebrate Your Love Story",
      description: "Craft a beautiful digital anniversary bouquet or romantic note in minutes.",
      buttonText: "Create Anniversary Moment",
      link: "/bouquet/create"
    }
  },

  {
    slug: "long-distance-relationship-gift-ideas",
    title: "10 Thoughtful Long Distance Relationship Gift Ideas That Bridge the Gap",
    description: "Discover 15 meaningful long-distance relationship gift ideas. Send instant digital surprises, voice notes, personalized keepsakes, and physical reminders.",
    category: "long-distance",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-15",
    updatedAt: "2026-03-02",
    readingTime: "7 min read",
    heroImage: "/flowers/lavender.png",
    tags: ["long-distance", "gifts", "couples", "digital-gifts", "romance"],
    intro: "Being in a long-distance relationship means finding creative ways to make your presence felt across miles and time zones. The best long-distance gifts are instant, emotional, and tangible reminders that you are thinking of them.",
    sections: [
      {
        id: "instant-digital-gifts",
        heading: "1. Instant Digital Surprises (Zero Shipping Delays)",
        content: "When distance makes physical shipping slow or complicated, digital gifts arrive instantly with zero waiting time.",
        items: [
          "Send a custom digital bouquet with personalized flowers and a private note via a single shareable link.",
          "Record a heartfelt voice note gift that plays back with a vintage sound wave reveal.",
          "Send a surprise coffee or lunch voucher for their local favorite spot right when their workday gets tough.",
          "Curate a collaborative Spotify playlist updated weekly with songs that remind you of them.",
          "Design a digital countdown card leading up to your next visit date."
        ],
        callout: {
          text: "Send your partner a digital bouquet or voice note when distance or timing makes a physical gift difficult.",
          ctaLabel: "Send Instant Digital Gift →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "physical-keepsakes",
        heading: "2. Physical & Touchpoint Keepsakes",
        content: "Physical items they can hold provide comfort when you cannot be there in person.",
        items: [
          "Dual timezone touch lamps or long-distance bracelets that light up when tapped.",
          "A cozy hoodie or scarf sprayed with your favorite signature cologne or perfume.",
          "A custom dual-city map print showcasing both of your locations joined by a heart line.",
          "Open-when letters filled with photos, jokes, and encouragement for hard days.",
          "A plush blanket accompanied by a note: 'Wrap yourself in this when you miss my hugs.'"
        ]
      }
    ],
    faq: [
      {
        question: "What is the best instant gift for long distance couples?",
        answer: "A digital bouquet or a personalized voice note gift created on AskOut can be shared via WhatsApp or DM instantly, giving them an emotional reveal without waiting for mail delivery."
      }
    ],
    relatedSlugs: [
      "digital-gift-ideas-for-someone-you-love",
      "long-distance-date-ideas",
      "how-to-make-someone-feel-special"
    ],
    askOutCta: {
      title: "Bridge the Distance Today",
      description: "Send a digital gift link in seconds to remind them how much they mean to you.",
      buttonText: "Send a Digital Gift",
      link: "/bouquet/create"
    }
  },

  {
    slug: "romantic-gifts-for-girlfriend",
    title: "9 Meaningful & Romantic Gifts for Your Girlfriend She'll Treasure",
    description: "Explore 22 meaningful romantic gifts for your girlfriend. Unique ideas ranging from personalized digital tokens to elegant keepsakes.",
    category: "romantic-gifts",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-18",
    updatedAt: "2026-03-03",
    readingTime: "6 min read",
    heroImage: "/flowers/daisy.png",
    tags: ["romantic-gifts", "girlfriend", "anniversary", "birthday", "love"],
    intro: "A truly romantic gift speaks to your girlfriend's emotions and shows her that she is seen, valued, and loved. Here are 22 romantic gift ideas that stand out from generic store-bought options.",
    sections: [
      {
        id: "meaningful-tokens",
        heading: "1. Emotional & Sentimental Gifts",
        content: "Gifts that recall a shared memory often feel more personal than a generic present.",
        items: [
          "A personalized digital bouquet featuring her favorite flower types and a hidden letter.",
          "A custom lock-and-key bracelet or delicate necklace with your anniversary date.",
          "A jar filled with 365 handwritten notes for her to open one each morning.",
          "A custom song written and recorded about your love story.",
          "A photo book documenting your trips, quiet moments, and favorite memories."
        ],
        callout: {
          text: "Create a digital bouquet for her with custom flowers, ribbon, and a heartfelt message.",
          ctaLabel: "Build Her Bouquet Now →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "everyday-romance",
        heading: "2. Everyday Romantic Upgrades",
        content: "Small luxuries that make her daily routine feel special.",
        items: [
          "A luxury silk pillowcase or pajama set in her favorite color.",
          "High-end scented candles with notes of lavender, amber, or rose.",
          "A personalized leather tote or wallet embossed with her initials.",
          "A spa gift voucher for a relaxing pampering day."
        ]
      }
    ],
    faq: [
      {
        question: "What makes a gift romantic for a girlfriend?",
        answer: "Personalization and emotional effort. Gifts that reference inside jokes, shared memories, or express heartfelt words carry far more romantic weight than expensive generic items."
      }
    ],
    relatedSlugs: [
      "birthday-surprise-ideas-for-girlfriend",
      "how-to-write-a-love-letter",
      "digital-gift-ideas-for-someone-you-love"
    ],
    askOutCta: {
      title: "Surprise Her with Romance",
      description: "Design a digital gift that shows her how much she means to you.",
      buttonText: "Create Her Gift",
      link: "/bouquet/create"
    }
  },

  {
    slug: "romantic-gifts-for-boyfriend",
    title: "9 Unique Romantic Gifts for Your Boyfriend That Show You Care",
    description: "Looking for romantic gifts for your boyfriend? Discover 16 practical, sentimental, and creative ideas he will genuinely appreciate.",
    category: "romantic-gifts",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-20",
    updatedAt: "2026-03-03",
    readingTime: "5 min read",
    heroImage: "/flowers/tulip.png",
    tags: ["romantic-gifts", "boyfriend", "couples", "gifts", "love"],
    intro: "Men love feeling appreciated and romanced just as much as anyone else. Finding a romantic gift for your boyfriend means blending thoughtfulness with elements he finds meaningful or practical.",
    sections: [
      {
        id: "heartfelt-gifts",
        heading: "1. Heartfelt & Unexpected Surprises",
        content: "Surprise gifts that touch his emotional side.",
        items: [
          "A voice note gift capturing a warm audio message he can replay anytime.",
          "A sleek leather wallet with a tiny photo of you two hidden in the card slot.",
          "A custom engraved watch back with your anniversary date or coordinates.",
          "An Ask-Out card inviting him to an all-expenses-paid date night hosted by you.",
          "A personalized book highlighting all the reasons he makes you happy."
        ],
        callout: {
          text: "Send him a voice note gift wrapped in a interactive reveal card.",
          ctaLabel: "Create a Voice Gift →",
          ctaLink: "/voice/create"
        }
      },
      {
        id: "practical-romance",
        heading: "2. Practical Luxury Items",
        content: "High-quality items he will use daily while thinking of you.",
        items: [
          "A premium wool or cashmere scarf for cozy outings.",
          "A wireless charging stand for his desk or bedside table.",
          "A weekend duffel bag for spontaneous couples' road trips.",
          "A curated box of artisanal coffee beans or single-origin chocolates."
        ]
      }
    ],
    faq: [
      {
        question: "Do guys like receiving voice notes or romantic cards?",
        answer: "Yes! Most guys rarely receive explicit verbal appreciation, so hearing your voice express love or receiving a sleek card is deeply memorable for them."
      }
    ],
    relatedSlugs: [
      "birthday-surprise-ideas-for-boyfriend",
      "cute-ways-to-surprise-your-partner",
      "digital-gift-ideas-for-someone-you-love"
    ],
    askOutCta: {
      title: "Send Him a Digital Moment",
      description: "Record a voice note or send a romantic card in 2 minutes.",
      buttonText: "Create Boyfriend Gift",
      link: "/voice/create"
    }
  },

  {
    slug: "digital-gift-ideas-for-someone-you-love",
    title: "12 Creative Digital Gift Ideas You Can Send Instantly as a Link",
    description: "Discover 12 creative digital gift ideas you can create online and deliver instantly via a single link. Perfect for long-distance, last-minute, or meaningful surprises.",
    category: "special-occasions",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-22",
    updatedAt: "2026-03-04",
    readingTime: "6 min read",
    heroImage: "/flowers/pink-rose.png",
    tags: ["digital-gifts", "long-distance", "surprises", "instant-gifts", "couples"],
    intro: "Modern romance isn't bound by physical shipping or postal delays. Digital gifts allow you to deliver instant emotional magic right to your partner's phone screen, whether you are across the room or across oceans.",
    sections: [
      {
        id: "top-digital-gifts",
        heading: "1. Top Digital Gift Ideas for Couples",
        content: "Instant gifts designed for high emotional impact with zero waiting.",
        items: [
          "Digital Bouquet: An interactive online bouquet that unfolds with personalized flowers, ribbons, and notes.",
          "Voice Note Reveal: A private audio recording wrapped in a beautiful interactive reveal interface.",
          "Ask-Out Card: A playful card with interactive buttons ('Yes!' and a dodging 'No' button) for date proposals.",
          "Shared Digital Photo Gallery: A private interactive album filled with voice captions and memories.",
          "Curated Spotify Love Playlist: A collection of tracks accompanied by written notes for each song.",
          "Digital Coupon Book: Redeemable cards for back rubs, movie picks, breakfast in bed, or weekend road trips.",
          "Online Video Memory Montage: A compiled video of shared clips and heartfelt video wishes.",
          "Virtual Date Voucher: An invitation link for a planned online dinner date or movie night.",
          "Custom Star Map PDF: A high-resolution star map of the exact sky on the night you met.",
          "Digital Love Letter: A beautifully formatted online letter with embedded photos and secret notes.",
          "Online Workshop Pass: Enrolling both of you in an online cooking, mixology, or art masterclass.",
          "E-Gift Card for an Experience: Instant passes to a local spa, concert, or favorite dining spot."
        ],
        callout: {
          text: "Create a digital bouquet, voice gift, or ask-out card instantly on AskOut.",
          ctaLabel: "Build Your Instant Gift →",
          ctaLink: "/bouquet/create"
        }
      }
    ],
    faq: [
      {
        question: "Why choose a digital gift over physical flowers?",
        answer: "Digital gifts never fade, deliver instantly without shipping fees or delays, and can include voice recordings, letters, and interactive elements that physical items cannot match."
      }
    ],
    relatedSlugs: [
      "long-distance-relationship-gift-ideas",
      "romantic-gifts-for-girlfriend",
      "how-to-make-someone-feel-special"
    ],
    askOutCta: {
      title: "Create an Instant Digital Gift",
      description: "Send a shareable link that opens with beautiful interactive animation.",
      buttonText: "Create Moment Now",
      link: "/bouquet/create"
    }
  },

  {
    slug: "how-to-write-a-love-letter",
    title: "How to Write a Heartfelt Love Letter: Step-by-Step Guide & Tips",
    description: "Learn how to write a deeply emotional, authentic love letter. Includes structural guides, tone tips, opening lines, and example phrases for your partner.",
    category: "love-letters",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-24",
    updatedAt: "2026-03-04",
    readingTime: "7 min read",
    heroImage: "/flowers/white-rose.png",
    tags: ["love-letters", "writing-guide", "romance", "messages", "couples"],
    intro: "Writing a love letter can feel intimidating if you try to sound like a 19th-century poet. The truth is, the most powerful love letters are simple, honest, and specific. Your partner doesn't want Shakespeare—they want to hear your true voice.",
    sections: [
      {
        id: "letter-structure",
        heading: "1. The 5-Step Structure of a Great Love Letter",
        content: "Follow this simple framework to write a letter that flows naturally and hits all the right emotional notes.",
        items: [
          "Step 1: Warm Salutation & Opening – Express why you are writing right now (e.g., 'Sitting here thinking about us...').",
          "Step 2: Specific Memories – Mention a specific memory or moment that made you fall deeper in love.",
          "Step 3: Character Appreciation – Detail what you admire about who they are as a person (their kindness, humor, resilience).",
          "Step 4: Impact on Your Life – Explain how having them in your life has changed you for the better.",
          "Step 5: Future Promise & Warm Closing – Reaffirm your commitment and look forward to the future together."
        ],
        callout: {
          text: "Want to deliver your love letter inside an interactive digital bouquet?",
          ctaLabel: "Wrap Letter in Bouquet →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "writing-tips",
        heading: "2. Tips for Writing Authentic Love Letters",
        content: "Avoid generic clichés by focusing on concrete details.",
        items: [
          "Be specific: Instead of 'You make me happy,' write 'The way you laugh when our song comes on makes my whole day.'",
          "Focus on feelings: Describe how you feel when they walk into the room or hold your hand.",
          "Don't worry about perfection: Erasures or simple phrasing feel more human and genuine."
        ]
      }
    ],
    faq: [
      {
        question: "How long should a love letter be?",
        answer: "Quality matters more than length. A sincere 150-word letter that focuses on specific memories is far more powerful than three pages of generic romantic phrases."
      }
    ],
    relatedSlugs: [
      "romantic-love-letter-examples",
      "anniversary-messages-for-partner",
      "cute-birthday-messages-for-girlfriend"
    ],
    askOutCta: {
      title: "Turn Your Letter into a Surprise",
      description: "Embed your love letter inside a digital bouquet or card link.",
      buttonText: "Write & Send Letter",
      link: "/bouquet/create"
    }
  },

  {
    slug: "romantic-love-letter-examples",
    title: "3 Romantic Love Letter Examples for Every Relationship Stage",
    description: "Read 10 beautiful romantic love letter examples for anniversary, long distance, birthday, proposals, and quiet everyday moments.",
    category: "love-letters",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-25",
    updatedAt: "2026-03-05",
    readingTime: "8 min read",
    heroImage: "/flowers/lavender.png",
    tags: ["love-letters", "examples", "romance", "anniversary", "couples"],
    intro: "Sometimes you need inspiration before your own words begin to flow. Here are 10 authentic love letter examples tailored for different milestones and moments in your relationship.",
    sections: [
      {
        id: "anniversary-example",
        heading: "1. The Anniversary Love Letter Example",
        content: "'My love, looking back over this past year together, I am filled with gratitude. From quiet Sunday mornings to our wildest adventures, every single day feels warmer with you by my side. Thank you for loving me as I am. Happy Anniversary.'"
      },
      {
        id: "long-distance-example",
        heading: "2. The Long-Distance Love Letter Example",
        content: "'Though miles separate us today, you have never felt closer to my heart. Every phone call, every voice note, and every shared laugh reminds me that true connection knows no distance. I can't wait until I'm holding you again.'"
      },
      {
        id: "birthday-example",
        heading: "3. The Birthday Love Letter Example",
        content: "'Happy Birthday to my favorite person on earth! Seeing your smile and hearing your laugh brings endless joy into my life. May this year bring you all the love, happiness, and success you so richly deserve.'"
      }
    ],
    faq: [
      {
        question: "Can I copy these love letter examples?",
        answer: "Use them as inspiration! Customize the specific memories, names, and inside jokes to make the letter uniquely yours."
      }
    ],
    relatedSlugs: [
      "how-to-write-a-love-letter",
      "anniversary-messages-for-partner",
      "cute-birthday-messages-for-girlfriend"
    ],
    askOutCta: {
      title: "Send a Digital Love Letter",
      description: "Pair your love letter with digital flowers and interactive cards.",
      buttonText: "Create Digital Letter",
      link: "/bouquet/create"
    }
  },

  {
    slug: "cute-birthday-messages-for-girlfriend",
    title: "8 Cute & Emotional Birthday Messages for Your Girlfriend",
    description: "Find 35 cute, romantic, funny, and emotional birthday messages for your girlfriend. Copy and paste or customize for cards, texts, and gifts.",
    category: "birthday",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-26",
    updatedAt: "2026-03-05",
    readingTime: "5 min read",
    heroImage: "/flowers/pink-rose.png",
    tags: ["birthday", "girlfriend", "messages", "wishes", "romance"],
    intro: "Stuck on what to write in her birthday card? Whether you want something sweet, deeply romantic, or lightheartedly funny, here are 35 message ideas to make her smile.",
    sections: [
      {
        id: "sweet-messages",
        heading: "1. Sweet & Romantic Birthday Wishes",
        content: "Express how much light she brings into your life.",
        items: [
          "Happy Birthday to the girl who makes my world brighter every single day.",
          "You deserve all the love, happiness, and cake in the world today. Happy Birthday my love!",
          "Loving you is the easiest thing I've ever done. Happy Birthday to my favorite human.",
          "Another year older, another year even more stunning. Happy Birthday baby!",
          "To the person who holds my heart—may your birthday be as incredible as you are."
        ],
        callout: {
          text: "Send these birthday wishes wrapped in a digital bouquet reveal.",
          ctaLabel: "Send Birthday Bouquet →",
          ctaLink: "/bouquet/create"
        }
      },
      {
        id: "funny-messages",
        heading: "2. Playful & Cute Birthday Messages",
        content: "Keep it light and playful while still expressing love.",
        items: [
          "Happy Birthday! I love you even more than you love iced coffee.",
          "I'm so glad you were born—mostly because my life would be super boring without you.",
          "Happy Birthday to my partner in crime and official thief of my hoodies."
        ]
      }
    ],
    faq: [
      {
        question: "What should I write in my girlfriend's birthday text morning?",
        answer: "Pair a warm, specific message with a card link. For example: 'Happy birthday, my love. I hope today includes your favourite coffee, a slow morning, and one excellent surprise.'"
      }
    ],
    relatedSlugs: [
      "birthday-surprise-ideas-for-girlfriend",
      "romantic-gifts-for-girlfriend",
      "how-to-write-a-love-letter"
    ],
    askOutCta: {
      title: "Send Her a Birthday Card Link",
      description: "Combine your birthday message with interactive visual cards on AskOut.",
      buttonText: "Create Birthday Card",
      link: "/create"
    }
  },

  {
    slug: "anniversary-messages-for-partner",
    title: "4 Deep & Meaningful Anniversary Messages for Your Partner",
    description: "40 deep, emotional, and romantic anniversary messages for your husband, wife, boyfriend, or girlfriend. Perfect for cards, captions, and letters.",
    category: "anniversary",
    author: "AskOut Editorial Team",
    publishedAt: "2026-02-28",
    updatedAt: "2026-03-06",
    readingTime: "6 min read",
    heroImage: "/flowers/daisy.png",
    tags: ["anniversary", "messages", "couples", "romance", "love"],
    intro: "Celebrating another year together is a testament to shared joy, growth, and commitment. Here are 40 meaningful anniversary wishes to express your gratitude for your partner.",
    sections: [
      {
        id: "deep-messages",
        heading: "1. Deep & Emotional Anniversary Wishes",
        content: "Messages that celebrate commitment and deep emotional bond.",
        items: [
          "Every year with you is my favorite year yet. Happy Anniversary to my soulmate.",
          "Thank you for being my constant home, my best friend, and my greatest adventure.",
          "I didn't think I could love you more than the day we met, yet here we are. Happy Anniversary.",
          "Through every high and low, holding your hand is where I belong. Happy Anniversary."
        ],
        callout: {
          text: "Attach your anniversary note to a digital bouquet of roses and lavender.",
          ctaLabel: "Build Anniversary Card →",
          ctaLink: "/bouquet/create"
        }
      }
    ],
    faq: [
      {
        question: "How do I write a short anniversary caption?",
        answer: "'365 days of loving you and I'm just getting started. Happy Anniversary!' is short, classic, and memorable."
      }
    ],
    relatedSlugs: [
      "anniversary-surprise-ideas",
      "how-to-write-a-love-letter",
      "romantic-love-letter-examples"
    ],
    askOutCta: {
      title: "Send Your Anniversary Note",
      description: "Wrap your anniversary message inside an elegant digital flower bouquet.",
      buttonText: "Create Anniversary Moment",
      link: "/bouquet/create"
    }
  },

  {
    slug: "proposal-ideas-for-couples",
    title: "4 Personal Proposal Ideas for Couples (Creative & Intimate)",
    description: "Explore 15 creative, intimate, and romantic proposal ideas. From private outdoor setups to digital ask-out card reveals, pop the question in style.",
    category: "proposals",
    author: "AskOut Editorial Team",
    publishedAt: "2026-03-01",
    updatedAt: "2026-03-06",
    readingTime: "7 min read",
    heroImage: "/flowers/tulip.png",
    tags: ["proposals", "ask-out", "romance", "couples", "surprises"],
    intro: "Proposing—whether asking someone to be your partner, asking them on a first date, or proposing marriage—is one of life's most thrilling moments. The key is crafting a proposal that reflects your shared dynamic.",
    sections: [
      {
        id: "intimate-proposals",
        heading: "1. Intimate & Personal Proposal Ideas",
        content: "Proposals designed for private moments without public pressure.",
        items: [
          "Interactive Ask-Out Card: Send a cute digital card with a trick 'No' button for a playful dating proposal.",
          "Backyard Candlelit Setup: Create a fairy-light canopy with photos of your memories hanging from strings.",
          "Scavenger Hunt Memory Trail: Lead them through key spots in your relationship ending with the question.",
          "Private Sunset Picnic: Set up a quiet hill or beach picnic right as golden hour begins."
        ],
        callout: {
          text: "Planning a playful ask-out proposal? Build an interactive card with a trick 'No' button.",
          ctaLabel: "Create Ask-Out Card →",
          ctaLink: "/create"
        }
      }
    ],
    faq: [
      {
        question: "What is an Ask-Out card?",
        answer: "An Ask-Out card is a playful digital invitation card where the 'No' button moves away when hovered or clicked, ensuring they say 'Yes!' to your date proposal."
      }
    ],
    relatedSlugs: [
      "birthday-surprise-ideas-for-boyfriend",
      "cute-ways-to-surprise-your-partner",
      "how-to-make-someone-feel-special"
    ],
    askOutCta: {
      title: "Pop the Question Playfully",
      description: "Build an interactive ask-out card link in seconds.",
      buttonText: "Build Your Proposal Card",
      link: "/create"
    }
  },

  {
    slug: "long-distance-date-ideas",
    title: "5 Fun & Intimate Long Distance Date Ideas for Couples",
    description: "Stay connected miles apart with 14 creative long-distance date night ideas. Virtual movie nights, online cooking dates, and digital surprise reveals.",
    category: "date-ideas",
    author: "AskOut Editorial Team",
    publishedAt: "2026-03-02",
    updatedAt: "2026-03-06",
    readingTime: "6 min read",
    heroImage: "/flowers/lavender.png",
    tags: ["long-distance", "date-ideas", "couples", "virtual-dates", "romance"],
    intro: "Long-distance relationships don't mean sacrificing date night. With a little creativity, virtual dates can be just as romantic, engaging, and memorable as sitting across the table.",
    sections: [
      {
        id: "virtual-date-activities",
        heading: "1. Engaging Virtual Date Night Concepts",
        content: "Move beyond simple phone calls into shared interactive experiences.",
        items: [
          "Synchronized Meal Delivery: Order dinner to each other's doors simultaneously for a shared meal over video.",
          "Virtual Flower Reveal Night: Send a digital bouquet link mid-date for a surprise moment.",
          "Cozy Watch Party: Watch a movie or series together using teleparty tools with active chat and video.",
          "Online Trivia & Quiz Night: Take online relationship quizzes or create custom trivia about your story.",
          "Virtual Painting & Wine Night: Set up matching canvases and follow a YouTube painting tutorial together."
        ],
        callout: {
          text: "Send a digital flower bouquet link to arrive right during your virtual date night.",
          ctaLabel: "Send Virtual Flowers →",
          ctaLink: "/bouquet/create"
        }
      }
    ],
    faq: [
      {
        question: "How often should long distance couples have date nights?",
        answer: "Aim for at least 1-2 structured date nights per week where screens are focused entirely on each other, rather than background calling."
      }
    ],
    relatedSlugs: [
      "long-distance-relationship-gift-ideas",
      "digital-gift-ideas-for-someone-you-love",
      "cute-ways-to-surprise-your-partner"
    ],
    askOutCta: {
      title: "Elevate Your Virtual Date",
      description: "Send a digital gift link during your video date night.",
      buttonText: "Create Date Surprise",
      link: "/bouquet/create"
    }
  },

  {
    slug: "cute-ways-to-surprise-your-partner",
    title: "5 Small & Cute Ways to Surprise Your Partner Today (Just Because)",
    description: "Discover 20 simple, small, and cute ways to surprise your partner 'just because'. Spontaneous gestures that spark joy and deepen love daily.",
    category: "special-occasions",
    author: "AskOut Editorial Team",
    publishedAt: "2026-03-03",
    updatedAt: "2026-03-06",
    readingTime: "5 min read",
    heroImage: "/flowers/white-rose.png",
    tags: ["surprises", "couples", "gestures", "romance", "just-because"],
    intro: "You don't need a holiday or birthday to make your partner feel cherished. In fact, unexpected 'just because' gestures often carry the highest romantic emotional impact.",
    sections: [
      {
        id: "daily-surprises",
        heading: "1. Quick & Heartfelt Spontaneous Surprises",
        content: "Gestures that take under 5 minutes but bring instant joy.",
        items: [
          "Send a mid-day voice note gift sharing a memory that randomly popped into your head.",
          "Leave a sweet sticky note on their laptop keyboard or bathroom mirror.",
          "Send a digital bouquet to their phone while they are at work.",
          "Pick up their favorite snack or drink on your way home without being asked.",
          "Take care of a annoying chore on their to-do list before they wake up."
        ],
        callout: {
          text: "Send a spontaneous digital bouquet just because you're thinking of them.",
          ctaLabel: "Send 'Just Because' Gift →",
          ctaLink: "/bouquet/create"
        }
      }
    ],
    faq: [
      {
        question: "Why are 'just because' surprises so effective?",
        answer: "Because they aren't expected due to a calendar date. It proves you were thinking about your partner solely out of affection."
      }
    ],
    relatedSlugs: [
      "how-to-make-someone-feel-special",
      "digital-gift-ideas-for-someone-you-love",
      "romantic-gifts-for-girlfriend"
    ],
    askOutCta: {
      title: "Surprise Them Right Now",
      description: "Send a instant digital gift link to make their day.",
      buttonText: "Send Instant Surprise",
      link: "/bouquet/create"
    }
  },

  {
    slug: "how-to-make-someone-feel-special",
    title: "How to Make Someone Feel Special: 5 Meaningful Gestures That Matter",
    description: "A thoughtful guide on how to make someone feel special, loved, and deeply valued. Actionable ideas for partners, friends, and loved ones.",
    category: "special-occasions",
    author: "AskOut Editorial Team",
    publishedAt: "2026-03-04",
    updatedAt: "2026-03-06",
    readingTime: "6 min read",
    heroImage: "/flowers/daisy.png",
    tags: ["gestures", "love", "thoughtfulness", "relationships", "special"],
    intro: "Making someone feel truly special comes down to one core element: undivided, focused attention. When a person feels heard, remembered, and intentionally honored, their connection with you grows immeasurably.",
    sections: [
      {
        id: "core-principles",
        heading: "1. Principles of Making Someone Feel Valued",
        content: "Actionable habits that communicate genuine care.",
        items: [
          "Active Listening: Remember small details they mention off-hand and follow up later.",
          "Personalized Expressions: Create gifts that incorporate their specific favorite things rather than generic templates.",
          "Uninterrupted Presence: Put screens away during quality time together.",
          "Verbal Validation: State explicitly what you admire about their character.",
          "Digital Keepsakes: Send personalized digital moments that require thoughtful customization."
        ],
        callout: {
          text: "Create a custom digital moment that honors your special person today.",
          ctaLabel: "Create a Moment with AskOut →",
          ctaLink: "/bouquet/create"
        }
      }
    ],
    faq: [
      {
        question: "What is the fastest way to make someone feel special?",
        answer: "Expressing genuine gratitude for something specific they did recently, accompanied by a thoughtful message or digital gesture, instantly makes anyone feel appreciated."
      }
    ],
    relatedSlugs: [
      "cute-ways-to-surprise-your-partner",
      "digital-gift-ideas-for-someone-you-love",
      "how-to-write-a-love-letter"
    ],
    askOutCta: {
      title: "Make Someone Feel Special Today",
      description: "Craft a custom digital bouquet, card, or voice gift in minutes.",
      buttonText: "Start Creating Now",
      link: "/bouquet/create"
    }
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return ARTICLES.find((art) => art.slug === slug.toLowerCase());
};

export const getArticlesByCategory = (categorySlug: string): Article[] => {
  return ARTICLES.filter((art) => art.category.toLowerCase() === categorySlug.toLowerCase());
};

export const getRelatedArticles = (currentSlug: string, limit = 3): Article[] => {
  const current = getArticleBySlug(currentSlug);
  if (!current) return ARTICLES.slice(0, limit);

  const explicitlyRelated = ARTICLES.filter((a) => current.relatedSlugs.includes(a.slug));
  if (explicitlyRelated.length >= limit) return explicitlyRelated.slice(0, limit);

  const categoryRelated = ARTICLES.filter(
    (a) => a.category === current.category && a.slug !== current.slug && !explicitlyRelated.includes(a)
  );

  const combined = [...explicitlyRelated, ...categoryRelated];
  if (combined.length >= limit) return combined.slice(0, limit);

  const remaining = ARTICLES.filter((a) => a.slug !== current.slug && !combined.includes(a));
  return [...combined, ...remaining].slice(0, limit);
};

export const searchArticles = (query: string): Article[] => {
  const q = query.trim().toLowerCase();
  if (!q) return ARTICLES;

  return ARTICLES.filter(
    (art) =>
      art.title.toLowerCase().includes(q) ||
      art.description.toLowerCase().includes(q) ||
      art.tags.some((t) => t.toLowerCase().includes(q)) ||
      art.category.toLowerCase().includes(q)
  );
};
