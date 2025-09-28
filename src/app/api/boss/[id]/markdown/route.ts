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

    // Find the boss record to get the markdown path
    const boss = await prisma.toxicBoss.findFirst({
      where: {
        OR: [
          { id: id },
          {
            // For slug format - try to match published and verified records
            AND: [
              { published: true },
              { verified: true }
            ]
          }
        ]
      },
      select: {
        id: true,
        markdownPath: true,
        published: true,
        verified: true,
        bossName: true,
        bossCompany: true
      }
    });

    if (!boss || !boss.published || !boss.verified) {
      return NextResponse.json({ error: 'Boss not found' }, { status: 404 });
    }

    if (!boss.markdownPath) {
      return NextResponse.json({ error: 'Markdown file not found' }, { status: 404 });
    }

    try {
      // Fetch markdown content from Cloudflare R2
      const r2BaseUrl = process.env.R2_PUBLIC_URL || 'static-dev.heyboss.wtf';
      const markdownUrl = `https://${r2BaseUrl}/${boss.markdownPath}`;

      const response = await fetch(markdownUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch markdown: ${response.status}`);
      }

      const markdownContent = await response.text();

      return NextResponse.json({
        success: true,
        content: markdownContent,
        filename: boss.markdownPath
      });

    } catch (fetchError) {
      console.error('Error fetching markdown from R2:', fetchError);

      // Return a fallback markdown content based on database info
      const fallbackContent = `# Toxic Boss Report: ${boss.bossName}

**Report Date:** ${new Date().toLocaleDateString()}

## Boss Information
- **Name:** ${boss.bossName}
- **Company:** ${boss.bossCompany || 'Not specified'}

## Report Status
This report has been verified and published.

*The detailed markdown file could not be loaded at this time. Please try again later.*

---
*Report submitted via HeyBoss.WTF*
`;

      return NextResponse.json({
        success: true,
        content: fallbackContent,
        filename: 'fallback.md',
        fallback: true
      });
    }

  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}