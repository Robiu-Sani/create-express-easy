

# 📚 Complete Environment Setup Documentation

## 📋 Table of Contents
1. [Quick Start Guide](#quick-start-guide)
2. [Environment Configuration](#environment-configuration)
3. [MongoDB Atlas Setup (Cloud)](#mongodb-atlas-setup-cloud)
4. [Local MongoDB Setup](#local-mongodb-setup-alternative)
5. [JWT & Security Configuration](#jwt--security-configuration)
6. [Email Configuration (Gmail)](#email-configuration-gmail)
7. [Cloudinary Setup (Image Hosting)](#cloudinary-setup-image-hosting)
8. [FreeImageHost Setup (Alternative)](#freeimagehost-setup-alternative)
9. [Google Gemini AI Setup](#google-gemini-ai-setup)
10. [Complete .env File Example](#complete-env-file-example)
11. [Environment Validation & Configuration](#environment-validation--configuration)
12. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## 🚀 Quick Start Guide

### Step 1: Navigate to Your Project
```bash
cd your-project-name
```

### Step 2: Open in Your Code Editor
```bash
code .
```

### Step 3: Create Environment File
```bash
# Copy the example file
cp .env.example .env
```

### Step 4: Basic Configuration (Minimum Required)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

> **📌 Important:** Delete the `.env.example` file after copying or keep it as a reference for team members.

---

## 🔧 Environment Configuration

### Creating the `.env` File

The `.env` file stores all sensitive credentials and configuration values. **Never commit this file to version control.**

```bash
# Linux/macOS
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

### Basic Server Configuration
```env
# ====================
# SERVER CONFIGURATION
# ====================
PORT=5000                    # Port where your server will run
NODE_ENV=development         # 'development', 'production', or 'test'
FRONTEND_URL=http://localhost:3000   # Your React/Vue/Angular app URL
BACKEND_URL=http://localhost:5000    # Your backend API URL
```

### Generate Secure Random Strings
Run this command in your terminal to generate cryptographically secure random strings:

```bash
# Generate a 64-byte (128 character) hex string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate a 32-byte (64 character) hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example Output:**
```
a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2
```

---

## 🗄️ MongoDB Atlas Setup (Cloud)

### Step-by-Step Setup Guide

#### 1. Create MongoDB Atlas Account
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Click **"Try Free"** or **"Sign Up"**
- Sign in with Google (recommended) or create an account

#### 2. Deploy a Free Cluster
- After login, click **"Create Cluster"**
- Select **FREE tier (M0 Sandbox)**
- Choose cloud provider: AWS, Google Cloud, or Azure
- Select region closest to your location
- Click **"Create Cluster"** (deployment takes 1-3 minutes)

#### 3. Configure Database Access
1. Navigate to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose authentication method: **"Password"**
4. Enter credentials:
   - Username: `admin` (or your preferred username)
   - Password: `SecurePass123!` (create a strong, unique password)
5. Set privileges: **"Read and write to any database"**
6. Click **"Add User"**

> **⚠️ Security Note:** Never use simple passwords like "password123" in production.

#### 4. Configure Network Access
1. Navigate to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
4. For production: Add only specific IP addresses
5. Click **"Confirm"**

#### 5. Get Your Connection String
1. Navigate to **"Database"** in left sidebar
2. Click **"Connect"** button for your cluster
3. Select **"Drivers"** option
4. Copy the connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 6. Configure Your .env File
Replace placeholders with your actual values:

```env
# ====================
# DATABASE CONFIGURATION
# ====================
DB_URL=mongodb+srv://admin:SecurePass123!@cluster0.abc123.mongodb.net/my_database?retryWrites=true&w=majority
```

> **📝 Note:** Replace `my_database` with your actual database name (e.g., `ecommerce_db`, `blog_app`, `task_manager`)

### Test MongoDB Connection
```javascript
// test-mongodb.js
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ MongoDB connected successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();
```

---

## 💻 Local MongoDB Setup (Alternative)

### Windows Installation

#### Method 1: Official Installer
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the MSI installer with **"Complete"** setup
3. Install MongoDB as a Windows service (recommended)
4. MongoDB Compass (GUI) is included by default

#### Method 2: Using Chocolatey
```powershell
# Install MongoDB Community Edition
choco install mongodb

# Install MongoDB Compass (GUI tool)
choco install mongodb-compass

# Start MongoDB service
net start MongoDB
```

### macOS Installation

#### Method 1: Homebrew (Recommended)
```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Stop MongoDB (when needed)
brew services stop mongodb-community

# Check service status
brew services list
```

#### Method 2: Manual Download
```bash
# Download MongoDB
curl -O https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-7.0.0.tgz

# Extract archive
tar -zxvf mongodb-macos-x86_64-7.0.0.tgz

# Move to /usr/local
sudo mv mongodb-macos-x86_64-7.0.0 /usr/local/mongodb

# Add to PATH (add this to ~/.zshrc or ~/.bash_profile)
export PATH="/usr/local/mongodb/bin:$PATH"

# Create data directory
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db

# Start MongoDB
mongod
```

### Linux (Ubuntu/Debian) Installation

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check MongoDB status
sudo systemctl status mongod

# View logs (if issues occur)
sudo journalctl -u mongod --no-pager
```

### Local MongoDB Connection String

```env
# ====================
# LOCAL DATABASE CONFIGURATION
# ====================

# Without authentication (development only)
DB_URL=mongodb://localhost:27017/my_database

# With authentication (recommended)
DB_URL=mongodb://myuser:mypassword@localhost:27017/my_database?authSource=admin
```

### Create MongoDB User (Local)

```bash
# Connect to MongoDB shell
mongosh

# Switch to admin database
use admin

# Create admin user
db.createUser({
  user: "admin",
  pwd: "SecureAdminPass123!",
  roles: ["root"]
})

# Create application user
db.createUser({
  user: "appuser",
  pwd: "SecureAppPass123!",
  roles: [
    { role: "readWrite", db: "my_database" }
  ]
})

# Verify users
db.getUsers()

# Exit MongoDB shell
exit
```

### Test Local MongoDB
```bash
# Test connection
mongosh --eval "db.runCommand({ping: 1})"

# Expected output: { ok: 1 }
```

---

## 🔐 JWT & Security Configuration

### Generate JWT Secrets

**⚠️ Critical:** Generate unique, cryptographically secure secrets for production:

```bash
# Generate secrets (run for each JWT secret)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Configure in .env
```env
# ====================
# SECURITY CONFIGURATION
# ====================

# Bcrypt Configuration
SALT_WORK_FACTOR=12          # Higher = more secure but slower (10-12 recommended)

# JWT Secrets (Generate unique values!)
GENERATE_PASS=a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
JWT_ACCESS_SECRET=8c9b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8
JWT_REFRESH_SECRET=3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3
JWT_FORGET_PASSWORD_SECRET=d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8

# Token Expiration Times
EXPIRE_ACCESS_TOKEN_IN=15m               # 15 minutes
EXPIRE_REFRESH_TOKEN_IN=7d               # 7 days
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m      # 10 minutes
```

### Token Expiration Format Reference
| Format | Description | Example |
|--------|-------------|---------|
| `15m` | 15 minutes | Access token |
| `1h` | 1 hour | Temporary tokens |
| `7d` | 7 days | Refresh token |
| `30d` | 30 days | Long-lived tokens |
| `1y` | 1 year | API keys |

---

## 📧 Email Configuration (Gmail)

### Enable Gmail for Nodemailer

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **"2-Step Verification"**
3. Follow the setup process to enable 2FA

#### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **"Mail"**
3. Select device: **"Other (Custom name)"**
4. Enter name: `Node.js App` or `Your Project Name`
5. Click **"Generate"**
6. Copy the 16-character password (format: `abcd efgh ijkl mnop`)

### Email Configuration in .env
```env
# ====================
# EMAIL CONFIGURATION
# ====================
USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop      # 16-character app password (spaces allowed)
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Test Email Configuration
```javascript
// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
  const transporter = nodemailer.createTransport({
    host: process.env.STEMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Email configuration successful!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Test App" <${process.env.USER_EMAIL}>`,
      to: process.env.USER_EMAIL,
      subject: "Test Email from MARN Express",
      text: "Your email configuration is working correctly!",
      html: "<b>Your email configuration is working correctly!</b>"
    });
    
    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message);
  }
}

testEmailConfig();
```

### Alternative Email Providers

#### SendGrid
```env
SENDGRID_API_KEY=SG.xxxxx_yyyyy
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

#### Outlook/Office 365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

---

## 🖼️ Cloudinary Setup (Image Hosting)

### Step-by-Step Setup

1. **Create Account:**
   - Visit [Cloudinary](https://cloudinary.com/)
   - Click **"Sign Up"** (free tier includes 25GB storage)
   - Sign up with Google/GitHub or email

2. **Get API Credentials:**
   - After login, go to **Dashboard**
   - Find your credentials in the "Account Details" section:
     - **Cloud Name**: e.g., `dxxxxxx`
     - **API Key**: e.g., `123456789012345`
     - **API Secret**: e.g., `abc123def456ghi789`

### Configure in .env
```env
# ====================
# CLOUDINARY CONFIGURATION
# ====================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789
```

### Test Cloudinary Upload
```javascript
// test-cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  try {
    // Test configuration
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected:', ping.status);
    
    // Test upload (replace with actual image path)
    const result = await cloudinary.uploader.upload('path/to/test-image.jpg', {
      folder: 'test',
      public_id: 'test-image',
      overwrite: true
    });
    
    console.log('✅ Upload successful!');
    console.log('📸 Image URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
  } catch (error) {
    console.error('❌ Cloudinary error:', error.message);
  }
}

testCloudinary();
```

### Cloudinary Upload Options
```javascript
const uploadOptions = {
  folder: 'user_profiles',           // Organize in folders
  public_id: `user_${userId}`,       // Custom filename
  overwrite: true,                   // Replace existing
  transformation: [
    { width: 500, height: 500, crop: 'fill' },  // Resize
    { quality: 'auto' }                          // Auto-optimize
  ]
};
```

---

## 🖼️ FreeImageHost Setup (Alternative)

### Step-by-Step Setup

1. **Create Account:**
   - Visit [FreeImage.host](https://freeimage.host/)
   - Click **"Sign Up"**
   - Complete registration form

2. **Get API Key:**
   - Login to your account
   - Navigate to **Settings** → **API**
   - Click **"Generate API Key"**
   - Copy your 32-character API key

### Configure in .env
```env
# ====================
# FREEIMAGEHOST CONFIGURATION
# ====================
FREEIMAGEHOSTAPIKEY=abc123def456ghi789jkl012mno345pq
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload
```

### Test FreeImageHost Upload
```javascript
// test-freeimagehost.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

async function testFreeImageHost() {
  const formData = new FormData();
  formData.append('key', process.env.FREEIMAGEHOSTAPIKEY);
  formData.append('source', fs.createReadStream('test-image.jpg'));
  formData.append('format', 'json');

  try {
    const response = await axios.post(process.env.FREEIMAGEHOSTURL, formData, {
      headers: formData.getHeaders()
    });
    
    if (response.data.status_code === 200) {
      console.log('✅ Upload successful!');
      console.log('📸 Image URL:', response.data.image.url);
      console.log('🗑️ Delete URL:', response.data.image.delete_url);
    } else {
      console.error('❌ Upload failed:', response.data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFreeImageHost();
```

---

## 🤖 Google Gemini AI Setup

### Step-by-Step Setup

1. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click **"Create API Key"**
   - Select or create a Google Cloud project
   - Copy your API key

2. **Alternative: Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create or select a project
   - Enable **"Generative Language API"**
   - Navigate to **Credentials**
   - Create API key

### Configure in .env
```env
# ====================
# GOOGLE GEMINI AI CONFIGURATION
# ====================
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678
```

### Install Gemini SDK
```bash
npm install @google/generative-ai
```

### Test Gemini AI
```javascript
// test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    // Test text generation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = "Explain what MongoDB is in 3 simple sentences.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log('✅ Gemini AI Response:');
    console.log(response.text());
    
    // Test with chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, I'm building a Node.js app" }],
        },
        {
          role: "model",
          parts: [{ text: "That's great! I can help with Node.js development." }],
        },
      ],
    });
    
    const msg = "What's the best way to handle authentication?";
    const chatResult = await chat.sendMessage(msg);
    console.log('\n💬 Chat Response:', chatResult.response.text());
    
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
  }
}

testGemini();
```

### Gemini Model Options
| Model | Use Case | Rate Limits |
|-------|----------|-------------|
| `gemini-pro` | Text generation | 60 requests/minute |
| `gemini-pro-vision` | Image + text | 60 requests/minute |
| `gemini-ultra` | Advanced reasoning | Limited access |

---

## 📄 Complete .env File Example

```env
# ====================
# SERVER CONFIGURATION
# ====================
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# ====================
# DATABASE CONFIGURATION
# ====================
# MongoDB Atlas (Cloud)
DB_URL=mongodb+srv://admin:SecurePass123!@cluster0.abc123.mongodb.net/my_database?retryWrites=true&w=majority

# OR Local MongoDB
# DB_URL=mongodb://localhost:27017/my_database

# ====================
# SECURITY CONFIGURATION
# ====================
SALT_WORK_FACTOR=12

# JWT Secrets (Generated with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
GENERATE_PASS=a7f3e8d2c1b9a4f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0
JWT_ACCESS_SECRET=8c9b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8
JWT_REFRESH_SECRET=3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3
JWT_FORGET_PASSWORD_SECRET=d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8

# Token Expiration
EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=10m

# ====================
# EMAIL CONFIGURATION
# ====================
USER_EMAIL=your_email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# ====================
# CLOUDINARY CONFIGURATION
# ====================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123def456ghi789

# ====================
# FREEIMAGEHOST CONFIGURATION
# ====================
FREEIMAGEHOSTAPIKEY=abc123def456ghi789jkl012mno345pq
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload

# ====================
# GOOGLE GEMINI AI CONFIGURATION
# ====================
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz12345678

# ====================
# OPTIONAL CONFIGURATIONS
# ====================
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=100      # Max requests per window

# File Upload Limits
MAX_FILE_SIZE=5242880            # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp,image/gif

# Logging
LOG_LEVEL=info                   # debug, info, warn, error
```

---

## ⚙️ Environment Validation & Configuration

### Configuration File Setup

Create `src/config/index.ts` to validate and export environment variables:

```typescript
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Validation function
const validateEnv = () => {
  const required = [
    'PORT',
    'DB_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
  ];
  
  for (const variable of required) {
    if (!process.env[variable]) {
      throw new Error(`❌ Missing required environment variable: ${variable}`);
    }
  }
};

validateEnv();

// Export configuration
export default {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  node_env: process.env.NODE_ENV || 'development',
  frontend_url: process.env.FRONTEND_URL as string,
  backend_url: process.env.BACKEND_URL as string,
  
  // Database
  database_url: process.env.DB_URL as string,
  
  // Security
  salt_factor: parseInt(process.env.SALT_WORK_FACTOR || '12', 10),
  gen_pass: process.env.GENERATE_PASS as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_forget_password_secret: process.env.JWT_FORGET_PASSWORD_SECRET as string,
  
  // Token Expiration
  expire_access_in: process.env.EXPIRE_ACCESS_TOKEN_IN || '15m',
  expire_refresh_in: process.env.EXPIRE_REFRESH_TOKEN_IN || '7d',
  expire_forget_password_in: process.env.EXPIRE_FORGET_PASSWORD_TOKEN_IN || '10m',
  
  // Email
  user_email: process.env.USER_EMAIL as string,
  email_password: process.env.EMAIL_PASSWORD as string,
  email_host: process.env.STEMAIL_HOST as string,
  email_port: parseInt(process.env.EMAIL_PORT || '587', 10),
  
  // Cloudinary
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY as string,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET as string,
  
  // FreeImageHost
  freeimagehost_api_key: process.env.FREEIMAGEHOSTAPIKEY as string,
  freeimagehost_url: process.env.FREEIMAGEHOSTURL as string,
  
  // Google Gemini
  gemini_api_key: process.env.GEMINI_API_KEY as string,
};
```


Run the check script:
```bash
node scripts/check-env.js
```

---

## 🔧 Troubleshooting Common Issues

### MongoDB Connection Issues

| Issue | Solution |
|-------|----------|
| `MongoNetworkError` | Check IP whitelist in Atlas (add `0.0.0.0/0` for development) |
| `Authentication failed` | Verify username/password in connection string |
| `ENOTFOUND` | Check for typos in cluster address |
| Connection timeout | Check network/firewall settings |

### Email Configuration Issues

| Issue | Solution |
|-------|----------|
| Invalid login | Use App Password, not regular Gmail password |
| Connection refused | Check EMAIL_HOST and EMAIL_PORT values |
| Rate limit exceeded | Gmail limits: 500 emails/day for free accounts |

### JWT Issues

| Issue | Solution |
|-------|----------|
| `invalid signature` | Regenerate secrets using crypto.randomBytes |
| Token expired | Adjust EXPIRE_ACCESS_TOKEN_IN value |
| Malformed token | Ensure secret is properly set in .env |

### CORS Issues

| Issue | Solution |
|-------|----------|
| CORS error in browser | Verify FRONTEND_URL matches actual frontend URL |
| Preflight failing | Check allowed methods in CORS configuration |

### Cloudinary Issues

| Issue | Solution |
|-------|----------|
| Upload timeout | Check file size (free tier: max 10MB) |
| Invalid credentials | Verify API key and secret from dashboard |
| Resource not found | Check cloud name spelling |

### Quick Diagnostic Commands

```bash
# Test MongoDB connection
node -e "require('mongoose').connect(process.env.DB_URL).then(()=>console.log('✅ Connected')).catch(e=>console.log('❌', e.message))"

# Check Node.js version (requires 14+)
node --version

# Check npm version
npm --version

# List all environment variables
node -e "console.log(process.env)"

# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📚 Additional Resources

### Official Documentation Links
- [Main Project Repository](https://github.com/Robiu-Sani/marn-express-initializer/)
