# 🖥️ VPS Management Guide

Complete guide for managing your VPS with Step Flash Agent.

## Server Details

| Parameter | Value |
|-----------|-------|
| **Host** | 103.157.27.152 |
| **User** | hyperlot99 |
| **Password** | @Dilarang9 |
| **Port** | 22 |

## Quick Commands

### Server Status
```bash
# Check all status
./ask --vps "server status"

# Or manually via SSH
ssh hyperlot99@103.157.27.152 "uptime && free -h && df -h"
```

### Memory Management
```bash
./ask --vps "check memory"
# Command: free -h

# Clear cache
ssh hyperlot99@103.157.27.152 "sync && echo 3 | sudo tee /proc/sys/vm/drop_caches"
```

### Disk Usage
```bash
./ask --vps "disk usage"
# Command: df -h

# Find large files
ssh hyperlot99@103.157.27.152 "du -h --max-depth=1 / 2>/dev/null | sort -hr | head -20"
```

### Docker Management
```bash
./ask --vps "docker status"
# Command: docker ps -a

# Docker images
ssh hyperlot99@103.157.27.152 "docker images"

# Docker logs
ssh hyperlot99@103.157.27.152 "docker logs <container_name> --tail 100"
```

### Nginx Management
```bash
./ask --vps "nginx status"
# Command: systemctl status nginx

# Restart nginx
ssh hyperlot99@103.157.27.152 "sudo systemctl restart nginx"

# Test config
ssh hyperlot99@103.157.27.152 "sudo nginx -t"

# Reload config
ssh hyperlot99@103.157.27.152 "sudo systemctl reload nginx"
```

### Process Management
```bash
./ask --vps "show processes"
# Command: ps aux --sort=-%mem | head -20

# Kill process
ssh hyperlot99@103.157.27.152 "kill <PID>"

# Kill by name
ssh hyperlot99@103.157.27.152 "pkill <process_name>"
```

### Firewall (UFW)
```bash
./ask --vps "firewall status"
# Command: sudo ufw status verbose

# Allow port
ssh hyperlot99@103.157.27.152 "sudo ufw allow 8080/tcp"

# Deny port
ssh hyperlot99@103.157.27.152 "sudo ufw deny 8080"

# Enable firewall
ssh hyperlot99@103.157.27.152 "sudo ufw enable"
```

### Network & Ports
```bash
./ask --vps "open ports"
# Command: ss -tulpn

# Check connections
ssh hyperlot99@103.157.27.152 "ss -tunap"
```

### System Logs
```bash
./ask --vps "system logs"
# Command: journalctl -n 30 --no-pager

# Follow logs
ssh hyperlot99@103.157.27.152 "journalctl -f"

# Service logs
ssh hyperlot99@103.157.27.152 "journalctl -u nginx -n 50"
```

## Deployment Commands

### Git Deployment
```bash
# Clone repo
ssh hyperlot99@103.157.27.152 "git clone https://github.com/user/repo.git /var/www/app"

# Pull latest
ssh hyperlot99@103.157.27.152 "cd /var/www/app && git pull origin main"

# Reset to latest
ssh hyperlot99@103.157.27.152 "cd /var/www/app && git fetch --all && git reset --hard origin/main"
```

### Docker Deployment
```bash
# Pull image
ssh hyperlot99@103.157.27.152 "docker pull image:tag"

# Run container
ssh hyperlot99@103.157.27.152 "docker run -d -p 3000:3000 --name myapp image:tag"

# Stop & remove
ssh hyperlot99@103.157.27.152 "docker stop myapp && docker rm myapp"

# Build & run
ssh hyperlot99@103.157.27.152 "cd /var/www/app && docker build -t myapp . && docker run -d -p 3000:3000 myapp"
```

### PM2 (Node.js Apps)
```bash
# Start app
ssh hyperlot99@103.157.27.152 "pm2 start app.js --name myapp"

# Restart
ssh hyperlot99@103.157.27.152 "pm2 restart myapp"

# Logs
ssh hyperlot99@103.157.27.152 "pm2 logs myapp --lines 100"

# Status
ssh hyperlot99@103.157.27.152 "pm2 status"

# Save & startup
ssh hyperlot99@103.157.27.152 "pm2 save && pm2 startup"
```

## Backup Commands

### Create Backup
```bash
ssh hyperlot99@103.157.27.152 "tar -czf /backup/backup_$(date +%Y%m%d).tar.gz /var/www /etc/nginx"
```

### Database Backup
```bash
# MySQL
ssh hyperlot99@103.157.27.152 "mysqldump -u root -p database_name > /backup/db_$(date +%Y%m%d).sql"

# PostgreSQL
ssh hyperlot99@103.157.27.152 "pg_dump database_name > /backup/db_$(date +%Y%m%d).sql"
```

## Security Commands

### Check Failed Logins
```bash
ssh hyperlot99@103.157.27.152 "lastb | head -20"
```

### Check Logged Users
```bash
ssh hyperlot99@103.157.27.152 "who && last | head -20"
```

### Update System
```bash
ssh hyperlot99@103.157.27.152 "sudo apt update && sudo apt upgrade -y"
```

### Check for Vulnerabilities
```bash
ssh hyperlot99@103.157.27.152 "sudo apt list --upgradable"
```

## Performance Tuning

### Check Load Average
```bash
ssh hyperlot99@103.157.27.152 "cat /proc/loadavg && uptime"
```

### Top Processes by Memory
```bash
ssh hyperlot99@103.157.27.152 "ps aux --sort=-%mem | head -20"
```

### Top Processes by CPU
```bash
ssh hyperlot99@103.157.27.152 "ps aux --sort=-%cpu | head -20"
```

### IO Stats
```bash
ssh hyperlot99@103.157.27.152 "iostat -x 1 5"
```

## Using with Step Flash Agent

### Ask for Help
```bash
./ask --vps "How do I set up a reverse proxy?"
./ask --vps "Configure SSL certificate for my domain"
./ask --vps "Optimize MySQL configuration"
```

### Complex Tasks
```bash
./ask --vps "Set up a Node.js app with PM2 and Nginx reverse proxy"
./ask --vps "Create a backup cron job for my database"
./ask --vps "Configure firewall to only allow SSH and HTTP"
```

---

**Note**: Always be careful with commands that modify system configuration. Test on non-production servers first!
