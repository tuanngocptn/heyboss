'use client';
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import Turnstile from '@/components/Turnstile';
import { useState } from 'react';

interface TutorialStep {
  title: string;
  content: string;
}

export default function ReportPage() {
  const t = useTranslations();
  const router = useRouter();

  // Form state
  const [reporterEmail, setReporterEmail] = useState('');
  const [bossName, setBossName] = useState('');
  const [bossCompany, setBossCompany] = useState('');
  const [bossPosition, setBossPosition] = useState('');
  const [bossDepartment, setBossDepartment] = useState('');
  const [bossAge, setBossAge] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Environment check
  const isProduction = process.env.NODE_ENV === 'production';
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle category checkbox changes
  const handleCategoryChange = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle PDF file upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Please upload a PDF file only');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!bossName.trim()) {
      alert(t('report.form.bossNameRequired'));
      return;
    }

    if (!reportContent.trim()) {
      alert(t('report.form.reportContentRequired'));
      return;
    }

    // Validate Turnstile (skip in development)
    if (isProduction && !turnstileToken) {
      alert(t('report.form.captchaError'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add form fields
      const reportData = {
        reporterEmail: reporterEmail || 'Anonymous',
        bossName: bossName.trim(),
        bossCompany: bossCompany.trim() || 'Not specified',
        bossPosition: bossPosition.trim() || 'Not specified',
        bossDepartment: bossDepartment.trim() || 'Not specified',
        bossAge: bossAge.trim() || 'Not specified',
        workLocation: workLocation.trim() || 'Not specified',
        reportContent: reportContent.trim(),
        categories: categories.join(', ') || 'Not specified',
        submissionDate: new Date().toISOString(),
      };

      formData.append('reportData', JSON.stringify(reportData));
      formData.append('turnstileToken', turnstileToken);

      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }

      // Submit to API endpoint
      const response = await fetch('/api/report-boss', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to success page instead of showing inline message
        router.push('/report/success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-red-400">
            {t('report.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
            {t('report.subtitle')}
          </p>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            {t('report.intro')}
          </p>
        </div>

        {/* Tutorial Section */}
        <div className="mb-12 md:mb-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-6 md:p-8 border border-gray-600/30">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-yellow-400">
            {t('report.tutorial.title')}
          </h2>
          <p className="text-gray-300 mb-8 italic">
            {t('report.tutorial.subtitle')}
          </p>

          <div className="space-y-6">
            {t.raw('report.tutorial.steps').map((step: TutorialStep, index: number) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/20">
                <h3 className="text-lg font-semibold mb-3 text-green-400">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-8 bg-green-900/30 border border-green-500/50 rounded-lg p-6">
            <h3 className="text-green-400 font-semibold text-lg mb-2">
              {t('report.form.success')}
            </h3>
            <p className="text-green-300">
              {t('report.form.successMessage')}
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-8 bg-red-900/30 border border-red-500/50 rounded-lg p-6">
            <h3 className="text-red-400 font-semibold text-lg mb-2">
              Error
            </h3>
            <p className="text-red-300">
              {t('report.form.error')}
            </p>
          </div>
        )}

        {/* Report Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Reporter Information */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-blue-400">
              {t('report.form.personalInfo')}
            </h3>

            <div>
              <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-300 mb-2">
                {t('report.form.reporterEmail')}
              </label>
              <input
                type="email"
                id="reporterEmail"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder={t('report.form.reporterEmailPlaceholder')}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              />
              <p className="text-sm text-gray-400 mt-2">
                {t('report.form.reporterEmailHelp')}
              </p>
            </div>
          </div>

          {/* Boss Information */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-red-400">
              {t('report.form.bossInfo')}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bossName" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossName')} *
                </label>
                <input
                  type="text"
                  id="bossName"
                  required
                  value={bossName}
                  onChange={(e) => setBossName(e.target.value)}
                  placeholder={t('report.form.bossNamePlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossCompany" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossCompany')}
                </label>
                <input
                  type="text"
                  id="bossCompany"
                  value={bossCompany}
                  onChange={(e) => setBossCompany(e.target.value)}
                  placeholder={t('report.form.bossCompanyPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossPosition" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossPosition')}
                </label>
                <input
                  type="text"
                  id="bossPosition"
                  value={bossPosition}
                  onChange={(e) => setBossPosition(e.target.value)}
                  placeholder={t('report.form.bossPositionPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossDepartment" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossDepartment')}
                </label>
                <input
                  type="text"
                  id="bossDepartment"
                  value={bossDepartment}
                  onChange={(e) => setBossDepartment(e.target.value)}
                  placeholder={t('report.form.bossDepartmentPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossAge" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossAge')}
                </label>
                <input
                  type="text"
                  id="bossAge"
                  value={bossAge}
                  onChange={(e) => setBossAge(e.target.value)}
                  placeholder="45-50"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
                <p className="text-sm text-gray-400 mt-2">
                  {t('report.form.bossAgeHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="workLocation" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.workLocation')}
                </label>
                <input
                  type="text"
                  id="workLocation"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder={t('report.form.workLocationPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-purple-400">
              {t('report.form.evidenceSection')}
            </h3>

            <div>
              <label htmlFor="pdfUpload" className="block text-sm font-medium text-gray-300 mb-2">
                {t('report.form.uploadPdf')}
              </label>
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer cursor-pointer"
              />
              <p className="text-sm text-gray-400 mt-2">
                {t('report.form.uploadPdfHelp')}
              </p>
              {pdfFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ File uploaded: {pdfFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-yellow-400">
              {t('report.form.categories')}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {t.raw('report.form.categoryOptions').map((category: string, index: number) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/50 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-5 h-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-gray-300">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Details */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-green-400">
              {t('report.form.reportDetails')}
            </h3>

            <div>
              <label htmlFor="reportContent" className="block text-sm font-medium text-gray-300 mb-2">
                {t('report.form.reportContent')} *
              </label>
              <textarea
                id="reportContent"
                required
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder={t('report.form.reportContentPlaceholder')}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none resize-vertical"
              />
            </div>
          </div>

          {/* Security Verification */}
          <div className="bg-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-6 text-orange-400">
              {t('report.form.captcha')}
            </h3>

            <div>
              <p className="text-sm text-gray-300 mb-4">
                {t('report.form.captchaDescription')}
              </p>
              {isProduction && (
                <div className="flex justify-center">
                  <Turnstile
                    onVerify={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                    theme="dark"
                    size="normal"
                  />
                </div>
              )}
              {!isProduction && (
                <div className="text-center text-gray-400 text-sm">
                  <p>🛠️ Development Mode: Turnstile verification disabled</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
            >
              {isSubmitting ? t('report.form.submitting') : t('report.form.submit')}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}