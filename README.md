# BeatMarket - Beat Selling Platform

A full-featured beat marketplace built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🎵 Browse and preview beats with waveform player
- 🛒 Shopping cart with license selection (Basic/Exclusive)
- 💳 PayPal and Cryptocurrency payment integration
- 👤 User authentication and dashboard
- 📥 Download manager for purchased beats
- 📊 Purchase history tracking

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Audio**: Wavesurfer.js
- **Payments**: PayPal + Crypto (NOWPayments)

## Getting Started

### 1. Clone and Install

```bash
cd beat-platform
bun install
```

### 2. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the contents of `supabase-seed.sql`
4. Go to **Settings → API** and copy your URL and anon key

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Storage (Optional)

1. Go to Supabase **Storage**
2. Create a new bucket called `beats`
3. Create a bucket called `covers`
4. Upload your beat files and cover images

### 5. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Beat listing page
│   ├── beats/[id]/page.tsx        # Beat detail page
│   ├── cart/page.tsx              # Shopping cart
│   ├── profile/me/page.tsx        # User dashboard
│   ├── auth/login/page.tsx        # Login page
│   ├── auth/signup/page.tsx       # Signup page
│   └── api/                       # API routes
├── components/
│   ├── navbar.tsx                 # Navigation
│   └── beat-card.tsx              # Beat card component
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   └── utils.ts                   # Utility functions
└── store/
    └── cart.ts                    # Cart state management
```

## Payment Setup

### PayPal

1. Create a PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a sandbox app
3. Copy Client ID and Secret to `.env.local`

### Cryptocurrency (NOWPayments)

1. Create an account at [nowpayments.io](https://nowpayments.io)
2. Get your API key from the dashboard
3. Add to `.env.local`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
PAYPAL_CLIENT_ID=your-live-paypal-id
PAYPAL_CLIENT_SECRET=your-live-paypal-secret
NOWPAYMENTS_API_KEY=your-nowpayments-key
NEXT_PUBLIC_URL=https://your-domain.com
```

## License

MIT
