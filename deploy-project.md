# Complete Deployment Guide: Express.js Project on Vercel, Render, and VPS

## Table of Contents
1. Overview of Deployment Options
2. Pre-Deployment Preparation
3. Deploying on Vercel
4. Deploying on Render
5. Deploying on VPS Server
6. Environment Variables Management
7. Database Configuration for Production
8. File Upload Handling in Production
9. Performance Optimization
10. Monitoring and Logging
11. Troubleshooting Deployment Issues
12. Security Best Practices
13. CI/CD Pipeline Setup
14. Cost Comparison and Recommendations

---

## Overview of Deployment Options

Deploying an Express.js application requires choosing the right hosting platform based on your needs. Each platform offers different benefits, pricing models, and complexity levels.

### Vercel

Vercel is ideal for serverless deployments with automatic scaling. It works best for APIs with low to medium traffic. The free tier includes 100GB bandwidth monthly. Deployment is instant with Git integration. Cold starts can add 1-2 seconds latency.

### Render

Render offers traditional server deployments with free SSL certificates. It provides 512MB RAM on the free tier. Services sleep after 15 minutes of inactivity. Perfect for staging environments and low-traffic production apps.

### VPS Server

A Virtual Private Server gives you complete control over your environment. You can install any software and configure everything manually. Costs start at 5 to 10 dollars monthly. Requires Linux administration knowledge. Best for high-traffic applications with specific requirements.

---

## Pre-Deployment Preparation

### Step 1: Update Package.json Scripts

Your package.json needs proper scripts for production deployment.

```json
{
  "name": "express-api-server",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "vercel-build": "npm run build",
    "render-build": "npm install && npm run build",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "postbuild": "echo Build completed successfully"
  }
}
```

### Step 2: Update TypeScript Configuration

Ensure your tsconfig.json is configured for production output.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Step 3: Create Production Entry Point

Ensure your server.ts properly exports the app for serverless environments.

```typescript
// src/server.ts
import app from './app';
import config from './config';
import mongoose from 'mongoose';

// For traditional server deployment
if (process.env.NODE_ENV !== 'vercel') {
  const startServer = async () => {
    try {
      await mongoose.connect(config.database_url as string);
      console.log('Database connected successfully');
      
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}

// Export for Vercel serverless functions
export default app;
```

### Step 4: Create .gitignore File

Prevent sensitive files and large directories from being committed.

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build output
dist/
build/
.next/

# Environment files
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp

# Temporary files
tmp/
temp/
uploads/

# Testing
coverage/
.nyc_output/

# Vercel
.vercel/
```

---

## Deploying on Vercel

### Vercel Configuration File

Create a vercel.json file in your project root.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "dist/server.js": {
      "maxDuration": 10,
      "memory": 1024
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Deployment via Vercel CLI

Install Vercel CLI globally on your machine.

```bash
npm install -g vercel
```

Login to your Vercel account through the CLI.

```bash
vercel login
```

Navigate to your project directory and run the deployment command.

```bash
cd your-express-project
vercel
```

Follow the interactive prompts. Select your project scope. Link to an existing project or create a new one. Choose the production branch. Wait for deployment to complete.

For production deployment with environment variables.

```bash
vercel --prod
```

Add environment variables during deployment.

```bash
vercel env add DATABASE_URL
vercel env add GEMINI_API_KEY
vercel env add CLOUDINARY_CLOUD_NAME
```

List all environment variables.

```bash
vercel env ls
```

Remove an environment variable.

```bash
vercel env rm DATABASE_URL
```

### Deployment via GitHub Integration

Push your code to a GitHub repository.

```bash
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

Go to vercel.com and sign in with GitHub. Click Add New Project. Import your GitHub repository. Configure the project settings.

Set the build command to npm run vercel-build. Set the output directory to dist. Add environment variables in the Vercel dashboard.

Click Deploy. Vercel will automatically deploy every push to your main branch.

### Vercel Configuration for MongoDB Connections

Since Vercel serverless functions have connection limits, implement connection caching.

```typescript
// src/config/database.ts
import mongoose from 'mongoose';
import config from '.';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  
  try {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
    console.log('New database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

// Close connection when function completes
export const disconnectFromDatabase = async () => {
  if (isConnected && process.env.NODE_ENV === 'vercel') {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Database connection closed');
  }
};
```

### Handling File Uploads on Vercel

Vercel does not support local file storage. Use Cloudinary for all file uploads.

