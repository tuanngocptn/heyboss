'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useState, useEffect, useCallback } from "react";
import { getBaseUrl } from '@/lib/env';

interface ToxicBoss {
  id: string;
  bossName: string;
  bossCompany: string | null;
  bossPosition: string | null;
  bossDepartment: string | null;
  bornYear: number | null;
  workLocation: string | null;
  categories: string[];
  submissionDate: string;
  verified: boolean;
  published: boolean;
  locked: boolean;
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ToxicBoss[];
  pagination: PaginationData;
  filters: {
    search: string;
    company: string;
    location: string;
    verified: boolean | null;
    published: boolean | null;
  };
}

const StarRating = ({ categories, t }: { categories: string[], t: (key: string) => string }) => {
  // Calculate toxicity level based on number of categories (1-5 skulls)
  const toxicityLevel = Math.min(Math.max(categories.length, 1), 5);

  return (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map((skull) => (
        <span
          key={skull}
          className={`text-4xl leading-none flex items-center justify-center ${
            skull <= toxicityLevel ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          ☠︎︎
        </span>
      ))}
      <span className="ml-2 px-3 py-1 bg-red-600 text-white text-sm rounded-full font-semibold">
        {t('directory.toxic')}
      </span>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

const Pagination = ({ pagination, onPageChange, t }: {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5; // Show max 5 page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          hasPreviousPage
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {t('directory.pagination.previous')}
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            pageNum === currentPage
              ? 'bg-red-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          hasNextPage
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {t('directory.pagination.next')}
      </button>
    </div>
  );
};

export default function Directory() {
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [bosses, setBosses] = useState<ToxicBoss[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed filters state since we're only showing published AND verified records

  const fetchBosses = useCallback(async (page: number = 1, search: string = '', resetPage: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: resetPage ? '1' : page.toString(),
        limit: '21',
        ...(search && { search }),
      });

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/toxic-bosses?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bosses');
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setBosses(data.data);
        setPagination(data.pagination);
        if (resetPage) {
          setCurrentPage(1);
        }
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBosses([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBosses(1, searchTerm);
  }, [fetchBosses, searchTerm]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBosses(1, searchTerm, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchBosses, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBosses(page, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const generateBossId = (boss: ToxicBoss): string => {
    return `${boss.bossName.toLowerCase().replace(/\s+/g, '-')}-${boss.bossCompany?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`.replace(/[^a-z0-9-]/g, '');
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {/* Results Count */}
          {pagination && (
            <div className="mb-6 md:mb-8 px-2">
              <p className="text-sm md:text-base text-gray-300">
                {t('directory.resultsCount', {
                  start: (pagination.currentPage - 1) * pagination.limit + 1,
                  end: Math.min(pagination.currentPage * pagination.limit, pagination.totalCount),
                  total: pagination.totalCount
                })}
                {searchTerm && ` ${t('directory.searchFor', {term: searchTerm})}`}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 md:py-12 px-4">
              <div className="text-4xl md:text-6xl mb-4">⚠️</div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{t('directory.error.title')}</h2>
              <p className="text-gray-400 text-sm md:text-base mb-4">
                {error}
              </p>
              <button
                onClick={() => fetchBosses(currentPage, searchTerm)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('directory.error.retry')}
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && bosses.length === 0 && (
            <div className="text-center py-8 md:py-12 px-4">
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{t('directory.noResults.title')}</h2>
              <p className="text-gray-400 text-sm md:text-base">
                {t('directory.noResults.description')}
              </p>
            </div>
          )}

          {/* Boss Cards */}
          {!loading && !error && bosses.length > 0 && (
            <>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bosses.map((boss) => (
                  <div
                    key={boss.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 hover:bg-gray-750 transition-colors"
                  >
                    {/* Boss Info */}
                    <div className="mb-3 md:mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{boss.bossName}</h3>
                      {boss.bossCompany && (
                        <p className="text-gray-300 text-base md:text-lg mb-2">{boss.bossCompany}</p>
                      )}
                      {boss.bossPosition && (
                        <p className="text-gray-400 text-sm mb-2">{boss.bossPosition}</p>
                      )}
                      {boss.workLocation && (
                        <p className="text-gray-400 text-sm mb-3">📍 {boss.workLocation}</p>
                      )}
                      <StarRating categories={boss.categories} t={t} />
                    </div>

                    {/* Categories */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {boss.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {boss.categories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                            +{boss.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mb-4 text-xs text-gray-500">
                      <p>Reported: {formatDate(boss.submissionDate)}</p>
                      {boss.verified && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-900/50 text-green-300 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <Link
                      href={{
                        pathname: '/boss/[id]',
                        params: { id: generateBossId(boss) }
                      }}
                      className="block w-full text-center px-3 md:px-4 py-2 md:py-3 bg-red-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('directory.viewDetails')}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  t={t}
                />
              )}
            </>
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
          <Link
            href="/report"
            className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            {t('directory.reportSection.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}