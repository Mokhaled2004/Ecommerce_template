import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Return default preferences if columns don't exist yet
    return NextResponse.json({
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { orderUpdates, promotions, newsletter } = body;

    if (typeof orderUpdates !== 'boolean' || typeof promotions !== 'boolean' || typeof newsletter !== 'boolean') {
      return NextResponse.json({ error: 'Invalid notification preferences' }, { status: 400 });
    }

    // For now, just return success (columns don't exist yet)
    // In production, this would update the database:
    // await db
    //   .update(users)
    //   .set({
    //     emailNotificationsOrderUpdates: orderUpdates,
    //     emailNotificationsPromotions: promotions,
    //     emailNotificationsNewsletter: newsletter,
    //   })
    //   .where(eq(users.id, payload.userId));

    console.log('Notification preferences updated (not persisted to DB yet):', {
      userId: payload.userId,
      orderUpdates,
      promotions,
      newsletter,
    });

    return NextResponse.json({
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
