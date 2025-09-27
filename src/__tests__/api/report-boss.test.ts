import { NextRequest } from "next/server";
import { POST } from "@/app/api/report-boss/route";
import { prisma } from "@/lib/db";

type FormDataValue = string | File;

// Mock file system operations only
jest.mock("fs/promises", () => ({
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));

// Mock fetch globally for Telegram API
global.fetch = jest.fn();

describe("/api/report-boss", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Clean up test data before each test
    await prisma.toxicBoss.deleteMany({
      where: {
        bossName: {
          contains: 'test'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await prisma.toxicBoss.deleteMany({
      where: {
        bossName: {
          contains: 'test'
        }
      }
    });
    await prisma.$disconnect();
  });

  const createMockRequest = (formData: Record<string, FormDataValue>) => {
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

  const mockReportData = {
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

  describe("Environment-based Turnstile verification", () => {
    describe("Report submission", () => {
      it("should successfully submit a report without PDF and save to database", async () => {
        const request = createMockRequest({
          reportData: JSON.stringify(mockReportData),
          turnstileToken: "",
        });

        // Mock successful Telegram response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('{"ok":true}'),
        });

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.files.markdown).toContain("test_boss_toxic_");
        expect(result.files.pdf).toBe(null);
        expect(result.files.zip).toContain("test_boss_toxic_");

        // Verify data was actually saved to database
        const savedReport = await prisma.toxicBoss.findFirst({
          where: {
            bossName: mockReportData.bossName,
          },
        });

        expect(savedReport).toBeTruthy();
        expect(savedReport?.bossName).toBe(mockReportData.bossName);
        expect(savedReport?.bossCompany).toBe(mockReportData.bossCompany);
        expect(savedReport?.reportContent).toBe(mockReportData.reportContent);
        expect(savedReport?.categories).toEqual(["Verbal Abuse", "Micromanagement"]);
        expect(savedReport?.verified).toBe(false);
        expect(savedReport?.published).toBe(false);
      });

      it("should successfully submit a report with PDF and save to database", async () => {
        const pdfFile = new File(["fake pdf content"], "evidence.pdf", {
          type: "application/pdf",
        });

        const testReportDataWithPdf = {
          ...mockReportData,
          bossName: "Test Boss With PDF",
        };

        const request = createMockRequest({
          reportData: JSON.stringify(testReportDataWithPdf),
          pdfFile,
          turnstileToken: "",
        });

        // Mock successful Telegram response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve('{"ok":true}'),
        });

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.files.pdf).toContain("test_boss_with_pdf_");

        // Verify data was actually saved to database with PDF path
        const savedReport = await prisma.toxicBoss.findFirst({
          where: {
            bossName: testReportDataWithPdf.bossName,
          },
        });

        expect(savedReport).toBeTruthy();
        expect(savedReport?.bossName).toBe(testReportDataWithPdf.bossName);
        expect(savedReport?.pdfPath).toContain("/reports/");
        expect(savedReport?.pdfPath).toContain(".pdf");
      });

      it("should return error for missing report data", async () => {
        const request = createMockRequest({
          turnstileToken: "",
        });

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(400);
        expect(result.error).toBe("Missing report data");
      });
    });
  });
});
