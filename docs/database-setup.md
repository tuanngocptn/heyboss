# Database Setup Guide

This guide explains how to set up the PostgreSQL database for storing toxic boss reports.

## 🗄️ Database Schema

The application uses Prisma ORM with PostgreSQL to store boss reports. The main table `toxic_bosses` stores:

### Boss Information
- **bossName** - Full name of the toxic boss (required)
- **bossCompany** - Company name (optional)
- **bossPosition** - Job title/position (optional)
- **bossDepartment** - Department (optional)
- **bossAge** - Age range (optional)
- **workLocation** - Office location (optional)

### Report Details
- **reporterEmail** - Reporter's email (optional/anonymous)
- **reportContent** - Detailed report content (required)
- **categories** - Array of toxic behavior types
- **submissionDate** - When the report was submitted

### File Storage
- **markdownPath** - URI path to markdown report file
- **pdfPath** - URI path to PDF evidence (if uploaded)
- **zipPath** - URI path to zip package

### Metadata
- **verified** - Whether report has been verified (default: false)
- **published** - Whether report is publicly visible (default: false)
- **createdAt/updatedAt** - Automatic timestamps

## 🚀 Development Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Development Database

```bash
# Connect to PostgreSQL
psql postgres

# Create user and database
CREATE USER heyboss_user WITH PASSWORD 'your_password';
CREATE DATABASE heyboss_dev OWNER heyboss_user;
GRANT ALL PRIVILEGES ON DATABASE heyboss_dev TO heyboss_user;

# Exit PostgreSQL
\q
```

### 3. Configure Environment Variables

Update your `.env.dev` with your database credentials:

```env
DATABASE_URL="postgresql://heyboss_user:your_password@localhost:5432/heyboss_dev?schema=public"
```

### 4. Run Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Run migration to create tables
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

## 🌐 Production Setup

### Database Providers

**Recommended options for production:**

1. **Vercel Postgres** (Easiest with Vercel deployment)
   - Go to Vercel dashboard → Storage → Create Database
   - Copy the connection string to environment variables

2. **Supabase** (Free tier available)
   - Sign up at [supabase.com](https://supabase.com)
   - Create new project → Get connection string

3. **Railway** (Simple deployment)
   - Sign up at [railway.app](https://railway.app)
   - Create PostgreSQL service → Get connection string

4. **AWS RDS** (Enterprise scale)
   - Create RDS PostgreSQL instance
   - Configure security groups and VPC

### Environment Variables for Production

Add to your Vercel environment variables:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
```

### Deployment Commands

```bash
# Deploy migrations to production
npm run db:deploy
```

## 🔍 Database Operations

### Common Queries

**Search bosses by name:**
```sql
SELECT * FROM toxic_bosses
WHERE "bossName" ILIKE '%search_term%';
```

**Find reports by company:**
```sql
SELECT * FROM toxic_bosses
WHERE "bossCompany" ILIKE '%company_name%';
```

**Get verified reports:**
```sql
SELECT * FROM toxic_bosses
WHERE verified = true AND published = true;
```

### Prisma Client Usage

```typescript
import { prisma } from '@/lib/db';

// Create a new report
const report = await prisma.toxicBoss.create({
  data: {
    bossName: "John Doe",
    bossCompany: "Evil Corp",
    reportContent: "Toxic behavior details...",
    categories: ["Micromanaging", "Blame shifting"],
    submissionDate: new Date(),
  }
});

// Search reports
const reports = await prisma.toxicBoss.findMany({
  where: {
    bossName: {
      contains: "John",
      mode: 'insensitive'
    }
  },
  orderBy: {
    submissionDate: 'desc'
  }
});
```

## 📊 Indexing Strategy

The schema includes indexes for optimal search performance:

- `bossName` - Primary search field
- `bossCompany` - Company-based filtering
- `workLocation` - Location-based filtering
- `submissionDate` - Chronological sorting

## 🔒 Security Considerations

1. **Connection Security**: Always use SSL in production
2. **Access Control**: Limit database user permissions
3. **Data Privacy**: Store only necessary information
4. **Backup Strategy**: Regular automated backups
5. **Monitoring**: Set up database performance monitoring

## 🛠️ Available Scripts

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:deploy      # Deploy migrations to production
npm run db:studio      # Open Prisma Studio GUI
```

## 🔧 Troubleshooting

**Connection Issues:**
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Ensure firewall allows connection

**Migration Errors:**
- Check database permissions
- Verify schema changes are valid
- Reset database if needed: `prisma migrate reset`

**Performance Issues:**
- Add appropriate indexes
- Monitor query performance
- Consider connection pooling