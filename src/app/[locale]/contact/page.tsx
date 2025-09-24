'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

export default function ContactPage() {
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
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            {t('contact.intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Reasons to Contact */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-red-400">
              {t('contact.reasons.title')}
            </h2>
            <ul className="space-y-4">
              {t.raw('contact.reasons.items').map((item: string, index: number) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0">{item.split(' ')[0]}</span>
                  <p className="text-gray-300 leading-relaxed mt-1">
                    {item.split(' ').slice(1).join(' ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            {/* Email */}
            <div className="bg-gray-800 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 text-green-400">
                {t('contact.methods.email.title')}
              </h3>
              <div className="mb-4">
                <a
                  href={`mailto:${t('contact.methods.email.address')}`}
                  className="text-red-400 hover:text-red-300 text-lg font-mono break-all"
                >
                  {t('contact.methods.email.address')}
                </a>
              </div>
              <p className="text-gray-400 text-sm italic">
                {t('contact.methods.email.note')}
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-gray-800 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4 text-blue-400">
                {t('contact.methods.response.title')}
              </h3>
              <p className="text-gray-300">
                {t('contact.methods.response.content')}
              </p>
            </div>
          </div>
        </div>

        {/* Communication Tips */}
        <section className="mt-12 bg-gray-800 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-purple-400">
            {t('contact.tips.title')}
          </h2>
          <p className="text-gray-400 mb-6 italic">
            {t('contact.tips.subtitle')}
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            {t.raw('contact.tips.items').map((item: string, index: number) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Share Your Boss Horror Story?
          </h3>
          <p className="text-gray-300 mb-6">
            Help others identify toxic behavior patterns and build our database of workplace villains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${t('contact.methods.email.address')}?subject=Boss Horror Story`}
              className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Email Us Now
            </a>
            <Link
              href="/directory"
              className="px-8 py-4 border-2 border-red-600 text-red-400 text-lg font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              Browse Boss Directory
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}