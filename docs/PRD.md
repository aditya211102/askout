# 📋 CrushCards — Product Requirements Document (PRD)

## 1. Product Overview

- **Name:** CrushCards
- **Published URL:** https://askout.lovable.app
- **Tagline:** *"Make them say Yes! (because they literally can't say no 😈)"*
- **What it is:** A web app that lets users create and share interactive Valentine's Day cards with a playful twist — the "No" button misbehaves so the recipient is hilariously forced to click "Yes."

---

## 2. Target Audience

Anyone who wants to ask their crush, partner, or friend to be their Valentine in a fun, shareable, and memorable way. Age range: teens to young adults. Non-technical users — the entire flow is designed for simplicity.

---

## 3. User Journey (End-to-End)

1. User lands on homepage
2. Clicks "Create Your Card"
3. Card Builder: fills names, message, trick, stickers, theme
4. Clicks "Preview Your Card"
5. If happy → clicks "Save & Share"
6. Plan selection dialog: Basic $2.99 / Premium $3.99
7. Redirect to Auth page (sign up or log in)
8. Checkout: card saved to DB, redirect to Dodo Payments
9. Payment on Dodo Payments hosted page
10. Redirect back to Success page
11. Polling confirms payment via webhook
12. Shareable link displayed — user copies and sends to crush
13. Recipient opens `/card/:id`
14. Sees animated card with Yes/No buttons
15. No button misbehaves based on chosen trick
16. Eventually clicks Yes
17. 🎉 Confetti + personal message revealed

---

## 4. Pages & Routes

| Route | Page | Auth Required? | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Hero section, demo card, how-it-works, CTAs |
| `/create` | Card Builder | No | Multi-step card creation form |
| `/auth` | Auth | No | Email/password sign-up & login |
| `/checkout` | Checkout | Yes | Saves card to DB, creates Dodo payment session, redirects |
| `/success?card_id=X` | Success | No (polls DB) | Polls for payment confirmation, shows shareable link |
| `/profile` | Profile Dashboard | Yes | Lists all user's cards with status, links, plan badges |
| `/card/:id` | Card Viewer | No (public, paid cards only) | Full-screen interactive card experience for the recipient |
| `*` | Not Found | No | 404 page |

---

## 5. Feature Details

### 5.1 Landing Page (`/`)

- **Header:** CrushCards logo (Heart icon + gradient text), "My Cards" button (visible when logged in), "Create Your Card 💌" CTA
- **Hero section:** Animated floating hearts background (15 emoji hearts float upward infinitely via framer-motion). Large headline with gradient text. Subheading explaining the concept. CTA button with pulsing glow animation
- **Interactive demo card:** A live `DemoCard` component showing the "runaway" No button trick. Users can hover over "No" to see it dodge. Clicking "Yes" shows a celebration. "Try again" resets it
- **How it works:** 4-step grid (Pick a Theme → Write Your Message → Choose a Trick → Share the Link)
- **Footer:** Simple "Made with 💖 by CrushCards"

### 5.2 Card Builder (`/create`)

- **Layout:** Single-column form (max-w-2xl) with collapsible accordion sections

**Section 1 — Names & Message** (open by default)
- Recipient name (optional, max 50 chars)
- Sender name (optional, max 50 chars)
- Card Title / Question (default: "Will you be my Valentine?", max 100 chars)
- Sweet Note / Yes Message (default: "I promise to buy you snacks and send you cute cat memes!", max 300 chars, textarea)

**Section 2 — "No" Button Trick** (4 options, radio-style selection)
- 🏃 **Runaway** — button dodges the cursor on hover
- 🔬 **Shrinking** — gets 18-20% smaller each click
- 🔄 **Swap** — Yes button grows 12-15% per click, No text cycles through: "No" → "Are you sure?" → "Really?!" → "Think again!" → "Pretty please?" → "Last chance!" → "😢"
- 🎭 **Disguise** — after 2-3 clicks, No button text changes to "Yes 💖" and clicking it triggers the Yes action

