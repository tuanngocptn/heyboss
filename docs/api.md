# API Documentation

HeyBoss.WTF API endpoints for handling toxic boss reports and other functionality.

## 📍 Endpoints

### Report Boss Submission

#### `POST /api/report-boss`

Submits a new toxic boss report with optional PDF evidence.

**Content-Type:** `multipart/form-data`

**Request Body:**

```typescript
{
  reportData: string; // JSON string containing report details
  pdfFile?: File;     // Optional PDF file (max 10MB)
}
```

**Report Data Structure:**

```typescript
{
  reporterEmail: string;        // Optional, "Anonymous" if not provided
  bossName: string;            // Required
  bossCompany: string;         // Optional, "Not specified" if empty
  bossPosition: string;        // Optional
  bossDepartment: string;      // Optional
  bossAge: string;            // Optional
  workLocation: string;        // Optional
  reportContent: string;       // Required - detailed report
  categories: string;          // Comma-separated list of toxic behaviors
  submissionDate: string;      // ISO timestamp
}
```

**Response:**

```typescript
// Success (200)
{
  success: true,
  message: "Report submitted successfully",
  files: {
    markdown: string;    // Generated markdown filename
    pdf: string | null;  // PDF filename if uploaded
  }
}

// Error (400/500)
{
  error: string;        // Error message
}
```

**Example Request:**

```javascript
const formData = new FormData();

const reportData = {
  reporterEmail: "anonymous@email.com",
  bossName: "John Toxic Manager",
  bossCompany: "Evil Corp",
  bossPosition: "Senior Manager",
  bossDepartment: "Sales",
  bossAge: "45-50",
  workLocation: "New York, NY",
  reportContent: "This manager consistently takes credit for team work...",
  categories: "Takes credit for others' work, Micromanages everything, Public humiliation",
  submissionDate: new Date().toISOString()
};

formData.append('reportData', JSON.stringify(reportData));

// Optional PDF file
if (pdfFile) {
  formData.append('pdfFile', pdfFile);
}

const response = await fetch('/api/report-boss', {
  method: 'POST',
  body: formData
});
```

## 🔄 Data Flow

### Report Submission Process

1. **Client submits form** → `POST /api/report-boss`
2. **Server validates data** → Required fields, file types, captcha
3. **Files are processed** → PDF stored, markdown generated
4. **Telegram notification sent** → Message + files to group/topic
5. **Success response** → Confirmation to user

### File Naming Convention

**Markdown files:**
```
{boss_name_sanitized}_{timestamp}.md
```

**PDF files:**
```
{boss_name_sanitized}_{timestamp}.pdf
```

**Example:**
```
john_toxic_manager_2024-01-15T10-30-00-000Z.md
john_toxic_manager_2024-01-15T10-30-00-000Z.pdf
```

## 📤 Telegram Integration

### Message Format

```markdown
🚨 **NEW TOXIC BOSS REPORT** 🚨

**Boss:** John Toxic Manager
**Company:** Evil Corp
**Position:** Senior Manager
**Department:** Sales

**Behavior Categories:**
Takes credit for others' work, Micromanages everything

**Location:** New York, NY
**Reporter Email:** anonymous@email.com

**Report Summary:**
This manager consistently takes credit for team work...

📄 **Files:**
- Markdown: `john_toxic_manager_2024-01-15T10-30-00-000Z.md`
- PDF Evidence: `evidence_document.pdf`

🕐 **Submitted:** 1/15/2024, 10:30:00 AM
```

### Telegram API Calls

1. **Send text message** with report summary
2. **Send markdown file** as document attachment
3. **Send PDF file** (if uploaded) as document attachment

## ⚠️ Error Handling

### Validation Errors (400)

- Missing required fields (`bossName`, `reportContent`)
- Invalid captcha answer
- PDF file too large or wrong format
- Malformed JSON in `reportData`

### Server Errors (500)

- Telegram API failures
- File system write errors
- Environment configuration issues

### Rate Limiting

- Maximum 5 reports per IP per hour (configurable)
- Returns 429 status when exceeded

## 🔒 Security Features

### Input Validation

- **Required field checking** for critical data
- **File type validation** (PDF only)
- **File size limits** (10MB default)
- **Math captcha** prevents automated submissions

### Data Sanitization

- **Filename sanitization** for safe file storage
- **Input trimming** and cleanup
- **XSS prevention** through proper encoding

### Rate Limiting

```typescript
// Conceptual implementation
const rateLimiter = {
  maxRequests: parseInt(process.env.RATE_LIMIT_PER_HOUR) || 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.ip
};
```

## 🚀 Future API Endpoints

### Planned Additions

**`GET /api/reports`** - List submitted reports (admin)
**`GET /api/reports/:id`** - Get specific report details
**`DELETE /api/reports/:id`** - Remove report (admin)
**`POST /api/auth/login`** - Admin authentication
**`GET /api/stats`** - Report statistics and analytics

## 📊 Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Report submitted successfully |
| 400 | Bad Request | Invalid data, missing fields |
| 413 | Payload Too Large | PDF file exceeds limit |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server/Telegram issues |

## 🧪 Testing

### Development Testing

Set `MOCK_TELEGRAM=true` in environment to:
- Log messages to console instead of sending
- Skip actual Telegram API calls
- Test form submission without spam

### Curl Examples

```bash
# Test with minimal data
curl -X POST http://localhost:3000/api/report-boss \
  -F "reportData={\"bossName\":\"Test Boss\",\"reportContent\":\"Test report\",\"submissionDate\":\"$(date -Iseconds)\"}"

# Test with PDF upload
curl -X POST http://localhost:3000/api/report-boss \
  -F "reportData={\"bossName\":\"Test Boss\",\"reportContent\":\"Test report\",\"submissionDate\":\"$(date -Iseconds)\"}" \
  -F "pdfFile=@test-evidence.pdf"
```