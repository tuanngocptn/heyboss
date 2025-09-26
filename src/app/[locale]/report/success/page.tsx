'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ReportSuccessPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-600/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-red-500">{t('navigation.home')}</Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                href="/"
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-600 text-white text-sm md:text-base rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {t('navigation.backToHome')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-block animate-bounce mb-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-400 animate-pulse">
            {t('reportSuccess.title')}
          </h1>

          <div className="text-xl md:text-2xl text-gray-300 mb-8">
            {t('reportSuccess.subtitle')}
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-br from-green-900/50 via-green-800/30 to-green-700/50 rounded-2xl p-8 md:p-12 border border-green-600/30 backdrop-blur-sm mb-12">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-300">
              {t('reportSuccess.congratulations')}
            </h2>

            <div className="text-lg md:text-xl text-gray-200 leading-relaxed space-y-4">
              <p>{t('reportSuccess.message1')}</p>
              <p>{t('reportSuccess.message2')}</p>
              <p className="text-green-300 font-semibold">{t('reportSuccess.message3')}</p>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-700/50 rounded-2xl p-8 md:p-12 border border-blue-600/30 backdrop-blur-sm mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-blue-300 text-center">
            {t('reportSuccess.whatNext.title')}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">{t('reportSuccess.whatNext.step1.title')}</h4>
                <p className="text-gray-300">{t('reportSuccess.whatNext.step1.description')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">{t('reportSuccess.whatNext.step2.title')}</h4>
                <p className="text-gray-300">{t('reportSuccess.whatNext.step2.description')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">{t('reportSuccess.whatNext.step3.title')}</h4>
                <p className="text-gray-300">{t('reportSuccess.whatNext.step3.description')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">{t('reportSuccess.whatNext.step4.title')}</h4>
                <p className="text-gray-300">{t('reportSuccess.whatNext.step4.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/directory"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
            >
              {t('reportSuccess.actions.viewDirectory')}
            </Link>

            <Link
              href="/report"
              className="px-8 py-4 border-2 border-red-500 text-red-400 text-lg font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {t('reportSuccess.actions.reportAnother')}
            </Link>
          </div>

          <div className="text-sm text-gray-400 max-w-2xl mx-auto">
            {t('reportSuccess.disclaimer')}
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl md:text-3xl font-bold text-red-400 italic mb-4">
            "{t('reportSuccess.quote.text')}"
          </blockquote>
          <cite className="text-gray-400">- {t('reportSuccess.quote.author')}</cite>
        </div>
      </div>
    </div>
  );
}