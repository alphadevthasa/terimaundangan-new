import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

export async function uploadToR2(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'bin';
  const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  await R2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  }));

  return `${PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(url: string): Promise<void> {
  const prefix = PUBLIC_URL + '/';
  if (!url.startsWith(prefix)) return;
  const key = url.slice(prefix.length);

  await R2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  }));
}
