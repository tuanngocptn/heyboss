import AWS from 'aws-sdk'

// Configure AWS SDK for Cloudflare R2
const r2 = new AWS.S3({
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  region: 'auto',
  signatureVersion: 'v4',
})

export const uploadToR2 = async (
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  const bucketName = process.env.R2_BUCKET_NAME!

  try {
    await r2.upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }).promise()

    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`
    return publicUrl
  } catch (error) {
    console.error('Failed to upload to R2:', error)
    throw error
  }
}

export const generateFileName = (bossName: string, extension: string): string => {
  const now = new Date()
  const timestamp = now.toISOString()
    .replace(/[-:T]/g, '')
    .replace(/\.\d{3}Z$/, '')
    .slice(2, 12) // YYMMDDHHSS format

  const sanitizedName = bossName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '')

  return `${timestamp}-${sanitizedName}.${extension}`
}