import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import JSZip from 'jszip';

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
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const bossNameForFile = reportData.bossName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

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
- **Age:** ${reportData.bossAge}
- **Location:** ${reportData.workLocation}

## Types of Toxic Behavior
${reportData.categories}

## Detailed Report
${reportData.reportContent}

---
*Report submitted via HeyBoss.WTF*
*Submission ID: ${timestamp}*
`;

    // Save markdown file (in production, you'd save to cloud storage)
    const markdownFileName = `${bossNameForFile}_${timestamp}.md`;
    const markdownPath = join(process.cwd(), 'reports', markdownFileName);

    try {
      await writeFile(markdownPath, markdownContent, 'utf-8');
    } catch (error) {
      console.log('Could not save markdown file locally:', error);
      // Continue with Telegram submission even if local save fails
    }

    // Handle PDF file if uploaded
    let pdfFileName = '';
    if (pdfFile) {
      pdfFileName = `${bossNameForFile}_${timestamp}.pdf`;
      const pdfPath = join(process.cwd(), 'reports', pdfFileName);

      try {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        await writeFile(pdfPath, buffer);
      } catch (error) {
        console.log('Could not save PDF file locally:', error);
      }
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

    // Skip sending separate message - will only send zip file with caption

    // Create zip file with markdown and PDF (if exists)
    try {
      const zip = new JSZip();

      // Add markdown file to zip
      zip.file(markdownFileName, markdownContent);

      // Add PDF file to zip if it exists
      if (pdfFile) {
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
        zip.file(pdfFileName, pdfBuffer);
      }

      // Generate zip file
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const zipFileName = `${bossNameForFile}_${timestamp}.zip`;
      const zipBlob = new Blob([new Uint8Array(zipBuffer)], { type: 'application/zip' });

      // Send zip file to Telegram
      const zipFormData = new FormData();
      zipFormData.append('chat_id', telegramChatId);
      zipFormData.append('message_thread_id', telegramTopicId);
      zipFormData.append('document', zipBlob, zipFileName);
      const zipCaption = `🚨 **NEW TOXIC BOSS REPORT** 🚨

**Boss:** ${reportData.bossName}
**Company:** ${reportData.bossCompany}
**Position:** ${reportData.bossPosition}
**Department:** ${reportData.bossDepartment}

**Behavior Categories:**
${reportData.categories}

**Location:** ${reportData.workLocation}
**Reporter Email:** ${reportData.reporterEmail}

🕐 **Submitted:** ${new Date().toLocaleString()}

📄 **Zip Package:** \`${zipFileName}\`
${pdfFile ? '- Contains: Detailed report + PDF evidence' : '- Contains: Detailed report only'}`;

      zipFormData.append('caption', zipCaption);

      const telegramDocUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;
      const zipResponse = await fetch(telegramDocUrl, {
        method: 'POST',
        body: zipFormData,
      });

      if (!zipResponse.ok) {
        const zipError = await zipResponse.text();
        console.error('Zip send failed:', zipError);
      } else {
        console.log('Zip file sent successfully to Telegram');

        // Clean up files from reports folder after successful send
        try {
          await unlink(markdownPath);
          console.log('Markdown file deleted from reports folder');

          if (pdfFile && pdfFileName) {
            const pdfPath = join(process.cwd(), 'reports', pdfFileName);
            await unlink(pdfPath);
            console.log('PDF file deleted from reports folder');
          }
        } catch (cleanupError) {
          console.log('Could not clean up files from reports folder:', cleanupError);
          // Don't fail the request if cleanup fails
        }
      }
    } catch (error) {
      console.error('Failed to create or send zip file to Telegram:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      files: {
        markdown: markdownFileName,
        pdf: pdfFileName || null,
        zip: `${bossNameForFile}_${timestamp}.zip`
      }
    });

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}