**Section 3 — Stickers / Decorations** (grid of 16 stickers)
- 10 basic stickers: Heart, Rose, Cupid Arrow, Sparkle, Kiss, Love Letter, Teddy Bear, Love Bear, Cute Cat, Heart Bunny
- 6 premium stickers (marked with gold "Premium" badge): Ring, Dancing Hearts, Kissy Bear, Hug Bears, Love Penguin, Roses For You
- Each sticker has a custom PNG image stored in `/stickers/*.png`
- When added, stickers get random position (x: 10-90%, y: 10-90%), scale (0.8-1.2), and rotation (-15° to +15°)
- Toggle on/off, "Clear all" button

**Section 4 — Card Theme** (8 themes in 2-column grid)
- ❤️ Classic Romance — rose-pink gradient
- 🌸 Cute & Kawaii — pink-purple pastel
- ✨ Elegant Gold — amber-yellow *(Premium)*
- 😂 Funny/Meme — yellow-orange
- 🖤 Dark Mode Love — gray-purple dark *(Premium)*
- 💌 Retro Valentine — red-orange vintage
- 🤍 Minimalist — gray clean
- 🌌 Galaxy Love — indigo-purple cosmic *(Premium)*

- **Preview button:** "Preview Your Card" — transitions to a live interactive preview
- **Preview mode:** Shows the card exactly as the recipient would see it, with working trick interactions. "Go Back & Edit" and "Save & Share 💕" buttons

### 5.3 Plan Selection (Dialog)

- Triggered when user clicks "Save & Share"
- Two plans side by side:
  - **Basic — $2.99:** All themes, 4 button tricks, shareable link, basic stickers
  - **Premium — $3.99:** Everything in Basic + premium themes, premium stickers, priority support. Marked as "POPULAR"
- Selecting a plan stores `pendingCard` and `pendingPlan` in localStorage, then navigates to `/auth`

### 5.4 Authentication (`/auth`)

- Email/password sign-up and login (togglable form)
- Auto-confirm is enabled — users don't need to verify email
- After auth, checks localStorage for `pendingCard`:
  - If pending → redirects to `/checkout`
  - If no pending → redirects to `/profile`
- Uses `onAuthStateChange` listener for real-time session detection

### 5.5 Checkout (`/checkout`)

- Automated flow — no user interaction needed on this page
- Shows "Saving your card... Redirecting to payment ✨" with a spinning 💘
- Steps (all automatic):
  1. Verifies session exists (redirects to `/auth` if not)
  2. Reads `pendingCard` and `pendingPlan` from localStorage
  3. Inserts card into `cards` table with `paid: false`
  4. Calls `create-checkout` edge function with `cardId`, `plan`, and `redirectUrl`
  5. Receives Dodo Payments checkout URL
  6. Redirects browser to Dodo Payments hosted checkout
  7. Clears localStorage

### 5.6 Success Page (`/success?card_id=X`)

- **Polling state:** Pulsing heart animation, "Confirming payment..." message
- Polls the `cards` table every 3 seconds checking for `paid: true`
- **Done state:** 🎉 celebration, shows plan name, shareable link in a copy-able input field
- Actions: "Copy Link" button, "Preview" (opens card in new tab), "Create Another 💘"

### 5.7 Profile Dashboard (`/profile`)

- **Header:** CrushCards logo, user email, "Sign Out" button
- **Title:** "Your Cards 💌" with description
- **Create new CTA:** "Create New Card 💘" button
- **Cards list:** Each card shows:
  - Theme emoji + card question (truncated)
  - Plan badge (Basic with ✨ icon / Premium with 👑 icon)
  - Recipient name (if set)
  - Creation date
  - Payment status: "✓ Paid" (green) or "⏳ Pending" (amber)
  - For paid cards: "Copy Link" and "Open in new tab" buttons
- **Empty state:** 💔 emoji, "No cards yet" message with "Get Started 💖" CTA
- Auth-guarded: redirects to `/auth` if not logged in

### 5.8 Card Viewer (`/card/:id`)

