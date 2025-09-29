import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Boss ID is required' }, { status: 400 });
    }

    // Try to find by ID first
    let boss = await prisma.toxicBoss.findFirst({
      where: {
        id: id
      }
    });

    // If not found by ID, try to find by constructing potential matches from slug
    if (!boss && id.includes('-')) {
      const parts = id.split('-');
      const possibleNames = [];

      // Try different combinations to reconstruct the name
      for (let i = 1; i < parts.length; i++) {
        const namePart = parts.slice(0, i).join(' ');
        const companyPart = parts.slice(i).join(' ');
        possibleNames.push({ namePart, companyPart });
      }

      for (const { namePart, companyPart } of possibleNames) {
        boss = await prisma.toxicBoss.findFirst({
          where: {
            AND: [
              { bossName: { contains: namePart, mode: 'insensitive' } },
              { bossCompany: { contains: companyPart, mode: 'insensitive' } },
              { published: true },
              { verified: true }
            ]
          }
        });

        if (boss) break;
      }
    }

    if (!boss) {
      return NextResponse.json({ error: 'Boss not found' }, { status: 404 });
    }

    // Only return published and verified bosses for public access
    if (!boss.published || !boss.verified) {
      return NextResponse.json({ error: 'Boss not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: boss
    });

  } catch (error) {
    console.error('Error fetching boss details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}