# HeyBoss.WTF 🚨

**Fight Toxic Management - Take Back Your Power**

HeyBoss.WTF is a Next.js application that helps employees identify, document, and take action against toxic bosses. The website features a comprehensive database of workplace villains, survival strategies, and anonymous reporting tools.

## 🌟 Features

- **🏠 Landing Page** - Emotional marketing with problem identification and health consequences
- **📋 Boss Directory** - Searchable database of toxic boss profiles with ratings
- **👤 Boss Profiles** - Detailed pages with complaints, evidence, and anonymous comments
- **📝 Report System** - Anonymous reporting with PDF evidence upload and Telegram integration
- **🌍 Internationalization** - Full English and Vietnamese language support
- **📱 Responsive Design** - Mobile-first design with dark theme and red accents

## 🚀 Quick Start

### For New Developers

```bash
# 1. Clone the repository
git clone https://github.com/your-username/heyboss.git
cd heyboss

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.dev
# Edit .env.dev with your Telegram bot token

# 4. Run development server
npm run dev
```

**📖 Need more help?** Check out our [Development Setup Guide](./docs/setup-dev.md)

### For Users

Visit **[heyboss.wtf](https://heyboss.wtf)** to:
- Identify toxic boss behavior patterns
- Browse our database of reported managers
- Submit anonymous reports with evidence
- Get survival strategies and legal guidance

## 📚 Documentation

All project documentation is located in the [`docs/`](./docs/) folder:

- **[📋 Development Setup](./docs/setup-dev.md)** - Quick start for developers
- **[⚙️ Environment Configuration](./docs/environment-config.md)** - Detailed env vars guide
- **[🔌 API Documentation](./docs/api.md)** - API endpoints and usage
- **[🚀 Deployment Guide](./docs/deployment.md)** - Production deployment instructions
- **[📖 Complete Documentation](./docs/README.md)** - Full docs index

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS v4 with custom dark theme
- **Internationalization**: next-intl with English/Vietnamese support
- **Integrations**: Telegram Bot API for report submissions
- **Deployment**: Optimized for Vercel with automatic builds

## 📋 Development Commands

```bash
npm run dev          # Start dev server (loads .env.dev automatically)
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript type checking
```

## 🤖 Telegram Integration

Reports are automatically sent to a configured Telegram group with:
- Formatted report summaries
- Uploaded PDF evidence
- Generated markdown files
- Organized by topics for easy management

## 🌐 Site Structure

- **`/`** - Landing page with problem identification and solutions
- **`/directory`** - Boss directory with search functionality
- **`/boss/[id]`** - Individual boss profile pages
- **`/report`** - Anonymous reporting form with evidence upload
- **`/privacy`**, **`/terms`**, **`/contact`** - Legal and contact pages

## 🔒 Security Features

- Anonymous reporting with optional email contact
- Math captcha to prevent spam submissions
- Rate limiting to prevent abuse
- File type validation for evidence uploads
- Comprehensive input sanitization

## 🌍 Internationalization

- **English** (`/en`) - Default language
- **Vietnamese** (`/vi`) - Full translation with localized URLs
- Easy to add more languages through the translation system

## 🎨 Design Highlights

- **Dark theme** with professional gray color scheme
- **Red accent colors** for emphasis and CTAs
- **Responsive design** with mobile-first approach
- **Modern UI elements** with gradients and animations
- **Accessible** with proper semantic HTML and ARIA labels

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the setup guide in [`docs/setup-dev.md`](./docs/setup-dev.md)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This site provides general information and resources for dealing with toxic workplace situations. Always consult with legal professionals for specific workplace issues. We protect user anonymity and do not condone harassment or illegal activities.

---

**🚨 Fighting toxic management, one report at a time.**

*Built with ❤️ and righteous anger by developers who've been there.*
