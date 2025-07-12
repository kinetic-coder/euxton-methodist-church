import { NextResponse } from 'next/server';
import { getConnection, getSetting } from '../../../lib/database';

export async function GET() {
  try {
    // Test database connection
    const pool = await getConnection();
    const connection = await pool.getConnection();
    connection.release();
    
    // Test a simple query
    const siteName = await getSetting('site_name');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      siteName: siteName || 'Not found',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 