'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useState } from "react";

const mockBossData = [
  {
    id: 'john-doe-acme',
    name: 'John Doe',
    company: 'Acme Corp',
    rating: 1,
    summary: 'Known for taking credit for team ideas and creating impossible deadlines.'
  },
  {
    id: 'sarah-wilson-tech-solutions',
    name: 'Sarah Wilson',
    company: 'Tech Solutions Inc',
    rating: 2,
    summary: 'Micromanages every detail while blaming staff for lack of initiative.'
  },
  {
    id: 'mike-johnson-global-systems',
    name: 'Mike Johnson',
    company: 'Global Systems LLC',
    rating: 1,
    summary: 'Publicly humiliates employees and constantly changes project requirements.'
  },
  {
    id: 'jennifer-smith-innovate-co',
    name: 'Jennifer Smith',
    company: 'Innovate Co',
    rating: 2,
    summary: 'Dismisses concerns and excludes team members from important decisions.'
  },
  {
    id: 'david-brown-future-tech',
    name: 'David Brown',
    company: 'Future Tech',
    rating: 1,
    summary: 'Creates hostile work environment through constant criticism and unrealistic expectations.'
  },
  {
    id: 'lisa-davis-enterprise-solutions',
    name: 'Lisa Davis',
    company: 'Enterprise Solutions',
    rating: 2,
    summary: 'Takes credit for successes while shifting blame for failures to subordinates.'
  }
];

const StarRating = ({ rating, t }: { rating: number, t: (key: string) => string }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-500' : 'text-gray-400'
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded-full font-semibold">
        {t('directory.toxic')}
      </span>
    </div>
  );
};

export default function Directory() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBosses, setFilteredBosses] = useState(mockBossData);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredBosses(mockBossData);
    } else {
      const filtered = mockBossData.filter(
        (boss) =>
          boss.name.toLowerCase().includes(term.toLowerCase()) ||
          boss.company.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBosses(filtered);
    }
  };

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

      {/* Header Section */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
            {t('directory.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
            {t('directory.description')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-12 px-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t('directory.search')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 md:px-6 py-3 md:py-4 text-base md:text-lg bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Profiles */}
      <section className="px-4 md:px-6 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8 px-2">
            <p className="text-sm md:text-base text-gray-300">
              {filteredBosses.length === 1
                ? t('directory.results', {count: filteredBosses.length})
                : t('directory.resultsPlural', {count: filteredBosses.length})
              }
              {searchTerm && ` ${t('directory.searchFor', {term: searchTerm})}`}
            </p>
          </div>

          {filteredBosses.length === 0 ? (
            <div className="text-center py-8 md:py-12 px-4">
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{t('directory.noResults.title')}</h2>
              <p className="text-gray-400 text-sm md:text-base">
                {t('directory.noResults.description')}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBosses.map((boss) => (
                <div
                  key={boss.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 hover:bg-gray-750 transition-colors"
                >
                  {/* Boss Info */}
                  <div className="mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{boss.name}</h3>
                    <p className="text-gray-300 text-base md:text-lg mb-2 md:mb-3">{boss.company}</p>
                    <StarRating rating={boss.rating} t={t} />
                  </div>

                  {/* Summary */}
                  <div className="mb-4 md:mb-6">
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base">{boss.summary}</p>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={{
                      pathname: '/boss/[id]',
                      params: { id: boss.id }
                    }}
                    className="block w-full text-center px-3 md:px-4 py-2 md:py-3 bg-red-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('directory.viewDetails')}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Report Section */}
      <section className="px-6 py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('directory.reportSection.title')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('directory.reportSection.description')}
          </p>
          <button className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors">
            {t('directory.reportSection.button')}
          </button>
        </div>
      </section>
    </div>
  );
}