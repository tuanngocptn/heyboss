import { jest } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock R2 upload functions
export const mockR2Functions = () => {
  jest.mock("@/lib/r2", () => ({
    uploadToR2: jest.fn(),
    generateFileName: jest.fn(),
  }));
};

// Mock global fetch for API calls
export const mockGlobalFetch = () => {
  global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
};

// Setup R2 mocks with default implementations
export const setupR2Mocks = async () => {
  const r2Module = await import("@/lib/r2");

  (r2Module.generateFileName as jest.MockedFunction<typeof r2Module.generateFileName>).mockImplementation((name: string, ext: string) => {
    // Generate a mock timestamp in YYMMDDHHSS format (like the real function)
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:T]/g, '')
      .replace(/\.\d{3}Z$/, '')
      .slice(2, 12); // YYMMDDHHSS format

    const sanitized = name.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').replace(/^-|-$/g, '');
    return `${timestamp}-${sanitized}.${ext}`;
  });

  (r2Module.uploadToR2 as jest.MockedFunction<typeof r2Module.uploadToR2>).mockImplementation((filename: string) => {
    return Promise.resolve(`static-dev.heyboss.wtf/${filename}`);
  });
};

// Setup successful Telegram API mock response
export const mockTelegramSuccess = () => {
  (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: true,
    text: () => Promise.resolve('{"ok":true}'),
  } as Response);
};

// Setup failed Telegram API mock response
export const mockTelegramFailure = (errorMessage: string = 'API Error') => {
  (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
    ok: false,
    text: () => Promise.resolve(errorMessage),
  } as Response);
};

// Clear all mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
};

// Mock FormData type for testing
export type FormDataValue = string | File;

// Helper to create mock NextRequest with FormData
export const createMockRequest = (formData: Record<string, FormDataValue>) => {
  const mockFormData = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof File) {
      mockFormData.append(key, value);
    } else {
      mockFormData.append(key, value);
    }
  });

  return {
    formData: () => Promise.resolve(mockFormData),
  } as NextRequest;
};

// Common test data
export const mockReportData = {
  bossName: "Test Boss Toxic",
  bossCompany: "Test Evil Corp",
  bossPosition: "Test Manager",
  bossDepartment: "Test IT",
  bossAge: "45",
  workLocation: "Test New York",
  reporterEmail: "test-reporter@example.com",
  reportContent: "This test boss is very toxic and abusive",
  categories: "Verbal Abuse, Micromanagement",
  submissionDate: new Date().toISOString(),
};

// Create mock PDF file for testing
export const createMockPdfFile = (filename: string = "evidence.pdf") => {
  return new File(["fake pdf content"], filename, {
    type: "application/pdf",
  });
};