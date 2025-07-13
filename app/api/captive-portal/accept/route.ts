import { NextRequest, NextResponse } from 'next/server';
import { logCaptivePortalAcceptance } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, deviceDetails } = await request.json();

    // Validate input
    if (!fullName || !email) {
      return NextResponse.json(
        { message: 'Full name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Log the acceptance
    const result = await logCaptivePortalAcceptance(
      fullName,
      email,
      ipAddress,
      userAgent,
      deviceDetails || {}
    );

    return NextResponse.json({
      message: 'Acceptance logged successfully',
      userAcceptanceId: result.userAcceptanceId,
      deviceDetailsId: result.deviceDetailsId,
    });
  } catch (error) {
    console.error('Captive portal acceptance error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 