```typescript
// middleware/upload.ts
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Use memory storage instead of disk storage on Vercel
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

export const uploadToCloudinaryFromBuffer = async (buffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    ).end(buffer);
  });
};

export const uploadImageSingle = (fieldName: string) => {
  return [
    upload.single(fieldName),
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) return next();
      
      try {
        const imageUrl = await uploadToCloudinaryFromBuffer(
          req.file.buffer,
          'mern_setup'
        );
        req.body[fieldName] = imageUrl;
        next();
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Upload failed' });
      }
    }
  ];
};
```

---

## Deploying on Render

### Create render.yaml Configuration

Create a render.yaml file for infrastructure as code.

```yaml
services:
  - type: web
    name: express-api-server
    runtime: node
    plan: free
    buildCommand: npm run render-build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: mongodb
          property: connectionString
      - key: GEMINI_API_KEY
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
    healthCheckPath: /health
    autoDeploy: true
    domains:
      - api.yourdomain.com
```

### Deployment via Render Dashboard

Go to render.com and sign up for an account. Click New Web Service. Connect your GitHub or GitLab repository. Select your Express project.

Configure the service name and region. Set build command to npm run render-build. Set start command to npm start. Select the free plan or choose a paid plan.

Add environment variables in the dashboard. Click Create Web Service. Render will automatically deploy your application.

### Deployment via Render CLI

Install the Render CLI tool.

```bash
npm install -g @render/cli
```

Login to your Render account.

```bash
render login
```

Deploy your project.

```bash
render deploy
```

### Handling Sleep on Free Tier

Render free tier services sleep after 15 minutes of inactivity. Implement a keep-alive mechanism.

```typescript
// src/utils/keepAlive.ts
import axios from 'axios';

const keepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com';
  
  setInterval(async () => {
    try {
      await axios.get(`${url}/health`);
      console.log('Keep-alive ping sent');
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, 14 * 60 * 1000); // Every 14 minutes
};

if (process.env.NODE_ENV === 'production') {
  keepAlive();
}
```

### Database Connection for Render

Render provides managed MongoDB databases. Use connection pooling for better performance.

```typescript
// src/config/database.ts
import mongoose from 'mongoose';

const connectWithRetry = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.DATABASE_URL as string, {
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000
      });
      console.log('Database connected successfully');
      return;
    } catch (error) {
      console.log(`Connection attempt ${i + 1} failed. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  console.error('Failed to connect to database after multiple attempts');
  process.exit(1);
};

connectWithRetry();
```

---

## Deploying on VPS Server

### VPS Requirements

Choose a VPS provider like DigitalOcean, Linode, Vultr, or AWS EC2. Minimum requirements are 1GB RAM and 1 CPU core. Ubuntu 22.04 LTS is recommended. Cost ranges from 5 to 10 dollars monthly.

### Step 1: Connect to Your VPS

SSH into your server using the root credentials.

```bash
ssh root@your-server-ip
```

### Step 2: Update System Packages

Update the package manager and install essential tools.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx certbot python3-certbot-nginx
```

### Step 3: Install Node.js

Install Node.js 20.x LTS version.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

### Step 4: Install PM2 Process Manager

PM2 keeps your application running continuously.

```bash
sudo npm install -g pm2
```

### Step 5: Clone Your Repository

Create a directory and clone your project.

```bash
mkdir -p /var/www/express-api
cd /var/www/express-api
git clone https://github.com/yourusername/your-repo.git .
```

### Step 6: Install Dependencies and Build

Install production dependencies and build the TypeScript code.

```bash
npm install --production
npm run build
```

### Step 7: Create Environment File

Create a .env file with production variables.

```bash
nano .env
```

Add your environment variables.

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://yourfrontend.com
```

### Step 8: Start Application with PM2

Start your application using PM2.

```bash
pm2 start dist/server.js --name express-api
pm2 save
pm2 startup
```

Run the command that appears after pm2 startup to enable auto-restart on server reboot.

### Step 9: PM2 Management Commands

Monitor your application.

```bash
pm2 status
pm2 logs express-api
pm2 monit
pm2 restart express-api
pm2 stop express-api
pm2 delete express-api
```

### Step 10: Configure Nginx as Reverse Proxy

Create an Nginx configuration file.

```bash
sudo nano /etc/nginx/sites-available/express-api
```

Add the following configuration.

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 10M;
}
```

Enable the site and test configuration.

