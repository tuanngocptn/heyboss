import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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
    const telegramTopicId = process.env.TELEGRAM_TOPIC_ID || '5';

    if (!telegramBotToken) {
      console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    if (!telegramChatId) {
      console.error('TELEGRAM_CHAT_ID environment variable is not set');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Prepare Telegram message
    const telegramMessage = `🚨 **NEW TOXIC BOSS REPORT** 🚨

**Boss:** ${reportData.bossName}
**Company:** ${reportData.bossCompany}
**Position:** ${reportData.bossPosition}
**Department:** ${reportData.bossDepartment}

**Behavior Categories:**
${reportData.categories}

**Location:** ${reportData.workLocation}
**Reporter Email:** ${reportData.reporterEmail}

**Report Summary:**
${reportData.reportContent.length > 500 ?
  reportData.reportContent.substring(0, 500) + '...' :
  reportData.reportContent}

📄 **Files:**
- Markdown: \`${markdownFileName}\`
${pdfFile ? `- PDF Evidence: \`${pdfFileName}\`` : '- No PDF evidence uploaded'}

🕐 **Submitted:** ${new Date().toLocaleString()}
`;

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        message_thread_id: telegramTopicId,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      console.error('Telegram API error:', telegramError);
      // Continue anyway - we don't want to fail the submission if Telegram is down
    }

    // Send PDF file to Telegram if it exists
    if (pdfFile) {
      const formDataForTelegram = new FormData();
      formDataForTelegram.append('chat_id', telegramChatId);
      formDataForTelegram.append('message_thread_id', telegramTopicId);
      formDataForTelegram.append('document', pdfFile, pdfFileName);
      formDataForTelegram.append('caption', `Evidence for ${reportData.bossName} report`);

      const telegramDocUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;
      try {
        await fetch(telegramDocUrl, {
          method: 'POST',
          body: formDataForTelegram,
        });
      } catch (error) {
        console.error('Failed to send PDF to Telegram:', error);
      }
    }

    // Send markdown file to Telegram
    try {
      const markdownBlob = new Blob([markdownContent], { type: 'text/markdown' });
      const markdownFormData = new FormData();
      markdownFormData.append('chat_id', telegramChatId);
      markdownFormData.append('message_thread_id', telegramTopicId);
      markdownFormData.append('document', markdownBlob, markdownFileName);
      markdownFormData.append('caption', `Full report for ${reportData.bossName}`);

      const telegramDocUrl = `https://api.telegram.org/bot${telegramBotToken}/sendDocument`;
      await fetch(telegramDocUrl, {
        method: 'POST',
        body: markdownFormData,
      });
    } catch (error) {
      console.error('Failed to send markdown to Telegram:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      files: {
        markdown: markdownFileName,
        pdf: pdfFileName || null
      }
    });

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}