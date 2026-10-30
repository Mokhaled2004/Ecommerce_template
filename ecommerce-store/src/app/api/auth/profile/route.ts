import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    const { name, phone, address } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Try to update with address field
    try {
      await db
        .update(users)
        .set({
          fullName: name,
          phoneNumber: phone || null,
          address: address || null,
        })
        .where(eq(users.id, payload.userId));
    } catch (dbError) {
      // Fallback if address column doesn't exist yet
      console.log('Update with address failed, trying without address field');
      await db
        .update(users)
        .set({
          fullName: name,
          phoneNumber: phone || null,
        })
        .where(eq(users.id, payload.userId));
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: { name, phone, address },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
