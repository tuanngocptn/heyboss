import { GET } from "@/app/api/toxic-bosses/route";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { getBaseUrl } from "@/lib/env";

// Get base URL from environment
const BASE_URL = getBaseUrl();

// TypeScript interfaces for test data
interface ToxicBossApiResponse {
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
  data: ToxicBossApiResponse[];
  pagination: PaginationData;
  filters: {
    search: string;
    company: string;
    location: string;
    verified: boolean | null;
    published: boolean | null;
  };
}

interface ErrorResponse {
  error: string;
}

describe("/api/toxic-bosses", () => {
  // Clean up all data before and after tests
  beforeEach(async () => {
    // Clear ALL existing data for clean test environment
    await prisma.toxicBoss.deleteMany({});
  });

  afterAll(async () => {
    // Clear all test data
    await prisma.toxicBoss.deleteMany({});
    await prisma.$disconnect();
  });

  describe("GET /api/toxic-bosses", () => {
    beforeEach(async () => {
      // Create test data
      const testData = Array.from({ length: 25 }, (_, i) => ({
        bossName: `Test Boss ${i + 1}`,
        bossCompany: i % 2 === 0 ? 'Test Evil Corp' : 'Test Bad Company',
        bossPosition: 'Test Manager',
        bossDepartment: 'Test IT',
        bornYear: 1980 + (i % 10),
        workLocation: i % 3 === 0 ? 'New York, NY' : 'San Francisco, CA',
        reporterEmail: `test${i + 1}@example.com`,
        categories: ['Verbal Abuse', 'Micromanagement'],
        markdownPath: `test-${i + 1}.md`,
        pdfPath: i % 2 === 0 ? `test-${i + 1}.pdf` : null,
        submissionDate: new Date(Date.now() - i * 86400000), // Different dates
        verified: i % 2 === 0, // Every 2nd record is verified
        published: i % 2 === 0, // Every 2nd record is published
        locked: i % 10 === 0, // Every 10th record is locked
      }));

      await prisma.toxicBoss.createMany({
        data: testData,
      });
    });

    it("should return paginated results with default parameters", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(13); // 13 records are both published and verified
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.totalCount).toBe(13);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(false);

      // Verify data structure and sensitive data exclusion
      const firstBoss = result.data[0];
      expect(firstBoss).toHaveProperty('id');
      expect(firstBoss).toHaveProperty('bossName');
      expect(firstBoss).toHaveProperty('bossCompany');
      expect(firstBoss).toHaveProperty('bossPosition');
      expect(firstBoss).toHaveProperty('bossDepartment');
      expect(firstBoss).toHaveProperty('bornYear');
      expect(firstBoss).toHaveProperty('workLocation');
      expect(firstBoss).toHaveProperty('categories');
      expect(firstBoss).toHaveProperty('submissionDate');
      expect(firstBoss).toHaveProperty('verified');
      expect(firstBoss).toHaveProperty('published');
      expect(firstBoss).toHaveProperty('locked');
      expect(firstBoss).toHaveProperty('createdAt');

      // Sensitive data should be excluded
      expect(firstBoss).not.toHaveProperty('reporterEmail');
      expect(firstBoss).not.toHaveProperty('markdownPath');
      expect(firstBoss).not.toHaveProperty('pdfPath');
    });

    it("should return second page with correct pagination", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?page=2`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0); // No records on second page
      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it("should respect custom limit parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?limit=10`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(10);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.totalPages).toBe(2);
    });

    it("should filter by search parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?search=Boss 1`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);

      // All results should contain "Boss 1" in the name
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.bossName).toContain('Boss 1');
      });
    });

    it("should filter by company parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?company=Evil Corp`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);

      // All results should contain "Evil Corp" in the company name
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.bossCompany).toContain('Evil Corp');
      });
    });

    it("should filter by location parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?location=New York`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);

      // All results should contain "New York" in the location
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.workLocation).toContain('New York');
      });
    });

    it("should filter by verified status", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?verified=true`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      // All results should be verified
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.verified).toBe(true);
      });
    });

    it("should filter by published status", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?published=true`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      // All results should be published
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.published).toBe(true);
      });
    });

    it("should combine multiple filters", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?company=Evil Corp&verified=true&limit=5`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);

      // All results should match all filters
      result.data.forEach((boss: ToxicBossApiResponse) => {
        expect(boss.bossCompany).toContain('Evil Corp');
        expect(boss.verified).toBe(true);
      });

      expect(result.pagination.limit).toBe(5);
    });

    it("should return error for invalid page parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?page=0`);
      const response = await GET(request);
      const result = await response.json() as ErrorResponse;

      expect(response.status).toBe(400);
      expect(result.error).toBe('Page must be greater than 0');
    });

    it("should return error for invalid limit parameter", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?limit=101`);
      const response = await GET(request);
      const result = await response.json() as ErrorResponse;

      expect(response.status).toBe(400);
      expect(result.error).toBe('Limit must be between 1 and 100');
    });

    it("should return empty results for non-existent page", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?page=999`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
      expect(result.pagination.currentPage).toBe(999);
      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it("should sort results by submission date in descending order", async () => {
      const request = new NextRequest(`${BASE_URL}/api/toxic-bosses?limit=5`);
      const response = await GET(request);
      const result = await response.json() as ApiResponse;

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.length).toBe(5);

      // Verify descending order by submission date
      for (let i = 0; i < result.data.length - 1; i++) {
        const currentDate = new Date(result.data[i].submissionDate);
        const nextDate = new Date(result.data[i + 1].submissionDate);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });
});