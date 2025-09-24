# Environment Configuration Guide

This guide explains all the environment variables used in HeyBoss.WTF and how to configure them properly.

## 📋 Environment Files

### `.env.example`
Template file with all possible configuration options and detailed comments. Always kept in the repository.

### `.env.dev`
Development environment configuration. Automatically loaded when running `npm run dev`.

### `.env.local`
Local overrides for any environment. Next.js loads this by default.

### `.env.production`
Production environment configuration (not committed to repository).

## 🤖 Telegram Bot Configuration

### Required Variables

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```
- **Purpose**: Authentication token for your Telegram bot
- **How to get**: Message @BotFather on Telegram, use `/newbot` command
- **Format**: Number, colon, alphanumeric string
- **Required**: Yes

```env
TELEGRAM_CHAT_ID=-1003147773870
```
- **Purpose**: ID of the Telegram group where reports will be sent
- **Format**: Negative number for groups, positive for users
- **Default**: `-1003147773870` (project group)
- **Required**: Yes

```env
TELEGRAM_TOPIC_ID=5
```
- **Purpose**: Specific topic within the group for organizing reports
- **Format**: Positive integer
- **Default**: `5`
- **Required**: Only if group uses topics

## ⚙️ Application Settings

### URLs and Domains

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
- **Purpose**: Base URL of the application
- **Development**: `http://localhost:3000`
- **Production**: `https://heyboss.wtf`

```env
NEXT_PUBLIC_SITE_DOMAIN=heyboss.wtf
```
- **Purpose**: Domain name for the site
- **Used for**: Meta tags, canonical URLs, etc.

### File Storage

```env
REPORTS_DIR=./reports
MAX_PDF_SIZE=10485760
```
- **REPORTS_DIR**: Where uploaded files are stored
- **MAX_PDF_SIZE**: Maximum PDF size in bytes (10MB default)

## 🔒 Security Configuration

### Rate Limiting

```env
RATE_LIMIT_PER_HOUR=5
```
Prevents spam by limiting reports per IP address per hour.

### Cloudflare Turnstile (Anti-Bot Protection)

```env
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key_here
TURNSTILE_SECRET_KEY=your_turnstile_secret_key_here
```

**Setup Instructions:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Turnstile
3. Create a new site
4. Copy the Site Key (public) and Secret Key (private)
5. Add keys to your environment variables

**Benefits over math captcha:**
- Better security against bots
- No user interaction required for most users
- Cloudflare's advanced bot detection
- Better user experience

## 🛠️ Development Settings

### Debug Mode

```env
DEBUG_MODE=false
MOCK_TELEGRAM=false
```

- **DEBUG_MODE**: Enables detailed logging
- **MOCK_TELEGRAM**: Logs messages instead of sending to Telegram

### Next.js Configuration

```env
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

## 🔌 Optional Integrations

### Email Notifications (Future Feature)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@heyboss.wtf
```

### Database (Future Feature)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/heyboss
DATABASE_PROVIDER=postgresql
```

### Analytics (Future Feature)

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=1234567
```

## 🚀 Deployment Environments

### Vercel

```env
VERCEL_URL=your-app.vercel.app
VERCEL_ENV=production
```

### Custom Domains

```env
NEXT_PUBLIC_CUSTOM_DOMAIN=heyboss.wtf
```

## 📝 Configuration Examples

### Development Setup

```env
# Copy from .env.example to .env.dev
TELEGRAM_BOT_TOKEN=your_dev_bot_token
TELEGRAM_CHAT_ID=-1003147773870
TELEGRAM_TOPIC_ID=5
NODE_ENV=development
DEBUG_MODE=true
MOCK_TELEGRAM=true  # Don't spam real group during development
```

### Production Setup

```env
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_CHAT_ID=-1003147773870
TELEGRAM_TOPIC_ID=5
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://heyboss.wtf
DEBUG_MODE=false
MOCK_TELEGRAM=false
```

## ❗ Security Best Practices

1. **Never commit** sensitive environment files to Git
2. **Use different bots** for development and production
3. **Limit bot permissions** to only what's needed
4. **Rotate tokens** regularly
5. **Monitor usage** for suspicious activity

## 🔍 Troubleshooting

### Common Issues

**Bot token not working:**
- Check format (number:letters)
- Verify bot is created via @BotFather
- Ensure token is copied completely

**Messages not sending:**
- Verify bot is added to the group
- Check bot has "Send Messages" permission
- Confirm group ID is correct (negative for groups)

**File uploads failing:**
- Check `REPORTS_DIR` exists and is writable
- Verify `MAX_PDF_SIZE` allows your file size
- Ensure sufficient disk space