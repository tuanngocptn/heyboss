'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-bold text-red-500 hover:text-red-400 transition-colors">
              HeyBoss.WTF
            </Link>
            <p className="text-gray-400 mt-2 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/directory"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('navigation.directory')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.links.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.links.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t('footer.links.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}