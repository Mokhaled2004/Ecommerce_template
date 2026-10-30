import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

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

    // Fetch user data from database
    let userData;
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user || user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      userData = user[0];
    } catch (dbError) {
      // Fallback if address column doesn't exist yet
      console.log('Query with address failed, trying without address field');
      const user = await db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          phoneNumber: users.phoneNumber,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user || user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      userData = user[0];
    }

    return NextResponse.json({
      userId: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber || '',
      address: (userData as any).address || '',
      role: userData.role,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
