-- Create database
CREATE DATABASE IF NOT EXISTS CaptivePortal;
USE CaptivePortal;

-- Create Tenant table
CREATE TABLE IF NOT EXISTS Tenant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organisation_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create users table (for registered users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    mac_address VARCHAR(17),
    ip_address VARCHAR(45),
    device_name VARCHAR(255),
    terms_accepted BOOLEAN DEFAULT FALSE,
    safeguarding_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_seen TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(id)
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create access_logs table
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create UserAcceptance table for captive portal users
CREATE TABLE IF NOT EXISTS UserAcceptance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    terms_accepted BOOLEAN DEFAULT TRUE,
    safeguarding_accepted BOOLEAN DEFAULT TRUE,
    accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create DeviceDetails table for device information
CREATE TABLE IF NOT EXISTS DeviceDetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_acceptance_id INT,
    mac_address VARCHAR(17),
    ap_mac_address VARCHAR(17),
    ssid VARCHAR(255),
    original_url TEXT,
    device_name VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_acceptance_id) REFERENCES UserAcceptance(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mac_address ON users(mac_address);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_created_at ON access_logs(created_at);
CREATE INDEX idx_user_acceptance_email ON UserAcceptance(email);
CREATE INDEX idx_user_acceptance_accepted_at ON UserAcceptance(accepted_at);
CREATE INDEX idx_device_details_mac_address ON DeviceDetails(mac_address);
CREATE INDEX idx_device_details_user_acceptance_id ON DeviceDetails(user_acceptance_id);

-- Insert some default settings
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'Euxton Methodist Church', 'Name of the church site'),
('wifi_ssid', 'ChurchWiFi', 'Default WiFi SSID'),
('session_timeout_hours', '24', 'Session timeout in hours'),
('max_devices_per_user', '3', 'Maximum devices allowed per user');

-- Grant permissions to the captive user
GRANT ALL PRIVILEGES ON CaptivePortal.* TO 'captiveuser'@'%';
FLUSH PRIVILEGES; 