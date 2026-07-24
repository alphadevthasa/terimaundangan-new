import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ notifications });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type, link } = await request.json();
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    const notification = await prisma.notification.create({
      data: { title, message: message || '', type: type || 'info', link: link || '' },
    });
    return NextResponse.json({ notification }, { status: 201 });
  } catch (e) {
    console.error('[admin/notifications] create error:', e);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