```bash
sudo ln -s /etc/nginx/sites-available/express-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 11: Install SSL Certificate with Let's Encrypt

Obtain a free SSL certificate for HTTPS.

```bash
sudo certbot --nginx -d api.yourdomain.com
```

Auto-renewal is configured automatically. Test renewal.

```bash
sudo certbot renew --dry-run
```

### Step 12: Configure Firewall

Set up UFW firewall rules.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000
sudo ufw --force enable
```

### Step 13: Set Up MongoDB on VPS (Optional)

If not using MongoDB Atlas, install MongoDB on your VPS.

```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 14: Automated Deployment Script

Create a deployment script for easy updates.

```bash
nano deploy.sh
```

```bash
#!/bin/bash

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install --production

echo "Building TypeScript..."
npm run build

echo "Restarting PM2 process..."
pm2 restart express-api

echo "Deployment complete!"
```

Make the script executable.

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Environment Variables Management

### Environment Variable Structure

Create separate environment files for different stages.

```typescript
// src/config/index.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : process.env.NODE_ENV === 'staging' 
    ? '.env.staging' 
    : '.env.development';

dotenv.config({ path: path.join(process.cwd(), envFile) });

export default {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  database_url: process.env.DATABASE_URL,
  
  // JWT Configuration
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Cloudinary
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  
  // Gemini AI
  gemini_api_key: process.env.GEMINI_API_KEY,
  
  // Email
  email_host: process.env.EMAIL_HOST,
  email_port: parseInt(process.env.EMAIL_PORT || '587'),
  user_email: process.env.USER_EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  
  // Frontend URLs
  frontend_url: process.env.FRONTEND_URL,
  dashboard_url: process.env.DASHBOARD_URL,
  
  // SSLCommerz
  sslcommerz_store_id: process.env.SSLCOMMERZ_STORE_ID,
  sslcommerz_store_password: process.env.SSLCOMMERZ_STORE_PASSWORD,
  sslcommerz_is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true'
};
```

### Sample Environment Files

**.env.development**

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://localhost:27017/myapp_dev
JWT_ACCESS_SECRET=dev_secret_key
JWT_REFRESH_SECRET=dev_refresh_key
FRONTEND_URL=http://localhost:3000
```

**.env.production**

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/myapp_prod
JWT_ACCESS_SECRET=complex_production_secret_here
JWT_REFRESH_SECRET=another_complex_secret_here
FRONTEND_URL=https://yourdomain.com
```

---

## Database Configuration for Production

### MongoDB Connection with Retry Logic

```typescript
// src/config/database.ts
import mongoose from 'mongoose';
import config from '.';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;
  
  private constructor() {}
  
  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
  
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Using existing database connection');
      return;
    }
    
    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4
    };
    
    try {
      await mongoose.connect(config.database_url as string, options);
      this.isConnected = true;
      console.log('Database connected successfully');
      
      mongoose.connection.on('error', (error) => {
        console.error('Database connection error:', error);
        this.isConnected = false;
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('Database disconnected');
        this.isConnected = false;
      });
      
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    
    await mongoose.disconnect();
    this.isConnected = false;
    console.log('Database disconnected');
  }
}

export default DatabaseConnection.getInstance();
```

### Connection Pool Monitoring

```typescript
// Add monitoring for connection pool
setInterval(() => {
  const connection = mongoose.connection;
  if (connection && connection.readyState === 1) {
    console.log(`Connection pool size: ${connection.connections?.length || 0}`);
  }
}, 60000);
```

---

## File Upload Handling in Production

### Cloudinary Configuration for Production

```typescript
// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import config from '.';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  options: any = {}
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
```

### Multer Configuration for Serverless

```typescript
// src/middleware/multer.config.ts
import multer from 'multer';

// Use memory storage for all production environments
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // Maximum 10 files per request
  }
});
```

---

## Performance Optimization

### Compression and Caching

```typescript
// src/app.ts
import compression from 'compression';
import express from 'express';

