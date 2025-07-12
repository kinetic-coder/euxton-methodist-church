import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'mysql',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'captiveuser',
  password: process.env.MYSQL_PASSWORD || 'captivepass',
  database: process.env.MYSQL_DATABASE || 'CaptivePortal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export async function getConnection(): Promise<mysql.Pool> {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    try {
      const connection = await pool.getConnection();
      console.log('Database connected successfully');
      connection.release();
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  return pool;
}

// User-related database operations
export interface User {
  id?: number;
  mac_address: string;
  ip_address?: string;
  device_name?: string;
  email?: string;
  name?: string;
  terms_accepted: boolean;
  safeguarding_accepted: boolean;
  created_at?: Date;
  updated_at?: Date;
  last_seen?: Date;
  is_active?: boolean;
}

export async function createUser(user: User): Promise<number> {
  const pool = await getConnection();
  const [result] = await pool.execute(
    'INSERT INTO users (mac_address, ip_address, device_name, email, name, terms_accepted, safeguarding_accepted) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user.mac_address, user.ip_address, user.device_name, user.email, user.name, user.terms_accepted, user.safeguarding_accepted]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function getUserByMacAddress(macAddress: string): Promise<User | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE mac_address = ? AND is_active = TRUE',
    [macAddress]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

export async function updateUserLastSeen(userId: number): Promise<void> {
  const pool = await getConnection();
  await pool.execute(
    'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = ?',
    [userId]
  );
}

export async function updateUserAcceptance(userId: number, termsAccepted: boolean, safeguardingAccepted: boolean): Promise<void> {
  const pool = await getConnection();
  await pool.execute(
    'UPDATE users SET terms_accepted = ?, safeguarding_accepted = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [termsAccepted, safeguardingAccepted, userId]
  );
}

// Session-related database operations
export interface Session {
  id?: number;
  user_id: number;
  session_token: string;
  start_time?: Date;
  end_time?: Date;
  is_active?: boolean;
}

export async function createSession(session: Session): Promise<number> {
  const pool = await getConnection();
  const [result] = await pool.execute(
    'INSERT INTO sessions (user_id, session_token) VALUES (?, ?)',
    [session.user_id, session.session_token]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT * FROM sessions WHERE session_token = ? AND is_active = TRUE',
    [token]
  );
  const sessions = rows as Session[];
  return sessions.length > 0 ? sessions[0] : null;
}

export async function deactivateSession(sessionId: number): Promise<void> {
  const pool = await getConnection();
  await pool.execute(
    'UPDATE sessions SET is_active = FALSE, end_time = CURRENT_TIMESTAMP WHERE id = ?',
    [sessionId]
  );
}

// Access log operations
export interface AccessLog {
  id?: number;
  user_id?: number;
  action: string;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

export async function logAccess(log: AccessLog): Promise<void> {
  const pool = await getConnection();
  await pool.execute(
    'INSERT INTO access_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
    [log.user_id, log.action, log.details, log.ip_address, log.user_agent]
  );
}

// Settings operations
export interface Setting {
  id?: number;
  setting_key: string;
  setting_value?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getSetting(key: string): Promise<string | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT setting_value FROM settings WHERE setting_key = ?',
    [key]
  );
  const settings = rows as Setting[];
  return settings.length > 0 ? settings[0].setting_value || null : null;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const pool = await getConnection();
  await pool.execute(
    'UPDATE settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
    [value, key]
  );
}

// Close the connection pool
export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
} 