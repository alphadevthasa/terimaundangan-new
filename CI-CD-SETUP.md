# CI/CD Setup Guide - VPS Hetzner Deployment

## Overview

Project ini menggunakan **GitHub Actions** untuk Continuous Integration dan Continuous Deployment langsung ke VPS Hetzner tanpa perlu SSH manual.

## Workflows

### 1. CI (Continuous Integration)
**File:** `.github/workflows/ci.yml`

**Trigger:** Pull request ke `main/master` atau push ke `main/master`

**Steps:**
- Checkout code
- Setup Node.js 18
- Install dependencies (`npm ci`)
- Run lint (`npm run lint`)
- Generate Prisma Client
- Build application
- Upload build artifacts

### 2. CD (Continuous Deployment)
**File:** `.github/workflows/cd.yml`

**Trigger:** Push ke `main/master` atau manual trigger

**Deploy target:** VPS Hetzner via SSH

---

## Setup VPS Hetzner

### 1. Persiapan VPS

SSH ke VPS dan jalankan:

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (untuk reverse proxy, recommended)
apt install -y nginx

# Install Git
apt install -y git

# Install certbot (untuk SSL)
apt install -y certbot python3-certbot-nginx

# Create app directory
mkdir -p /opt/enginetemplate
mkdir -p /opt/enginetemplate/backup
```

### 2. Setup SSH Key untuk GitHub Actions

Di VPS:
```bash
# Buat SSH key khusus untuk GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions@enginetemplate" -f /root/.ssh/github_actions_key -N ""

# Add public key ke authorized_keys
cat /root/.ssh/github_actions_key.pub >> /root/.ssh/authorized_keys

# Set permissions
chmod 600 /root/.ssh/authorized_keys
chmod 600 /root/.ssh/github_actions_key
```

Catat **private key** yang dihasilkan:
```bash
cat /root/.ssh/github_actions_key
```

### 3. Setup GitHub Secrets

Tambahkan secrets berikut di repository GitHub:
`Settings → Secrets and variables → Actions → New repository secret`

| Secret | Description |
|--------|-------------|
| `VPS_HOST` | IP address atau domain VPS Hetzner (contoh: `123.45.67.89`) |
| `VPS_USER` | User untuk SSH (biasanya `root`) |
| `VPS_SSH_PRIVATE_KEY` | Private SSH key dari langkah 2 |

### 4. Deploy Aplikasi Pertama Kali

Di VPS:
```bash
cd /opt/enginetemplate

# Clone repository
git clone https://github.com/YOUR_USERNAME/enginetemplate.git .

# Install dependencies
npm ci

# Copy dan edit .env
cp .env.example .env
nano .env

# Generate Prisma Client dan run migrations
npx prisma generate
npx prisma migrate deploy

# Start aplikasi dengan PM2
pm2 start npm --name "enginetemplate" -- start
pm2 save
pm2 startup
```

### 5. Konfigurasi Nginx (Recommended)

Copy nginx.conf dari project ke VPS:
```bash
scp nginx.conf root@your-vps-ip:/etc/nginx/sites-available/enginetemplate
ln -s /etc/nginx/sites-available/enginetemplate /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Edit nginx.conf dan ganti `your-domain.com` dengan domain yang sebenarnya.

Setup SSL dengan Let's Encrypt:
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 6. Setup Firewall

```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

---

## Cara Kerja Deployment

Setiap kali ada **push ke branch `main` atau `master`**:

1. **GitHub Actions** jalan otomatis
2. Install dependencies & build aplikasi
3. Upload build artifacts + deploy script ke VPS
4. SSH ke VPS jalankan:
   - Backup versi lama
   - Extract versi baru
   - Run database migrations
   - Restart aplikasi dengan PM2

**Tidak perlu SSH manual lagi.**

---

## Monitoring & Maintenance

### PM2 Commands (di VPS)

```bash
# Check status
pm2 status

# View logs
pm2 logs enginetemplate

# Restart app
pm2 restart enginetemplate

# Stop app
pm2 stop enginetemplate

# Monitor
pm2 monit
```

### Manual Deployment

Jika ingin deploy manual tanpa push ke GitHub:

```bash
# Di VPS:
cd /opt/enginetemplate
git pull origin main
npm ci
npm run build
npx prisma migrate deploy
pm2 restart enginetemplate
```

### Database Backup

Setup backup otomatis PostgreSQL:

```bash
# Buat backup script
cat > /opt/enginetemplate/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/enginetemplate/backup/db"
mkdir -p $BACKUP_DIR
pg_dump $DATABASE_URL > $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF

chmod +x /opt/enginetemplate/backup-db.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; "0 2 * * * /opt/enginetemplate/backup-db.sh") | crontab -
```

---

## First Time Setup Checklist

- [ ] SSH ke VPS dan install dependencies (Node.js, PM2, Nginx)
- [ ] Generate SSH key di VPS untuk GitHub Actions
- [ ] Tambah GitHub secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_PRIVATE_KEY`)
- [ ] Clone repo ke `/opt/enginetemplate` di VPS
- [ ] Setup `.env` file di VPS
- [ ] Run `npx prisma migrate deploy` di VPS
- [ ] Start aplikasi dengan PM2: `pm2 start npm --name "enginetemplate" -- start`
- [ ] Setup Nginx + SSL
- [ ] Push ke `main/master` untuk test deployment

---

## Troubleshooting

### Deployment Failed
- Cek logs GitHub Actions
- Pastikan SSH key benar di GitHub secrets
- Cek VPS bisa diakses: `ssh root@your-vps-ip`

### App Crash
- Cek logs: `pm2 logs enginetemplate`
- Cek environment variables: `.env` file di VPS
- Pastikan database migration berhasil

### Database Connection Error
- Cek `DATABASE_URL` di `.env`
- Pastikan PostgreSQL running di VPS

### Port 3000 already in use
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart enginetemplate
```

---

## Rollback

Jika terjadi masalah dengan deployment terbaru:

1. Via GitHub Actions - trigger `workflow_dispatch` dengan commit sebelumnya
2. Atau manual di VPS:
   ```bash
   cd /opt/enginetemplate
   LATEST_BACKUP=$(ls -t backup/backup-*.tar.gz | head -1)
   tar -xzf $LATEST_BACKUP
   pm2 restart enginetemplate
   ```
