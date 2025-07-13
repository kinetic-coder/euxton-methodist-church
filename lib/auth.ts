import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken, getUserById } from './database';

export interface AuthenticatedUser {
  id: number;
  full_name: string;
  email: string;
  tenant_id?: number;
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get('session_token')?.value;
    
    if (!sessionToken) {
      return null;
    }

    // Get session from database
    const session = await getSessionByToken(sessionToken);
    
    if (!session) {
      return null;
    }

    // Get user details by ID
    const user = await getUserById(session.user_id);
    
    if (!user || !user.id) {
      return null;
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      tenant_id: user.tenant_id,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return null; // User is authenticated
} 