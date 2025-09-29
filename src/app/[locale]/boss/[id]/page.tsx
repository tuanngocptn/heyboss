'use client';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { getBaseUrl } from '@/lib/env';
import { marked } from 'marked';
import WalineComments from '@/components/WalineComments';

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
  pdfPath?: string | null;
  markdownPath?: string | null;
}

interface BossApiResponse {
  success: boolean;
  data: ToxicBoss;
}

interface MarkdownApiResponse {
  success: boolean;
  content: string;
  filename: string;
  fallback?: boolean;
}

interface PdfApiResponse {
  success: boolean;
  pdfUrl: string;
  filename: string;
  bossName: string;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

const StarRating = ({ categories, t }: { categories: string[], t: (key: string) => string }) => {
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

const CategoryTag = ({ category }: { category: string }) => {
  return (
    <span className="px-3 py-1 bg-red-900/50 text-red-300 text-sm rounded-full">
      {category}
    </span>
  );
};

export default function BossProfile({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations();
  const resolvedParams = use(params);
  const [boss, setBoss] = useState<ToxicBoss | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const fetchMarkdownContent = useCallback(async () => {
    try {
      setLoadingMarkdown(true);
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/boss/${resolvedParams.id}/markdown`);

      if (response.ok) {
        const data: MarkdownApiResponse = await response.json();
        if (data.success) {
          setMarkdownContent(data.content);
        }
      }
    } catch (err) {
      console.error('Error loading markdown content:', err);
    } finally {
      setLoadingMarkdown(false);
    }
  }, [resolvedParams.id]);

  const fetchPdfData = useCallback(async () => {
    try {
      setLoadingPdf(true);
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/boss/${resolvedParams.id}/pdf`);

      if (response.ok) {
        const data: PdfApiResponse = await response.json();
        if (data.success) {
          // Use the proxy endpoint to avoid CORS issues
          setPdfUrl(`${baseUrl}/api/boss/${resolvedParams.id}/pdf-content`);
        }
      }
    } catch (err) {
      console.error('Error loading PDF:', err);
    } finally {
      setLoadingPdf(false);
    }
  }, [resolvedParams.id]);

  const fetchBossData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/boss/${resolvedParams.id}`);

      if (!response.ok) {
        throw new Error('Boss not found');
      }

      const data: BossApiResponse = await response.json();

      if (data.success) {
        setBoss(data.data);
        // Auto-load markdown and PDF after boss data is loaded
        fetchMarkdownContent();
        fetchPdfData();
      } else {
        throw new Error('Failed to load boss data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, fetchMarkdownContent, fetchPdfData]);

  useEffect(() => {
    fetchBossData();
  }, [fetchBossData]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !boss) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{t('boss.notFound.title')}</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/directory" className="text-red-500 hover:underline">
            {t('boss.notFound.backLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-lg md:text-xl font-bold text-red-500">{t('navigation.home')}</Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link
                href="/directory"
                className="px-3 py-2 md:px-4 md:py-2 border border-gray-600 text-white text-sm md:text-base rounded-lg hover:bg-gray-800 transition-colors"
              >
                {t('navigation.backToDirectory')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="px-4 md:px-6 py-8 md:py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{boss.bossName}</h1>
              {boss.bossPosition && (
                <p className="text-lg md:text-xl text-gray-300 mb-2">{boss.bossPosition}</p>
              )}
              {boss.bossCompany && (
                <p className="text-base md:text-lg text-gray-400 mb-2">{boss.bossCompany}</p>
              )}
              {boss.workLocation && (
                <p className="text-sm text-gray-500 mb-4">📍 {boss.workLocation}</p>
              )}
              <StarRating categories={boss.categories} t={t} />
            </div>
            <div className="text-center lg:text-right w-full lg:w-auto">
              <div className="text-lg text-gray-400 mb-2">Reported: {formatDate(boss.submissionDate)}</div>
              {boss.verified && (
                <span className="inline-block mb-4 px-3 py-1 bg-green-900/50 text-green-300 text-sm rounded-full">
                  ✓ Verified
                </span>
              )}
              <div className="mt-4">
                <Link
                  href="/report"
                  className="inline-block w-full lg:w-auto px-4 md:px-6 py-2 md:py-3 bg-red-600 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-center"
                >
                  {t('boss.reportButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Information Section */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('boss.reportedIssues')}</h2>

          {/* Categories */}
          <div className="mb-8 md:mb-12">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-200">{t('boss.issueCategories')}</h3>
            <div className="flex flex-wrap gap-2">
              {boss.categories.map((category, index) => (
                <CategoryTag key={index} category={category} />
              ))}
            </div>
          </div>

          {/* Full Report Content */}
          {loadingMarkdown ? (
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-gray-200 mb-4">Loading Full Report...</h3>
              <LoadingSpinner />
            </div>
          ) : markdownContent ? (
            <div className="mb-8 md:mb-12">
              <h3 className="text-lg md:text-xl font-semibold text-gray-200 mb-4">Full Report</h3>
              <div className="bg-gray-800 rounded-lg p-6">
                <div
                  className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Supporting Documents Section */}
      <section className="px-4 md:px-6 py-8 md:py-12 bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('boss.supportingDocs.title')}</h2>
          <div className="bg-gray-900 rounded-lg p-4 md:p-6">
            {loadingPdf ? (
              <div className="flex items-center justify-center h-64 md:h-96">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="text-gray-400 mt-4">Loading PDF document...</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="w-full">
                {/* PDF Viewer - Desktop iframe, Mobile-friendly fallback */}
                <div className="hidden md:block">
                  <div className="bg-white rounded-lg p-4">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[600px] border-0"
                      title="PDF Document"
                    />
                  </div>
                </div>

                {/* Mobile-friendly PDF viewer */}
                <div className="block md:hidden">
                  <div className="bg-gray-700 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold mb-4 text-white">PDF Document Available</h3>
                    <p className="text-gray-300 mb-6">
                      For the best viewing experience on mobile, please open the PDF in your device's PDF viewer.
                    </p>
                    <div className="space-y-3">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        📱 Open PDF in App
                      </a>
                      <a
                        href={pdfUrl}
                        download
                        className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        💾 Download PDF
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop download option */}
                <div className="mt-4 text-center">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                  >
                    Open in New Tab
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 md:h-96 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl mb-4 text-gray-500">📄</div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-500">No Supporting Documents</h3>
                  <p className="text-sm md:text-base text-gray-500">
                    No PDF evidence file available for this report
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{t('boss.comments.title')}</h2>
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <WalineComments
              path={`/boss/${resolvedParams.id}`}
              serverURL={process.env.NEXT_PUBLIC_WALINE_URL || 'http://localhost:8360'}
            />
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="px-4 md:px-6 py-12 md:py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('boss.help.title')}</h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed">
            {t('boss.help.description')}
          </p>
          <Link
            href="/"
            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-red-600 text-white text-base md:text-lg font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('boss.help.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}