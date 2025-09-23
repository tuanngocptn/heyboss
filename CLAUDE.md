# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HeyBoss** is a Next.js application (v15.5.3) that helps employees identify and take action against toxic bosses. The website features:

### Technology Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS v4
- ESLint v9
- React 19
- Turbopack for fast development and builds
- Configured for deployment to Vercel at heyboss.wtf

### Site Structure
- **Landing Page** (`/`) - Emotional marketing page with problem identification, health consequences, solutions, and call-to-actions
- **Boss Directory** (`/directory`) - Searchable directory of toxic boss profiles with ratings and summaries
- **Individual Boss Profiles** (`/boss/[id]`) - Detailed pages with complaints, evidence, and anonymous comments

## Development Commands

```bash
npm run dev          # Start development server with Turbopack at http://localhost:3000
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript type checking
```

## Project Structure

```
src/app/
├── page.tsx              # Landing page with marketing content
├── directory/
│   └── page.tsx         # Boss directory with search functionality
└── boss/
    └── [id]/
        └── page.tsx     # Individual boss profile pages
```

## Key Features

### Landing Page
- Dark theme with emotional copywriting
- Smooth scrolling navigation between sections
- Problem identification checklist
- Health consequences awareness
- Solution strategies (Gray Rock Method, Power Reversal, Exit Strategy)
- Social proof with statistics
- Multiple call-to-action buttons

### Boss Directory
- Real-time search by boss name or company
- Boss profile cards with ratings and summaries
- Responsive grid layout
- Mock data for 6 toxic boss profiles

### Boss Profile Pages
- Detailed boss information with company and position
- Category-based complaint breakdown with visual bars
- Anonymous comment system with form submission
- PDF document viewer placeholder
- Report functionality

## Data Structure

Mock boss data includes:
- Basic info (name, company, position)
- Toxicity rating (1-5 stars)
- Complaint categories with counts
- Detailed complaint descriptions
- Anonymous user comments

## Architecture Notes

- **Client Components**: All pages use `'use client'` directive for interactivity
- **Routing**: Next.js App Router with dynamic routes for boss profiles
- **Styling**: Dark theme (gray-900 background) with red accent colors
- **Responsive**: Mobile-first design with Tailwind CSS breakpoints
- **TypeScript**: Strict typing with custom interfaces for boss data
- **ESLint**: Custom configuration with disabled `react/no-unescaped-entities` rule

## Internationalization (i18n)

### Supported Languages
- **English** (`en`) - Default language
- **Vietnamese** (`vi`) - Vietnamese translation
- **Future Languages**: Architecture supports easy addition of more languages

### URL Structure
- English: `/`, `/directory`, `/boss/[id]`
- Vietnamese: `/vi`, `/vi/danh-sach`, `/vi/sep/[id]`

### Translation Files
- `messages/en.json` - English translations
- `messages/vi.json` - Vietnamese translations
- Organized by page sections (navigation, home, directory, boss)

### Components
- **LanguageSwitcher**: Dropdown in navigation to switch between languages
- **Localized Navigation**: All links use `@/i18n/routing` for proper locale handling
- **Translation Keys**: All text uses `useTranslations()` hook for dynamic content

### Adding New Languages
1. Create new translation file in `messages/[locale].json`
2. Add locale to `src/i18n/routing.ts` in the `locales` array
3. Update pathnames if needed for localized URLs
4. Add option to LanguageSwitcher component

## Deployment

- **Domain**: heyboss.wtf (configured in vercel.json)
- **Platform**: Vercel with automatic deployments
- **Build**: Static generation for landing and directory pages, server-side rendering for dynamic boss profiles
- **i18n**: Automatic locale detection and routing via middleware