- Public page — no auth required, but card must have `paid: true`
- Full-screen themed background matching the card's theme
- Stickers float around the card with bounce animations
- **Question card:** Frosted glass card showing:
  - "Dear [recipientName]," (if set)
  - Animated 💘 emoji
  - The question text
  - Yes and No buttons with the selected trick active
- **Celebration screen** (after clicking Yes):
  - 🎉 emoji with spring animation
  - "Yay! 💕" heading
  - The personal yes message
  - "With love, [senderName] 💕" (if set)
  - Row of bouncing heart emojis
  - Canvas confetti explosion (3 seconds, from both sides, pink/rose/amber/purple colors)

---

## 6. Database Schema

### 6.1 `cards` table

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | Yes | null | Auth user who created it |
| `theme` | text | No | `'classic'` | One of 8 theme keys |
| `question` | text | No | `'Will you be my Valentine?'` | Main card title |
| `yes_message` | text | No | `'You just made my day! 💕'` | Message shown after Yes |
| `no_button_trick` | text | No | `'runaway'` | One of 4 trick keys |
| `stickers` | jsonb | No | `'[]'` | Array of sticker placements |
| `recipient_name` | text | Yes | null | Optional recipient name |
| `sender_name` | text | Yes | null | Optional sender name |
| `plan` | text | No | `'basic'` | `'basic'` or `'premium'` |
| `paid` | boolean | No | `false` | Set to `true` by webhook |
| `created_at` | timestamptz | No | `now()` | Creation timestamp |

**RLS Policies (RESTRICTIVE):**
- `Anyone can view paid cards` → SELECT where `paid = true` (public card viewing)
- `Users can view their own cards` → SELECT where `auth.uid() = user_id` (profile dashboard)
- `Users can insert their own cards` → INSERT with check `auth.uid() = user_id`
- No UPDATE or DELETE allowed via client (payment status is only updated server-side)

### 6.2 `profiles` table

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | No | — | Auth user reference |
| `email` | text | Yes | null | User's email |
| `plan` | text | No | `'free'` | Current plan level |
| `created_at` | timestamptz | No | `now()` | — |
| `updated_at` | timestamptz | No | `now()` | Auto-updated |

**RLS Policies (RESTRICTIVE):**
- Users can view, insert, and update only their own profile
- No DELETE allowed

**Database Triggers:**
- `handle_new_user()` — auto-creates a profile row when a new user signs up
- `update_updated_at_column()` — auto-updates `updated_at` on profile changes

---

## 7. Backend Functions (Edge Functions)

### 7.1 `create-checkout`

- **Purpose:** Creates a Dodo Payments checkout session
- **Auth:** JWT verification disabled (called from authenticated client)
- **Input:** `{ cardId, plan, redirectUrl }`
- **Flow:**
  1. Reads `DODO_PAYMENTS_API_KEY` from secrets
  2. Maps plan to product ID (`DODO_PRODUCT_ID_BASIC` or `DODO_PRODUCT_ID_PREMIUM`)
  3. Determines base URL: `test.dodopayments.com` (default) or `live.dodopayments.com` (if `DODO_LIVE_MODE=true`)
  4. POST to `/checkouts` with `product_cart`, `return_url`, and `metadata.card_id`
  5. Returns `{ payment_link: checkout_url }`

### 7.2 `dodo-webhook`

- **Purpose:** Handles Dodo Payments webhook events after payment
- **Auth:** JWT verification disabled (external webhook)
- **Security:** Verifies HMAC SHA256 signature using `standardwebhooks` library with `DODO_PAYMENTS_WEBHOOK_SECRET`
- **Webhook URL:** Configured in Dodo Payments dashboard to point to the edge function endpoint
- **Handled events:** `payment.completed`, `payment.succeeded`, `payment_intent.succeeded`, `order.completed`
- **Flow:**
  1. Verify webhook signature
  2. Extract `card_id` from `metadata`
  3. Update card's `paid` status to `true` (using service role key, bypassing RLS)
  4. Update user's profile `plan` to match the card's plan

