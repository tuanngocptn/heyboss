import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',

  // The locale detection strategy
  localeDetection: true,

  pathnames: {
    '/': '/',
    '/directory': {
      en: '/directory',
      vi: '/danh-sach'
    },
    '/boss/[id]': {
      en: '/boss/[id]',
      vi: '/sep/[id]'
    },
    '/privacy': {
      en: '/privacy',
      vi: '/bao-mat'
    },
    '/terms': {
      en: '/terms',
      vi: '/dieu-khoan'
    },
    '/contact': {
      en: '/contact',
      vi: '/lien-he'
    },
    '/report': {
      en: '/report',
      vi: '/bao-cao'
    }
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);