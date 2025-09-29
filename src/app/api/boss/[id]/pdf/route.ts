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

    // Find the boss record to get the PDF path
    let boss = await prisma.toxicBoss.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        pdfPath: true,
        published: true,
        verified: true,
        bossName: true,
        bossCompany: true
      }
    });

    // If not found by ID, try slug-based lookup
    if (!boss && id.includes('-')) {
      const parts = id.split('-');

      for (let i = 1; i < parts.length; i++) {
        const namePart = parts.slice(0, i).join(' ');
        const companyPart = parts.slice(i).join(' ');

        boss = await prisma.toxicBoss.findFirst({
          where: {
            AND: [
              { bossName: { contains: namePart, mode: 'insensitive' } },
              { bossCompany: { contains: companyPart, mode: 'insensitive' } },
              { published: true },
              { verified: true }
            ]
          },
          select: {
            id: true,
            pdfPath: true,
            published: true,
            verified: true,
            bossName: true,
            bossCompany: true
          }
        });

        if (boss) break;
      }
    }

    if (!boss || !boss.published || !boss.verified) {
      return NextResponse.json({ error: 'Boss not found' }, { status: 404 });
    }

    if (!boss.pdfPath) {
      return NextResponse.json({ error: 'PDF file not found' }, { status: 404 });
    }

    try {
      // Get PDF URL from Cloudflare R2
      const r2BaseUrl = process.env.R2_PUBLIC_URL || 'static-dev.heyboss.wtf';
      const pdfUrl = `https://${r2BaseUrl}/${boss.pdfPath}`;

      // Return the PDF URL for client-side loading
      return NextResponse.json({
        success: true,
        pdfUrl: pdfUrl,
        filename: boss.pdfPath,
        bossName: boss.bossName
      });

    } catch (error) {
      console.error('Error getting PDF URL:', error);
      return NextResponse.json({ error: 'PDF file not accessible' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error fetching PDF info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}