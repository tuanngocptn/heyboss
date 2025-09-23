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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-red-500">{t('navigation.home')}</Link>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href="/directory"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('navigation.directory')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t.rich('home.hero.title', {
              destroying: (chunks) => <span className="text-red-500">{chunks}</span>
            })}
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-8">
            {t('home.hero.subtitle')}
          </h2>
          <blockquote className="text-lg md:text-xl italic text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            "{t('home.hero.quote')}"
          </blockquote>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('problems')}
              className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('home.hero.showTruth')}
            </button>
            <button
              onClick={() => scrollToSection('problems')}
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              {t('home.hero.needHelp')}
            </button>
          </div>
        </div>
      </section>

      {/* Problem Identification Section */}
      <section id="problems" className="px-6 py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('home.problems.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.raw('home.problems.items').map((item: string, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-600 rounded flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-lg">{item}</p>
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