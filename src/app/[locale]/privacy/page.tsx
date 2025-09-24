'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-red-500">{t('navigation.home')}</Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                href="/"
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-600 text-white text-sm md:text-base rounded-lg hover:bg-gray-800 transition-colors"
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
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            {t('privacy.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {t('privacy.subtitle')}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            {t('privacy.intro')}
          </p>
        </div>

        {/* Data Collection Section */}
        <section className="mb-12 bg-gray-800 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-red-400">
            {t('privacy.dataCollection.title')}
          </h2>
          <p className="text-gray-400 mb-6 italic">
            {t('privacy.dataCollection.subtitle')}
          </p>
          <ul className="space-y-3">
            {t.raw('privacy.dataCollection.items').map((item: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Data Use Section */}
        <section className="mb-12 bg-gray-800 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-green-400">
            {t('privacy.dataUse.title')}
          </h2>
          <p className="text-gray-400 mb-6 italic">
            {t('privacy.dataUse.subtitle')}
          </p>
          <ul className="space-y-3">
            {t.raw('privacy.dataUse.items').map((item: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Data Protection Section */}
        <section className="mb-12 bg-gray-800 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-400">
            {t('privacy.dataProtection.title')}
          </h2>
          <p className="text-gray-400 mb-6 italic">
            {t('privacy.dataProtection.subtitle')}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t('privacy.dataProtection.content')}
          </p>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Your Privacy?
          </h3>
          <p className="text-gray-300 mb-6">
            Unlike your boss, we're happy to explain our policies clearly.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}