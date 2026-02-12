

# CrushCards 💘
**Interactive Valentine's Day cards with playful "No" button tricks**

## How It Works
1. **Creator builds a card** — picks a theme, writes a message, chooses a "No" button trick, and adds animated stickers
2. **Creator pays $2.99** — one-time checkout via Dodo Payments (overlay checkout)
3. **Creator gets a unique shareable link** — sends it to their crush
4. **Recipient opens the link** — sees the animated card with the big question and two buttons: **Yes** and **No**
5. **The No button misbehaves** — depending on the trick the creator picked 😈
6. **When they finally click Yes** — a celebratory animation plays with a custom message

---

## Pages & Features

### 🏠 Landing Page
- Fun, flirty hero section explaining CrushCards
- "Create Your Card" CTA button
- Example card preview/demo showing the No-button trick in action

### 🎨 Card Builder Page
- **Step 1 — Choose a Theme** (8 options):
  - Classic Romance (red & pink hearts)
  - Cute & Kawaii (pastel, cartoon style)
  - Elegant Gold (luxury feel, gold accents)
  - Funny/Meme (playful, bold text)
  - Dark Mode Love (moody, neon accents)
  - Retro Valentine (vintage vibes)
  - Minimalist (clean, modern)
  - Galaxy Love (cosmic/starry theme)

- **Step 2 — Write Your Message**: Custom "Will you be my Valentine?" text + personal message shown after they click Yes

- **Step 3 — Pick a No-Button Trick**:
  - 🏃 **Runaway** — button dodges the cursor
  - 🔬 **Shrinking** — gets smaller each click
  - 🔄 **Swap** — Yes grows, No text changes ("Are you sure?", "Really?!", "Think again!")
  - 🎭 **Disguise** — No button turns into another Yes button

- **Step 4 — Add Stickers**: Select animated stickers (hearts, roses, cupid arrows, sparkles, etc.) to decorate the card

- **Live Preview** panel showing the card as they build it

### 💳 Checkout
- Dodo Payments overlay checkout for $2.99 one-time payment
- After payment, card is saved and a unique shareable link is generated
- Copy link or share directly

### 💌 Card Viewer Page (the shared link)
- Full-screen animated card experience
- The question with Yes/No buttons
- No-button trick plays out
- Once Yes is clicked → confetti/hearts celebration animation + personal message reveals

---

## Backend (Supabase + Dodo Payments)
- **Supabase database** to store card data (theme, message, trick choice, sticker placements) and generate unique card links
- **Supabase edge function** to create Dodo Payments checkout sessions securely (keeps API key server-side)
- **Dodo Payments** for the $2.99 one-time payment with overlay checkout
- Cards are only accessible via their link after payment is confirmed