---

## 8. Payments Integration

- **Provider:** Dodo Payments
- **Plans:**
  - Basic: $2.99 (one-time)
  - Premium: $3.99 (one-time)
- **Mode:** Test mode by default, live mode when `DODO_LIVE_MODE=true`
- **Flow:** Redirect-based checkout. User is sent to Dodo's hosted payment page, then redirected back to `/success?card_id=X`
- **Configured Secrets:**
  - `DODO_PAYMENTS_API_KEY`
  - `DODO_PAYMENTS_WEBHOOK_SECRET`
  - `DODO_PRODUCT_ID_BASIC`
  - `DODO_PRODUCT_ID_PREMIUM`
  - `DODO_LIVE_MODE`

---

## 9. Authentication

- **Method:** Email + password (sign-up / sign-in)
- **Auto-confirm:** Enabled — users can sign in immediately without email verification
- **Session persistence:** localStorage, auto-refresh tokens
- **Post-login routing:**
  - If `pendingCard` exists in localStorage → `/checkout`
  - Otherwise → `/profile`
- **Profile auto-creation:** Database trigger creates a `profiles` row on every new sign-up

---

## 10. Design System

### Typography
- **Display font:** Playfair Display (serif) — used for all headings (h1-h6)
- **Body font:** DM Sans (sans-serif) — used for body text

### Color Palette (HSL tokens in `:root`)

| Token | HSL | Usage |
|-------|-----|-------|
| `--primary` | 340 82% 52% | Main CTA buttons, hearts, links |
| `--background` | 340 30% 97% | Page background |
| `--foreground` | 340 30% 10% | Main text |
| `--card` | 0 0% 100% | Card backgrounds |
| `--muted` | 340 20% 94% | No button, secondary surfaces |
| `--accent` | 25 95% 60% | Premium/accent elements |
| `--border` | 340 20% 90% | Card borders, dividers |
| `--crush-pink` | 340 82% 52% | Brand pink |
| `--crush-gold` | 40 90% 55% | Premium badges |
| `--crush-purple` | 280 60% 55% | Gradient accent |

### Animations
- **`text-gradient-crush`** — shifting pink-purple gradient on text
- **`animate-float`** — gentle 3s vertical bob
- **`animate-pulse-glow`** — pulsing pink box-shadow on CTAs
- **Framer Motion** used extensively for page transitions, button springs, sticker animations, confetti
- **`canvas-confetti`** library for celebration particle effects

### UI Components
- Built on **shadcn/ui** (Radix primitives + Tailwind)
- Rounded-full buttons, rounded-2xl/3xl cards
- Backdrop blur on headers and card viewer
- Responsive: mobile-first, works on all screen sizes

---

## 11. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + tailwindcss-animate |
| UI Library | shadcn/ui (Radix) |
| Animations | framer-motion, canvas-confetti |
| Routing | react-router-dom v6 |
| State | React useState/useEffect (no global state) |
| Data fetching | @supabase/supabase-js (direct queries) |
| Backend | Lovable Cloud |
| Payments | Dodo Payments (API + webhook) |
| Edge runtime | Deno (Edge Functions) |
| Fonts | Google Fonts (Playfair Display, DM Sans) |

---

## 12. Security Considerations

- Private API keys are stored as backend secrets, never exposed to the client
- RLS policies are RESTRICTIVE (not permissive) — data access is denied by default
- No client-side UPDATE on cards — payment status can only be changed by the webhook using the service role key
- Webhook signature verification using HMAC SHA256 via `standardwebhooks` library
- Auth tokens auto-refresh and persist in localStorage

---

## 13. Known Limitations & Future Considerations

- No password reset flow implemented
- No dark mode toggle (light mode only, except card themes themselves)
- Premium sticker/theme gating is visual only — no server-side enforcement preventing basic-plan users from selecting premium items
- Card data is immutable after creation (no edit functionality)
- No analytics or tracking on card views/opens
- No rate limiting on card creation
- Sticker positions are randomized, not user-draggable
