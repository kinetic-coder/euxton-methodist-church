# Docker Setup for Euxton Methodist Church

This setup allows you to run the Next.js application with nginx as a reverse proxy and MySQL database, making it accessible from the internet.

## Prerequisites

- Docker and Docker Compose installed
- Environment variables configured (see below)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Site Manager API
SITE_MANAGER_API_KEY=your_api_key_here
SITE_MANAGER_URL=your_api_url_here

# MySQL Database
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USER=captiveuser
MYSQL_PASSWORD=your_secure_password
```

## Database Setup

The MySQL container will automatically:
- Create a database called `CaptivePortal`
- Create the following tables:
  - `users` - Store user information and acceptance status
  - `sessions` - Track user sessions
  - `access_logs` - Audit trail for user actions
  - `settings` - Application configuration

## Quick Start

1. **Build and start the services:**
   ```bash
   docker-compose up -d
   ```

2. **Check the status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f nextjs
   docker-compose logs -f nginx
   docker-compose logs -f mysql
   ```

4. **Access your application:**
   - Local: http://localhost
   - From internet: http://your-server-ip
   - Database test: http://localhost/api/database-test

## Database Access

- **Host**: localhost (or your server IP)
- **Port**: 3306
- **Database**: CaptivePortal
- **User**: captiveuser (or your custom user)
- **Password**: Your MYSQL_PASSWORD

### Connect to MySQL from command line:
```bash
docker-compose exec mysql mysql -u captiveuser -p CaptivePortal
```

### Connect to MySQL from external tools:
- Host: localhost (or your server IP)
- Port: 3306
- Database: CaptivePortal
- Username: captiveuser
- Password: Your MYSQL_PASSWORD

## Stopping the Services

```bash
docker-compose down
```

## Rebuilding

If you make changes to the code:

```bash
docker-compose down
docker-compose up -d --build
```

## Health Checks

- Next.js app: http://localhost/health
- Nginx: http://localhost/health
- Database test: http://localhost/api/database-test

## Port Configuration

- **Port 80**: HTTP traffic (nginx)
- **Port 443**: HTTPS traffic (for future SSL setup)
- **Port 3306**: MySQL database

## Network Configuration

The setup uses a custom bridge network (`app-network`) for secure communication between containers.

## Data Persistence

- **MySQL data**: Stored in Docker volume `mysql_data`
- **Nginx logs**: Stored in `./logs/nginx/` directory

## Troubleshooting

1. **Check if containers are running:**
   ```bash
   docker-compose ps
   ```

2. **Check container logs:**
   ```bash
   docker-compose logs nextjs
   docker-compose logs nginx
   docker-compose logs mysql
   ```

3. **Access container shell:**
   ```bash
   docker-compose exec nextjs sh
   docker-compose exec nginx sh
   docker-compose exec mysql mysql -u root -p
   ```

4. **Restart services:**
   ```bash
   docker-compose restart
   ```

5. **Reset database (WARNING: This will delete all data):**
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## Security Features

- Rate limiting on API routes
- Security headers
- Gzip compression
- Proper proxy headers
- Database user with limited privileges
- Secure password configuration

## Production Considerations

1. **SSL/HTTPS**: Add SSL certificates and configure nginx for HTTPS
2. **Domain**: Configure your domain name in nginx configuration
3. **Monitoring**: Set up monitoring and alerting
4. **Backup**: Implement backup strategies for your database
5. **Firewall**: Configure your server's firewall to only allow necessary ports
6. **Database Security**: Use strong passwords and consider external database hosting for production
7. **Environment Variables**: Use secure environment variable management in production 