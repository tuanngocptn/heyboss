'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-red-500">{t('navigation.home')}</Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                href="/directory"
                className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white text-sm md:text-base rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('navigation.directory')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 md:pt-20 px-4 md:px-6 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-2">
            {t('home.hero.titleStart')}
            <span className="text-red-500">{t('home.hero.destroying')}</span>
            {t('home.hero.titleEnd')}
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 px-2">
            {t('home.hero.subtitle')}
          </h2>
          <blockquote className="text-base sm:text-lg md:text-xl italic text-gray-400 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            "{t('home.hero.quote')}"
          </blockquote>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <button
              onClick={() => scrollToSection('problems')}
              className="px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('home.hero.showTruth')}
            </button>
            <button
              onClick={() => scrollToSection('problems')}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white text-base md:text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              {t('home.hero.needHelp')}
            </button>
          </div>
        </div>
      </section>

      {/* Problem Identification Section */}
      <section id="problems" className="px-4 md:px-6 py-12 md:py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 px-2">
            {t('home.problems.title')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {t.raw('home.problems.items').map((item: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 md:p-0">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-red-600 rounded flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white text-xs md:text-sm">✓</span>
                </div>
                <p className="text-base md:text-lg leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Consequences Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.health.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.raw('home.health.symptoms').map((item: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-600 rounded flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white text-sm">⚠</span>
                </div>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution & Strategy Section */}
      <section className="px-6 py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.solutions.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Psychological Armor */}
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">{t('home.solutions.psychological.title')}</h3>
              <ul className="space-y-4">
                <li><strong>{t('home.solutions.psychological.grayRock')}</strong></li>
                <li><strong>{t('home.solutions.psychological.detachment')}</strong></li>
                <li><strong>{t('home.solutions.psychological.boundaries')}</strong></li>
              </ul>
            </div>

            {/* Power Reversal */}
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-400">{t('home.solutions.power.title')}</h3>
              <ul className="space-y-4">
                <li><strong>{t('home.solutions.power.documentation')}</strong></li>
                <li><strong>{t('home.solutions.power.communication')}</strong></li>
                <li><strong>{t('home.solutions.power.alliances')}</strong></li>
              </ul>
            </div>

            {/* Exit Strategy */}
            <div className="bg-gray-900 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">{t('home.solutions.exit.title')}</h3>
              <ul className="space-y-4">
                <li><strong>{t('home.solutions.exit.jobSearch')}</strong></li>
                <li><strong>{t('home.solutions.exit.interviews')}</strong></li>
                <li><strong>{t('home.solutions.exit.hrCase')}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            {t('home.urgency.title')}
          </h2>
          <div className="space-y-6 mb-12">
            {t.raw('home.urgency.reasons').map((item: string, index: number) => (
              <p key={index} className="text-xl text-red-400 font-semibold">{item}</p>
            ))}
          </div>
          <button
            onClick={() => scrollToSection('social-proof')}
            className="px-12 py-6 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('home.urgency.cta')}
          </button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="social-proof" className="px-6 py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.socialProof.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">67%</div>
              <p className="text-lg">{t('home.socialProof.stat1')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-500 mb-2">89%</div>
              <p className="text-lg">{t('home.socialProof.stat2')}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-2">76%</div>
              <p className="text-lg">{t('home.socialProof.stat3')}</p>
            </div>
          </div>
          <blockquote className="text-xl italic text-center text-gray-300 max-w-4xl mx-auto">
            "{t('home.socialProof.testimonial')}"
            <footer className="text-lg text-gray-400 mt-4">- {t('home.socialProof.attribution')}</footer>
          </blockquote>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            {t('home.finalCta.description')}
          </p>
          <Link
            href="/directory"
            className="inline-block px-12 py-6 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('home.finalCta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}