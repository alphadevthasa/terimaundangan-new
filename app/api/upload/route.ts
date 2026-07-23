import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2, deleteFromR2 } from '@/app/lib/r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV' },
        { status: 400 }
      );
    }

    // Max 5MB for images, 50MB for videos
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const label = file.type.startsWith('video/') ? '50MB' : '5MB';
      return NextResponse.json({ error: `File too large. Max ${label}` }, { status: 400 });
    }

    // Delete old file from R2 if provided (best-effort before upload)
    const oldUrl = formData.get('oldUrl') as string | null;
    if (oldUrl) {
      await deleteFromR2(oldUrl).catch(() => {});
    }

    const url = await uploadToR2(file);
    // Extract filename for backward compatibility
    const filename = url.split('/').pop() || 'file';

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
