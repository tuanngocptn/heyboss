# Deployment Guide

This guide covers deploying HeyBoss.WTF to various platforms and environments.

## 🚀 Vercel Deployment (Recommended)

HeyBoss.WTF is optimized for Vercel deployment with automatic builds and scaling.

### Prerequisites

- Vercel account
- GitHub repository access
- Telegram bot token
- Domain configured (optional)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Connect your GitHub repository
4. Select the HeyBoss.WTF repository

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

```env
# Required
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_CHAT_ID=-1003147773870
TELEGRAM_TOPIC_ID=5

# Recommended
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_DOMAIN=heyboss.wtf

# Optional
RATE_LIMIT_PER_HOUR=5
MAX_PDF_SIZE=10485760
DEBUG_MODE=false
MOCK_TELEGRAM=false
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test the deployment URL

### Step 4: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `heyboss.wtf`)
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## 🐳 Docker Deployment

Deploy using Docker for containerized environments.

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create reports directory
RUN mkdir -p /app/reports && chown nextjs:nodejs /app/reports

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  heyboss:
    build: .
    ports:
      - "3000:3000"
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
      - TELEGRAM_TOPIC_ID=${TELEGRAM_TOPIC_ID}
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
    volumes:
      - ./reports:/app/reports
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - heyboss
    restart: unless-stopped
```

### Deploy Commands

```bash
# Build and run
docker-compose up --build -d

# View logs
docker-compose logs -f heyboss

# Stop
docker-compose down
```

## ☁️ AWS Deployment

Deploy to AWS using various services.

### AWS App Runner

1. Create App Runner service
2. Connect to GitHub repository
3. Configure build settings:
   ```yaml
   version: 1.0
   runtime: nodejs18
   build:
     commands:
       build:
         - npm install
         - npm run build
   run:
     runtime-version: 18
     command: npm start
     network:
       port: 3000
       env: PORT
   ```
4. Set environment variables in App Runner console

### AWS Lambda (Serverless)

Using Next.js serverless deployment:

```bash
# Install serverless framework
npm install -g serverless
npm install serverless-nextjs-plugin

# Configure serverless.yml
# Deploy
serverless deploy
```

## 🌐 Traditional VPS Deployment

Deploy on a Virtual Private Server with PM2.

### Prerequisites

- Ubuntu/Debian VPS
- Node.js 18+
- Nginx
- SSL certificate

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/heyboss.git
cd heyboss

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
# Edit .env.production with your values

# Build application
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'heyboss',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production'
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 3: Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private-key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File upload size limit
    client_max_body_size 10M;
}
```

## 🔍 Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] Telegram bot created and tested
- [ ] Bot added to target group with permissions
- [ ] Domain DNS configured (if using custom domain)
- [ ] SSL certificate ready (for HTTPS)

### Post-Deployment

- [ ] Test homepage loads correctly
- [ ] Test report form submission
- [ ] Verify Telegram integration works
- [ ] Check file uploads work
- [ ] Test internationalization (EN/VI)
- [ ] Verify all links work
- [ ] Test mobile responsiveness

### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Monitor Telegram bot logs
- [ ] Set up file storage alerts
- [ ] Track report submission metrics

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Telegram Not Working:**
- Check bot token format
- Verify bot permissions in group
- Test with curl/Postman first

**File Upload Issues:**
- Check server file size limits
- Verify reports directory permissions
- Monitor disk space

**Environment Variables:**
```bash
# Test environment loading
node -e "console.log(process.env.TELEGRAM_BOT_TOKEN)"
```

## 📊 Performance Optimization

### Next.js Optimizations

```javascript
// next.config.js
module.exports = {
  experimental: {
    turbopack: true,
  },
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};
```

### Caching Strategy

- Static assets: CDN + browser cache
- API responses: Consider Redis for rate limiting
- File uploads: Direct to cloud storage in production

## 🔐 Security Considerations

### Production Security

- Use HTTPS everywhere
- Implement rate limiting
- Sanitize file uploads
- Monitor for abuse
- Regular security updates
- Backup report data
- Implement proper logging

### Environment Security

- Rotate Telegram bot tokens regularly
- Use different bots for dev/prod
- Limit bot permissions
- Monitor unusual activity
- Secure file storage locations