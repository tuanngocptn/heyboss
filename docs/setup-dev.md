# Development Setup for HeyBoss.WTF

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.dev
   # Edit .env.dev with your actual Telegram bot token
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   This automatically loads `.env.dev` environment variables

## Environment Files

- **`.env.dev`** - Development environment (auto-loaded by `npm run dev`)
- **`.env.local`** - Local overrides (Next.js default)
- **`.env.example`** - Template file (committed to repo)

## Development Commands

- `npm run dev` - Start dev server with `.env.dev` loaded
- `npm run dev:fast` - Start dev server with HTTPS
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Add your bot to the Telegram group
4. Update `TELEGRAM_BOT_TOKEN` in `.env.dev`

The report submissions will automatically be sent to the configured Telegram group and topic.