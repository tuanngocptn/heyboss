import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadToR2, generateFileName } from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const reportDataStr = formData.get('reportData') as string;
    const pdfFile = formData.get('pdfFile') as File | null;
    const turnstileToken = formData.get('turnstileToken') as string;

    if (!reportDataStr) {
      return NextResponse.json({ error: 'Missing report data' }, { status: 400 });
    }

    // Check environment first
    const isProduction = process.env.NODE_ENV === 'production';

    // Only require turnstile token in production
    if (isProduction && !turnstileToken) {
      return NextResponse.json({ error: 'Security verification required' }, { status: 400 });
    }

    if (isProduction) {
      const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
      if (!turnstileSecretKey) {
        console.error('TURNSTILE_SECRET_KEY environment variable is not set');
        return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
      }

      const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${turnstileSecretKey}&response=${turnstileToken}`,
      });

      const turnstileResult = await turnstileResponse.json();

      if (!turnstileResult.success) {
        console.error('Turnstile verification failed:', turnstileResult);
        return NextResponse.json({ error: 'Security verification failed' }, { status: 400 });
      }
    } else {
      console.log('Turnstile verification skipped in development mode');
    }

    const reportData = JSON.parse(reportDataStr);

    // Generate new filename format: YYMMDDHHSS_full_name
    const markdownFileName = generateFileName(reportData.bossName, 'md');
    const pdfFileName = pdfFile ? generateFileName(reportData.bossName, 'pdf') : '';

    // Create markdown content
    const markdownContent = `# Toxic Boss Report: ${reportData.bossName}

**Report Date:** ${new Date(reportData.submissionDate).toLocaleDateString()}

## Reporter Information
- **Email:** ${reportData.reporterEmail}

## Boss Information
- **Name:** ${reportData.bossName}
- **Company:** ${reportData.bossCompany}
- **Position:** ${reportData.bossPosition}
- **Department:** ${reportData.bossDepartment}
- **Born Year:** ${reportData.bornYear}
- **Location:** ${reportData.workLocation}

## Types of Toxic Behavior
${reportData.categories}

## Detailed Report
${reportData.reportContent}

---
*Report submitted via HeyBoss.WTF*
`;

    // Upload files to Cloudflare R2
    let markdownUrl = '';
    let pdfUrl = '';

    try {
      // Upload markdown to R2
      const markdownBuffer = Buffer.from(markdownContent, 'utf-8');
      markdownUrl = await uploadToR2(markdownFileName, markdownBuffer, 'text/markdown');
      console.log('Markdown uploaded to R2:', markdownUrl);

      // Upload PDF to R2 if exists
      if (pdfFile) {
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
        pdfUrl = await uploadToR2(pdfFileName, pdfBuffer, 'application/pdf');
        console.log('PDF uploaded to R2:', pdfUrl);
      }
    } catch (error) {
      console.error('Failed to upload files to R2:', error);
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }

    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || '-1003147773870';
    const telegramTopicId = process.env.TELEGRAM_TOPIC_ID || '3';

    if (!telegramBotToken) {
      console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    if (!telegramChatId) {
      console.error('TELEGRAM_CHAT_ID environment variable is not set');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Send message with R2 file links to Telegram
    try {
      const telegramMessage = `🚨 **NEW TOXIC BOSS REPORT** 🚨

**Boss:** ${reportData.bossName}
**Company:** ${reportData.bossCompany}
**Position:** ${reportData.bossPosition}
**Department:** ${reportData.bossDepartment}
**Born Year:** ${reportData.bornYear}

**Behavior Categories:**
${reportData.categories}

**Location:** ${reportData.workLocation}
**Reporter Email:** ${reportData.reporterEmail}

🕐 **Submitted:** ${new Date().toLocaleString()}

📄 **Report Files:**
📝 Detailed Report: ${markdownUrl}${pdfFile ? `\n📎 PDF Evidence: ${pdfUrl}` : ''}`;

      const telegramMessageUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const messageResponse = await fetch(telegramMessageUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          message_thread_id: telegramTopicId,
          text: telegramMessage,
          parse_mode: 'Markdown'
        }),
      });

      if (!messageResponse.ok) {
        const messageError = await messageResponse.text();
        console.error('Message send failed:', messageError);
      } else {
        console.log('Message with R2 links sent successfully to Telegram');

        // Save to database after successful Telegram send
        try {
          const savedBoss = await prisma.toxicBoss.create({
            data: {
              bossName: reportData.bossName,
              bossCompany: reportData.bossCompany,
              bossPosition: reportData.bossPosition,
              bossDepartment: reportData.bossDepartment,
              bornYear: reportData.bornYear ? parseInt(reportData.bornYear) || null : null,
              workLocation: reportData.workLocation,
              reporterEmail: reportData.reporterEmail,
              categories: reportData.categories.split(', ').filter(Boolean),
              markdownPath: markdownFileName,
              pdfPath: pdfFile ? pdfFileName : null,
              submissionDate: new Date(reportData.submissionDate),
              verified: false,
              published: false,
            },
          });
          console.log('Boss report saved to database with ID:', savedBoss.id);
        } catch (dbError) {
          console.error('Failed to save to database:', dbError);
          // Continue anyway - don't fail the request if database save fails
        }
      }
    } catch (error) {
      console.error('Failed to send message to Telegram:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      files: {
        markdown: markdownFileName,
        pdf: pdfFileName || null,
        markdownUrl: markdownUrl,
        pdfUrl: pdfFile ? pdfUrl : null
      }
    });

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}