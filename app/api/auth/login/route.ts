import { NextRequest, NextResponse } from 'next/server';
import { loginUser, createSession } from '../../../../lib/database';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Attempt to login user
    const user = await loginUser(email, password);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Create session in database
    await createSession({
      user_id: user.id!,
      session_token: sessionToken,
    });

    // Create response with session cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });

    // Set session cookie (httpOnly for security)
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 