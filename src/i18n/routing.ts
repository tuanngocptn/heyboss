import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',

  pathnames: {
    '/': '/',
    '/directory': {
      en: '/directory',
      vi: '/danh-sach'
    },
    '/boss/[id]': {
      en: '/boss/[id]',
      vi: '/sep/[id]'
    }
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);