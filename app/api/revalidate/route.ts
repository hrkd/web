import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-microcms-signature');
  const body = await request.text();

  if (!signature || !process.env.MICROCMS_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Missing signature or secret' }, { status: 401 });
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.MICROCMS_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  revalidateTag('microcms', { expire: 60 * 60 * 24 * 30 }); // 30 days

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
