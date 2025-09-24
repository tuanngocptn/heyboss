'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';

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
              className="px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              {t('home.hero.showTruth')}
            </button>
            <button
              onClick={() => scrollToSection('problems')}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white text-base md:text-lg font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors cursor-pointer"
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
      <section className="relative px-4 md:px-6 py-16 md:py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, #ef4444 1px, transparent 1px), linear-gradient(-45deg, #ef4444 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {t('home.urgency.title')}
              </span>
            </h2>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Urgency Points */}
          <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
            {t.raw('home.urgency.reasons').map((item: string, index: number) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-r from-transparent via-red-900/20 to-transparent p-6 md:p-8 rounded-2xl border border-red-500/20 backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:border-red-500/40">
                  <p className="text-lg sm:text-xl md:text-2xl text-red-400 font-bold leading-relaxed group-hover:text-red-300 transition-colors duration-300">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="relative">
            <button
              onClick={() => scrollToSection('social-proof')}
              className="group relative px-8 md:px-16 py-4 md:py-6 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-lg md:text-xl font-black rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 cursor-pointer overflow-hidden"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button Content */}
              <span className="relative z-10 tracking-wider">
                {t('home.urgency.cta')}
              </span>

              {/* Shine Effect */}
              <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>

            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </div>
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
          <div className="max-w-4xl mx-auto">
            <blockquote className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-600/30">
              {/* Large Quote Mark */}
              <div className="absolute -top-6 -left-6 text-6xl md:text-8xl text-red-500/20 font-serif leading-none">"</div>

              {/* Quote Content */}
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium text-left relative z-10 mb-6">
                {t('home.socialProof.testimonial')}
              </p>

              {/* Attribution */}
              <footer className="flex justify-end">
                <div className="text-right">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500 mb-3 ml-auto"></div>
                  <cite className="text-base md:text-lg text-gray-300 not-italic font-semibold block">
                    {t('home.socialProof.attribution')}
                  </cite>
                </div>
              </footer>

              {/* Decorative Corner Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rotate-45 opacity-60"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-red-400 rotate-45 opacity-40"></div>
            </blockquote>
          </div>
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

      <Footer />
    </div>
  );
}