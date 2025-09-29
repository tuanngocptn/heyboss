'use client';
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import Turnstile from '@/components/Turnstile';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';

const EditorJsEditor = dynamic(() => import('@/components/EditorJsEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-700 border border-gray-600 rounded-lg min-h-[300px] flex items-center justify-center">
      <div className="text-gray-400">Loading Editor.js...</div>
    </div>
  ),
});

import { EditorJsEditorRef } from '@/components/EditorJsEditor';

interface TutorialStep {
  title: string;
  content: string;
}

// Validation schema
const createFormSchema = (t: (key: string) => string) => z.object({
  reporterEmail: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: t('report.form.invalidEmail'),
  }),
  bossName: z.string().min(1, t('report.form.bossNameRequired')),
  bossCompany: z.string().optional(),
  bossPosition: z.string().optional(),
  bossDepartment: z.string().optional(),
  bornYear: z.string().optional(),
  workLocation: z.string().optional(),
  reportContent: z.string().min(10, t('report.form.reportContentRequired')),
  categories: z.array(z.string()).min(1, t('report.form.categoriesRequired')),
  pdfFile: z.instanceof(File, { message: t('report.form.pdfRequired') }),
  turnstileToken: z.string().optional(),
});

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export default function ReportPage() {
  const t = useTranslations();
  const router = useRouter();

  // Environment check
  const isProduction = process.env.NODE_ENV === 'production';
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Editor.js ref
  const editorRef = useRef<EditorJsEditorRef>(null);

  // Form schema with translations
  const formSchema = createFormSchema(t);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporterEmail: '',
      bossName: '',
      bossCompany: '',
      bossPosition: '',
      bossDepartment: '',
      bornYear: '',
      workLocation: '',
      reportContent: '',
      categories: [],
      turnstileToken: '',
    },
  });

  // Watch form values
  const watchedCategories = watch('categories');
  const watchedPdfFile = watch('pdfFile');

  // Handle category checkbox changes
  const handleCategoryChange = (category: string) => {
    const currentCategories = watchedCategories || [];
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    setValue('categories', updatedCategories);
  };

  // Handle PDF file upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setValue('pdfFile', file);
    } else if (file) {
      alert('Please upload a PDF file only');
      setValue('pdfFile', undefined as unknown as File);
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    // Validate Turnstile (skip in development)
    if (isProduction && !data.turnstileToken) {
      alert(t('report.form.captchaError'));
      return;
    }

    // Get markdown content from editor
    const markdownContent = await editorRef.current?.getMarkdown() || data.reportContent.trim();

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add form fields
      const reportData = {
        reporterEmail: data.reporterEmail || 'Anonymous',
        bossName: data.bossName.trim(),
        bossCompany: data.bossCompany?.trim() || 'Not specified',
        bossPosition: data.bossPosition?.trim() || 'Not specified',
        bossDepartment: data.bossDepartment?.trim() || 'Not specified',
        bornYear: data.bornYear?.trim() || 'Not specified',
        workLocation: data.workLocation?.trim() || 'Not specified',
        reportContent: markdownContent,
        categories: data.categories.join(', ') || 'Not specified',
        submissionDate: new Date().toISOString(),
      };

      formData.append('reportData', JSON.stringify(reportData));
      formData.append('turnstileToken', data.turnstileToken || '');
      formData.append('pdfFile', data.pdfFile);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                {...register('reporterEmail')}
                type="email"
                id="reporterEmail"
                placeholder={t('report.form.reporterEmailPlaceholder')}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                  errors.reporterEmail
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-red-500'
                }`}
              />
              {errors.reporterEmail && (
                <p className="text-sm text-red-400 mt-2">
                  ⚠ {errors.reporterEmail.message}
                </p>
              )}
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
                  {...register('bossName')}
                  type="text"
                  id="bossName"
                  placeholder={t('report.form.bossNamePlaceholder')}
                  className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                    errors.bossName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-red-500'
                  }`}
                />
                {errors.bossName && (
                  <p className="text-sm text-red-400 mt-2">
                    ⚠ {errors.bossName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="bossCompany" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossCompany')}
                </label>
                <input
                  {...register('bossCompany')}
                  type="text"
                  id="bossCompany"
                  placeholder={t('report.form.bossCompanyPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossPosition" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossPosition')}
                </label>
                <input
                  {...register('bossPosition')}
                  type="text"
                  id="bossPosition"
                  placeholder={t('report.form.bossPositionPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bossDepartment" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.bossDepartment')}
                </label>
                <input
                  {...register('bossDepartment')}
                  type="text"
                  id="bossDepartment"
                  placeholder={t('report.form.bossDepartmentPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bornYear" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.devilBornYear')}
                </label>
                <input
                  {...register('bornYear')}
                  type="number"
                  id="bornYear"
                  placeholder="1980"
                  min="1930"
                  max="2010"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
                <p className="text-sm text-gray-400 mt-2">
                  {t('report.form.devilBornYearHelp')}
                </p>
              </div>

              <div>
                <label htmlFor="workLocation" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('report.form.workLocation')}
                </label>
                <input
                  {...register('workLocation')}
                  type="text"
                  id="workLocation"
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
                {t('report.form.uploadPdf')} *
              </label>
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                onChange={handlePdfUpload}
                className={`w-full px-4 py-3 bg-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer cursor-pointer border-2 ${
                  errors.pdfFile
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-red-500'
                }`}
              />
              <p className="text-sm text-gray-400 mt-2">
                {t('report.form.uploadPdfHelp')}
              </p>
              {errors.pdfFile && (
                <p className="text-sm text-red-400 mt-2">
                  ⚠ {errors.pdfFile.message}
                </p>
              )}
              {watchedPdfFile && (
                <p className="text-sm text-green-400 mt-2">
                  ✓ File uploaded: {watchedPdfFile.name}
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
                    checked={watchedCategories?.includes(category) || false}
                    onChange={() => handleCategoryChange(category)}
                    className="w-5 h-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-gray-300">{category}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-red-400 mt-4">
                ⚠ {errors.categories.message}
              </p>
            )}
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
              <div className="space-y-2">
                <EditorJsEditor
                  ref={editorRef}
                  placeholder={t('report.form.reportContentPlaceholder')}
                  error={!!errors.reportContent}
                  onChange={(markdown) => {
                    setValue('reportContent', markdown);
                  }}
                />
                {/* Hidden input for form validation */}
                <input
                  {...register('reportContent')}
                  type="hidden"
                />
                {errors.reportContent && (
                  <p className="text-sm text-red-400 mt-2">
                    ⚠ {errors.reportContent.message}
                  </p>
                )}
              </div>
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
                    onVerify={(token) => setValue('turnstileToken', token)}
                    onError={() => setValue('turnstileToken', '')}
                    onExpire={() => setValue('turnstileToken', '')}
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