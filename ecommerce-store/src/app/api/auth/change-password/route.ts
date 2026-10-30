import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

export async function POST(req: Request) {
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    try {
      // Fetch user from database
      console.log('Fetching user with ID:', payload.userId);
      
      let user;
      try {
        // Try fetching with address field
        user = await db
          .select()
          .from(users)
          .where(eq(users.id, payload.userId))
          .limit(1);
      } catch (addressError) {
        // Fallback if address column doesn't exist yet
        console.log('Query with address failed, trying without address field');
        user = await db
          .select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
            phoneNumber: users.phoneNumber,
            passwordHash: users.passwordHash,
            role: users.role,
            isActive: users.isActive,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where(eq(users.id, payload.userId))
          .limit(1);
      }

      console.log('User found:', !!user && user.length > 0);
      if (!user || user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      console.log('User data:', {
        id: user[0].id,
        email: user[0].email,
        passwordHashExists: !!user[0].passwordHash,
        passwordHashLength: user[0].passwordHash?.length,
      });

      // Check if passwordHash exists
      if (!user[0].passwordHash) {
        console.error('ERROR: User has no passwordHash in database');
        return NextResponse.json({ error: 'Error: user account is corrupted (no password hash)' }, { status: 500 });
      }

      // Verify current password using the same helper as login
      let isPasswordValid = false;
      try {
        console.log('Verifying current password...');
        isPasswordValid = await verifyPassword(currentPassword, user[0].passwordHash);
        console.log('Password verification result:', isPasswordValid);
      } catch (bcryptError) {
        console.error('Password verification error:', bcryptError);
        console.error('Error name:', (bcryptError as any).name);
        console.error('Error message:', (bcryptError as any).message);
        return NextResponse.json({ error: 'Error verifying password: ' + (bcryptError as any).message }, { status: 500 });
      }

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
      }

      // Hash new password using the same helper as registration
      let hashedNewPassword;
      try {
        console.log('Hashing new password...');
        hashedNewPassword = await hashPassword(newPassword);
        console.log('Hash successful, new hash length:', hashedNewPassword.length);
      } catch (hashError) {
        console.error('Password hash error:', hashError);
        return NextResponse.json({ error: 'Error hashing new password' }, { status: 500 });
      }

      // Update password in database
      console.log('Updating password in database');
      await db
        .update(users)
        .set({
          passwordHash: hashedNewPassword,
        })
        .where(eq(users.id, payload.userId));

      console.log('Password update complete');
      return NextResponse.json({
        message: 'Password changed successfully',
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + (dbError as any).message }, { status: 500 });
    }
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + (error as any).message }, { status: 500 });
  }
}
