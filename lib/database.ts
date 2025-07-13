import mysql from 'mysql2/promise';
import crypto from 'crypto';

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

// Password hashing utilities
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Tenant-related database operations
export interface Tenant {
  id?: number;
  organisation_name: string;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
}

export async function createTenant(tenant: Tenant): Promise<number> {
  const pool = await getConnection();
  const [result] = await pool.execute(
    'INSERT INTO Tenant (organisation_name) VALUES (?)',
    [tenant.organisation_name]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function getTenantById(id: number): Promise<Tenant | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT * FROM Tenant WHERE id = ? AND is_active = TRUE',
    [id]
  );
  const tenants = rows as Tenant[];
  return tenants.length > 0 ? tenants[0] : null;
}

// User-related database operations (updated for login system)
export interface User {
  id?: number;
  tenant_id?: number;
  full_name: string;
  email: string;
  password_hash: string;
  mac_address?: string;
  ip_address?: string;
  device_name?: string;
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
    'INSERT INTO users (tenant_id, full_name, email, password_hash, mac_address, ip_address, device_name, terms_accepted, safeguarding_accepted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [user.tenant_id, user.full_name, user.email, user.password_hash, user.mac_address, user.ip_address, user.device_name, user.terms_accepted, user.safeguarding_accepted]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

export async function getUserById(id: number): Promise<User | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
    [id]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const pool = await getConnection();
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
    [email]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
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

// Registration function
export async function registerUser(organisationName: string, fullName: string, email: string, password: string): Promise<{ tenantId: number; userId: number }> {
  const pool = await getConnection();

  // Start transaction
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Create tenant
    const [tenantResult] = await connection.execute(
      'INSERT INTO Tenant (organisation_name) VALUES (?)',
      [organisationName]
    );
    const tenantId = (tenantResult as mysql.ResultSetHeader).insertId;

    // Create user
    const passwordHash = hashPassword(password);
    const [userResult] = await connection.execute(
      'INSERT INTO users (tenant_id, full_name, email, password_hash, terms_accepted, safeguarding_accepted) VALUES (?, ?, ?, ?, FALSE, FALSE)',
      [tenantId, fullName, email, passwordHash]
    );
    const userId = (userResult as mysql.ResultSetHeader).insertId;

    // Commit transaction
    await connection.commit();
    connection.release();

    return { tenantId, userId };
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    connection.release();
    throw error;
  }
}

// Login function
export async function loginUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  if (verifyPassword(password, user.password_hash)) {
    return user;
  }

  return null;
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

// UserAcceptance operations for captive portal
export interface UserAcceptance {
  id?: number;
  full_name: string;
  email: string;
  terms_accepted: boolean;
  safeguarding_accepted: boolean;
  accepted_at?: Date;
  ip_address?: string;
  user_agent?: string;
}

export async function createUserAcceptance(acceptance: UserAcceptance): Promise<number> {
  const pool = await getConnection();
  const [result] = await pool.execute(
    'INSERT INTO UserAcceptance (full_name, email, terms_accepted, safeguarding_accepted, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
    [acceptance.full_name, acceptance.email, acceptance.terms_accepted, acceptance.safeguarding_accepted, acceptance.ip_address, acceptance.user_agent]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

// DeviceDetails operations for captive portal
export interface DeviceDetails {
  id?: number;
  user_acceptance_id?: number;
  mac_address?: string;
  ap_mac_address?: string;
  ssid?: string;
  original_url?: string;
  device_name?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

export async function createDeviceDetails(device: DeviceDetails): Promise<number> {
  const pool = await getConnection();
  const [result] = await pool.execute(
    'INSERT INTO DeviceDetails (user_acceptance_id, mac_address, ap_mac_address, ssid, original_url, device_name, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [device.user_acceptance_id, device.mac_address, device.ap_mac_address, device.ssid, device.original_url, device.device_name, device.ip_address, device.user_agent]
  );
  return (result as mysql.ResultSetHeader).insertId;
}

// Captive portal acceptance function
export async function logCaptivePortalAcceptance(
  fullName: string,
  email: string,
  ipAddress: string,
  userAgent: string,
  deviceDetails: {
    macAddress?: string;
    apMacAddress?: string;
    ssid?: string;
    originalUrl?: string;
    deviceName?: string;
  }
): Promise<{ userAcceptanceId: number; deviceDetailsId: number }> {
  const pool = await getConnection();

  // Start transaction
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Create user acceptance record
    const [acceptanceResult] = await connection.execute(
      'INSERT INTO UserAcceptance (full_name, email, terms_accepted, safeguarding_accepted, ip_address, user_agent) VALUES (?, ?, TRUE, TRUE, ?, ?)',
      [fullName, email, ipAddress, userAgent]
    );
    const userAcceptanceId = (acceptanceResult as mysql.ResultSetHeader).insertId;

    // Create device details record - convert undefined to null
    const [deviceResult] = await connection.execute(
      'INSERT INTO DeviceDetails (user_acceptance_id, mac_address, ap_mac_address, ssid, original_url, device_name, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userAcceptanceId,
        deviceDetails.macAddress || null,
        deviceDetails.apMacAddress || null,
        deviceDetails.ssid || null,
        deviceDetails.originalUrl || null,
        deviceDetails.deviceName || null,
        ipAddress,
        userAgent
      ]
    );
    const deviceDetailsId = (deviceResult as mysql.ResultSetHeader).insertId;

    // Commit transaction
    await connection.commit();
    connection.release();

    return { userAcceptanceId, deviceDetailsId };
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    connection.release();
    throw error;
  }
}

// Close the connection pool
export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
} 