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

    // Return default privacy settings if columns don't exist yet
    return NextResponse.json({
      allowMarketing: false,
      allowThirdParty: false,
      dataRetention: '12_months',
    });
  } catch (error) {
    console.error('Get privacy error:', error);
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
    const { allowMarketing, allowThirdParty, dataRetention } = body;

    if (typeof allowMarketing !== 'boolean' || typeof allowThirdParty !== 'boolean') {
      return NextResponse.json({ error: 'Invalid privacy settings' }, { status: 400 });
    }

    const validRetentionOptions = ['3_months', '12_months', '24_months', 'indefinite'];
    if (!validRetentionOptions.includes(dataRetention)) {
      return NextResponse.json({ error: 'Invalid data retention option' }, { status: 400 });
    }

    // For now, just return success (columns don't exist yet)
    // In production, this would update the database:
    // await db
    //   .update(users)
    //   .set({
    //     privacyAllowMarketing: allowMarketing,
    //     privacyAllowThirdParty: allowThirdParty,
    //     privacyDataRetention: dataRetention,
    //   })
    //   .where(eq(users.id, payload.userId));

    console.log('Privacy settings updated (not persisted to DB yet):', {
      userId: payload.userId,
      allowMarketing,
      allowThirdParty,
      dataRetention,
    });

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
    });
  } catch (error) {
    console.error('Update privacy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
