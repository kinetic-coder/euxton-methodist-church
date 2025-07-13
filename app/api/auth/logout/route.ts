import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, deactivateSession } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session_token')?.value;

    if (sessionToken) {
      // Get session from database
      const session = await getSessionByToken(sessionToken);
      
      if (session) {
        // Deactivate session in database
        await deactivateSession(session.id!);
      }
    }

    // Create response
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear session cookie
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 