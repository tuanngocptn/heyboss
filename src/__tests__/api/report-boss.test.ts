import { POST } from "@/app/api/report-boss/route";
import { prisma } from "@/lib/db";
import {
  mockR2Functions,
  mockGlobalFetch,
  setupR2Mocks,
  mockTelegramSuccess,
  clearAllMocks,
  createMockRequest,
  mockReportData,
  createMockPdfFile
} from "../common/mock";

// Mock R2 upload functions
mockR2Functions();

// Mock fetch globally for Telegram API
mockGlobalFetch();

describe("/api/report-boss", () => {
  beforeEach(async () => {
    clearAllMocks();

    // Setup R2 functions
    await setupR2Mocks();

    // Clean up test data before each test
    await prisma.toxicBoss.deleteMany({
      where: {
        bossName: {
          contains: 'Test'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await prisma.toxicBoss.deleteMany({
      where: {
        bossName: {
          contains: 'Test'
        }
      }
    });
    await prisma.$disconnect();
  });


  describe("Environment-based Turnstile verification", () => {
    describe("Report submission", () => {
      it("should successfully submit a report without PDF and save to database", async () => {
        const request = createMockRequest({
          reportData: JSON.stringify(mockReportData),
          turnstileToken: "",
        });

        // Mock successful Telegram response
        mockTelegramSuccess();

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.files.markdown).toMatch(/^\d{10}-test-boss-toxic\.md$/);
        expect(result.files.pdf).toBe(null);
        expect(result.files.markdownUrl).toMatch(/^static-dev\.heyboss\.wtf\/\d{10}-test-boss-toxic\.md$/);
        expect(result.files.pdfUrl).toBe(null);

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
        // Database should store URI (filename) not full URL
        expect(savedReport?.markdownPath).toMatch(/^\d{10}-test-boss-toxic\.md$/);
        expect(savedReport?.pdfPath).toBe(null);
        expect(savedReport?.verified).toBe(false);
        expect(savedReport?.published).toBe(false);
      });

      it("should successfully submit a report with PDF and save to database", async () => {
        const pdfFile = createMockPdfFile();

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
        mockTelegramSuccess();

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.files.pdf).toMatch(/^\d{10}-test-boss-with-pdf\.pdf$/);
        expect(result.files.markdownUrl).toMatch(/^static-dev\.heyboss\.wtf\/\d{10}-test-boss-with-pdf\.md$/);
        expect(result.files.pdfUrl).toMatch(/^static-dev\.heyboss\.wtf\/\d{10}-test-boss-with-pdf\.pdf$/);

        // Verify data was actually saved to database with PDF path
        const savedReport = await prisma.toxicBoss.findFirst({
          where: {
            bossName: testReportDataWithPdf.bossName,
          },
        });

        expect(savedReport).toBeTruthy();
        expect(savedReport?.bossName).toBe(testReportDataWithPdf.bossName);
        // Database should store URI (filename) not full URL
        expect(savedReport?.markdownPath).toMatch(/^\d{10}-test-boss-with-pdf\.md$/);
        expect(savedReport?.pdfPath).toMatch(/^\d{10}-test-boss-with-pdf\.pdf$/);
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
