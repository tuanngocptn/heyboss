# Development Guide

## Auto-Reload Configuration

This project is configured with enhanced auto-reload capabilities for the best development experience. You no longer need to manually restart the server when making code changes.

### Features Enabled

✅ **Hot Module Replacement (HMR)** - Changes to React components reload instantly
✅ **Fast Refresh** - Preserves component state during updates
✅ **Turbopack** - Next.js's fast bundler for rapid builds
✅ **File Watching** - Automatically detects changes in all project files
✅ **Configuration Reload** - Automatically restarts when config files change

### Development Scripts

```bash
# Standard development server with auto-reload
npm run dev

# Enhanced development server with experimental features
npm run dev:fast

# Development server with additional watching features
npm run dev:watch
```

### What Auto-Reloads

- **React Components** (.tsx, .jsx files) - Hot reload with state preservation
- **Stylesheets** (CSS, Tailwind) - Instant style updates
- **Translation Files** (messages/*.json) - Language changes without restart
- **Configuration Files** (next.config.ts, etc.) - Automatic server restart
- **Environment Variables** (.env.local) - Server restart when modified

### Development Environment Variables

The following variables in `.env.local` optimize auto-reload performance:

```env
FAST_REFRESH=true
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
TURBOPACK=1
```

### Configuration Details

**Next.js Configuration** (`next.config.ts`):
- Enhanced webpack watch options
- Optimized Turbopack settings
- React Strict Mode for better debugging
- File polling for reliable change detection

**Middleware** - Automatically recompiles when routing changes
**Internationalization** - Translation updates reflect immediately

### Tips for Best Experience

1. **Keep the terminal open** to see compilation status
2. **Use browser dev tools** to see hot reload logs
3. **Save files frequently** for instant feedback
4. **Check terminal for errors** if auto-reload stops working

### Troubleshooting

If auto-reload stops working:
1. Check terminal for error messages
2. Restart the dev server: `npm run dev`
3. Clear Next.js cache: `rm -rf .next`
4. Restart your code editor

The development server will automatically detect and compile changes across all:
- React components and pages
- CSS and styling changes
- Translation files
- Configuration updates
- Type definitions

No manual restarts needed! 🚀