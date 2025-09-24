'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-600/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ef4444 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">

          {/* Brand Section */}
          <div className="text-center md:text-left space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <Link
                href="/"
                className="group text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text hover:from-red-400 hover:via-red-300 hover:to-red-500 transition-all duration-300 transform hover:scale-105"
              >
                HeyBoss.WTF
              </Link>
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2 group-hover:w-20 transition-all duration-300"></div>
            </div>

            <p className="text-gray-300 text-base leading-relaxed max-w-xs mx-auto md:mx-0">
              {t('footer.tagline')}
            </p>

            {/* Decorative Element */}
            <div className="flex justify-center md:justify-start space-x-2 pt-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h4 className="text-xl font-bold text-white mb-1 relative">
                Quick Links
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              </h4>
            </div>

            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('navigation.home')}
              </Link>
              <Link
                href="/directory"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('navigation.directory')}
              </Link>
              <Link
                href="/report"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('navigation.report')}
              </Link>
            </div>
          </div>

          {/* Legal Section */}
          <div className="text-center md:text-right space-y-6">
            <div className="relative">
              <h4 className="text-xl font-bold text-white mb-1 relative">
                Legal
                <div className="absolute -bottom-2 left-1/2 md:left-auto md:right-0 transform -translate-x-1/2 md:transform-none w-12 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              </h4>
            </div>

            <div className="space-y-4">
              <Link
                href="/privacy"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('footer.links.privacy')}
              </Link>
              <Link
                href="/terms"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('footer.links.terms')}
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-red-400 transition-all duration-300 text-base font-medium"
              >
                {t('footer.links.contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Separator with Style */}
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600"></div>
            <div className="px-4">
              <div className="w-3 h-3 bg-red-500 rotate-45 opacity-60"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-600 to-gray-600"></div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 text-center leading-relaxed max-w-4xl mx-auto px-4 italic">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-400 text-base font-medium">
            {t('footer.copyright')}
          </p>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
    </footer>
  );
}