// Enable compression for all responses
app.use(compression({
  level: 6,
  threshold: 1024, // Compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Response caching for static responses
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

### Rate Limiting

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: 'Rate limit exceeded. Please slow down your requests.'
});
```

### Helmet Security Headers

```typescript
// src/app.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://api.gemini.google.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## Monitoring and Logging

### Winston Logger Configuration

```typescript
// src/utils/logger.ts
import winston from 'winston';
import path from 'path';

const logDir = 'logs';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
```

### Health Check Endpoint

```typescript
// src/controllers/health.controller.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheck = async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      name: mongoose.connection.name,
      host: mongoose.connection.host
    },
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
  
  const isHealthy = health.database.status === 'connected';
  
  res.status(isHealthy ? 200 : 503).json(health);
};

export const metrics = async (req: Request, res: Response) => {
  const metrics = {
    requests: {
      total: 0,
      successful: 0,
      failed: 0
    },
    responseTime: {
      avg: 0,
      p95: 0,
      p99: 0
    }
  };
  
  res.json(metrics);
};
```

---

## Troubleshooting Deployment Issues

### Common Vercel Issues

**Issue:** Module not found errors after deployment

**Solution:** Ensure all dependencies are in dependencies not devDependencies. Run npm install --production locally to test.

**Issue:** Database connection timeout

**Solution:** Use connection caching. Implement retry logic. Increase server selection timeout.

**Issue:** File uploads failing

**Solution:** Use memory storage instead of disk storage. Upload directly to Cloudinary from buffer.

### Common Render Issues

**Issue:** Application sleeps and takes time to wake up

**Solution:** Implement keep-alive pings. Upgrade to paid plan for no sleep.

**Issue:** Build fails with out of memory

**Solution:** Reduce TypeScript target. Split build into smaller chunks. Upgrade to paid plan.

### Common VPS Issues

**Issue:** Port already in use

**Solution:** Kill process using the port or change PORT in .env.

```bash
sudo lsof -i :5000
sudo kill -9 PID
```

**Issue:** Nginx 502 Bad Gateway

**Solution:** Check if Node app is running. Verify Nginx proxy_pass URL. Check firewall settings.

```bash
pm2 status
sudo nginx -t
sudo systemctl restart nginx
```

**Issue:** MongoDB connection refused

**Solution:** Check MongoDB service status. Verify bindIp in mongod.conf. Check firewall rules.

```bash
sudo systemctl status mongodb
sudo ufw status
```

---

## Security Best Practices

### Environment Security

Never commit .env files to version control. Use different secrets for development and production. Rotate secrets regularly. Use secret management services for production.

### API Security

Validate all user inputs. Sanitize database queries to prevent injection. Implement rate limiting for all endpoints. Use HTTPS in production. Enable CORS only for trusted origins.

### Dependencies Security

Run npm audit regularly to check for vulnerabilities.

```bash
npm audit
npm audit fix
```

Use Snyk or similar tools for continuous monitoring. Keep all dependencies updated.

### Deployment Security Script

```bash
#!/bin/bash
# security-check.sh

echo "Running security checks..."

# Check for vulnerable dependencies
npm audit --production

# Check for exposed environment variables
grep -r "process.env" src/ --exclude-dir=node_modules

# Check for hardcoded secrets
grep -r "secret\|key\|token\|password" src/ --exclude-dir=node_modules

echo "Security check completed"
```

---

## CI/CD Pipeline Setup

### GitHub Actions Workflow

Create .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-vps:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/express-api
            git pull
            npm install --production
            npm run build
            pm2 restart express-api
```

---

## Cost Comparison and Recommendations

### Platform Comparison

**Vercel Free Tier:** 100GB bandwidth, 1GB memory, 10 second timeout. Best for low-traffic APIs and serverless needs. Cold starts add latency.

**Render Free Tier:** 512MB RAM, sleeps after 15 minutes. Best for staging environments. Not recommended for production with traffic.

**VPS 5 Dollar Plan:** 1GB RAM, 25GB storage, 1TB bandwidth. Complete control, no cold starts. Requires Linux administration knowledge.

### Recommendations

For personal projects and prototypes, start with Vercel free tier. It is simple and cost-effective.

For production applications with moderate traffic, use a 5 to 10 dollar VPS. You get consistent performance and full control.

For enterprise applications with high traffic, combine Vercel for frontend and VPS for backend. Use CDN and load balancing.

For teams without DevOps expertise, choose Render paid plans starting at 7 dollars. They handle server management for you.

---

## Summary

Deploying your Express.js application can be done on multiple platforms depending on your needs.

**For Vercel:** Use vercel.json configuration. Deploy via CLI or GitHub integration. Handle file uploads with Cloudinary. Implement database connection caching.

**For Render:** Create render.yaml or use dashboard. Handle sleep with keep-alive pings. Use environment variables for configuration.

**For VPS:** Set up Node.js, PM2, Nginx, and SSL. Configure firewall and database. Use automated deployment scripts.

**Quick deployment checklist:**

Build your TypeScript code with npm run build. Set production environment variables. Configure database connection pooling. Use Cloudinary for file uploads. Implement logging and monitoring. Set up health check endpoints. Configure rate limiting for security.

Your Express application is now ready for production deployment on any platform. Choose the option that best fits your budget and technical requirements.
