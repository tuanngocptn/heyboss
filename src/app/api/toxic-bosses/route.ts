import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const company = searchParams.get('company') || '';
    const location = searchParams.get('location') || '';
    const verified = searchParams.get('verified');
    const published = searchParams.get('published');

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json({ error: 'Page must be greater than 0' }, { status: 400 });
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Limit must be between 1 and 100' }, { status: 400 });
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    const where: {
      OR?: Array<{
        bossName?: { contains: string; mode: 'insensitive' };
        bossCompany?: { contains: string; mode: 'insensitive' };
        bossPosition?: { contains: string; mode: 'insensitive' };
      }>;
      bossCompany?: { contains: string; mode: 'insensitive' };
      workLocation?: { contains: string; mode: 'insensitive' };
      verified?: boolean;
      published?: boolean;
    } = {};

    // Search in boss name, company, or position
    if (search) {
      where.OR = [
        { bossName: { contains: search, mode: 'insensitive' } },
        { bossCompany: { contains: search, mode: 'insensitive' } },
        { bossPosition: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by company
    if (company) {
      where.bossCompany = { contains: company, mode: 'insensitive' };
    }

    // Filter by location
    if (location) {
      where.workLocation = { contains: location, mode: 'insensitive' };
    }

    // Only show published AND verified records in public directory
    where.published = true;
    where.verified = true;

    // Get total count for pagination
    const totalCount = await prisma.toxicBoss.count({ where });

    // Get paginated results
    const toxicBosses = await prisma.toxicBoss.findMany({
      where,
      select: {
        id: true,
        bossName: true,
        bossCompany: true,
        bossPosition: true,
        bossDepartment: true,
        bornYear: true,
        workLocation: true,
        categories: true,
        submissionDate: true,
        verified: true,
        published: true,
        locked: true,
        createdAt: true,
        // Exclude sensitive data like reporterEmail
      },
      orderBy: {
        submissionDate: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: toxicBosses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
      filters: {
        search,
        company,
        location,
        verified: verified ? verified === 'true' : null,
        published: published ? published === 'true' : null,
      },
    });

  } catch (error) {
    console.error('Error fetching toxic bosses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}