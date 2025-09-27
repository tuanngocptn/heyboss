# Docker Setup for HeyBoss.WTF

This guide explains how to run the HeyBoss.WTF application with PostgreSQL and Waline using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- Your environment variables (Telegram bot token, Turnstile keys)

## Quick Start

1. **Edit environment variables:**
   ```bash
   nano .env
   ```
   Update the following values:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `TURNSTILE_SECRET_KEY`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

2. **Start Docker services:**
   ```bash
   npm run local:up
   ```

3. **Start HeyBoss application locally:**
   ```bash
   npm run dev
   ```

4. **Access the services:**
   - **HeyBoss App**: http://localhost:3000
   - **Waline Comments**: http://localhost:8360
   - **PostgreSQL**: localhost:5432

## Services

### PostgreSQL (postgres:17.5)
- **Container**: `heyboss-postgres`
- **Port**: 5432
- **Database**: `heyboss`
- **User**: `postgres`
- **Password**: `postgres123`

### Waline (lizheming/waline:1.31.13)
- **Container**: `heyboss-waline`
- **Port**: 8360
- **Admin Panel**: http://localhost:8360/ui
- **Database**: Uses PostgreSQL with `wl_` prefix

### HeyBoss App
- **Development**: Runs locally via `npm run dev`
- **Port**: 3000
- **Environment**: Uses shared `.env` file

## Commands

```bash
# Start Docker services only (PostgreSQL + Waline)
npm run local:up

# Stop Docker services and clean up
npm run local:down

# View logs
docker-compose logs -f

# Database operations
npm run db:migrate
npm run db:studio

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d heyboss
```

## Data Persistence

- **PostgreSQL data**: Stored in `postgres_data` Docker volume
- **Report files**: Mounted from `./public/reports` directory

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token | Yes |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID | Yes |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret | Yes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | Yes |

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is healthy
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Application Issues
```bash
# Check application logs
docker-compose logs heyboss

# Restart application
docker-compose restart heyboss
```

### Waline Issues
```bash
# Check Waline logs
docker-compose logs waline

# Restart Waline
docker-compose restart waline
```

## Development

For development, you can override the HeyBoss service to use local development:

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  heyboss:
    build:
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` and `SITE_URL` to your domain
2. Change all default passwords and secrets
3. Configure proper SSL certificates
4. Set up proper backup for PostgreSQL data
5. Configure Waline social login providers