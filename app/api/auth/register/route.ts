import { NextRequest, NextResponse } from 'next/server';
import { registerUser, getUserByEmail } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const { organisationName, fullName, email, password } = await request.json();

    // Validate input
    if (!organisationName || !fullName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Register user (this will create both tenant and user)
    const { tenantId, userId } = await registerUser(organisationName, fullName, email, password);

    return NextResponse.json({
      message: 'Registration successful',
      tenantId,
      userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 