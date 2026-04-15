# Configuration Documentation

## Overview
This configuration file manages all environment variables and application settings using `dotenv`. It loads variables from a `.env` file located in the project root directory and exports them as a structured object for use throughout the application.

## File Structure
```typescript
import dotenv from 'dotenv';
import Path from 'path';

dotenv.config({ path: Path.join(process.cwd(), '.env') });
```

### Initialization Details
- **`dotenv.config()`**: Loads environment variables from the `.env` file
- **`Path.join(process.cwd(), '.env')`**: Dynamically resolves the absolute path to the `.env` file in the current working directory, ensuring the file is found regardless of where the script is executed from

---

## Configuration Properties

### Server Configuration

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `port` | `string \| undefined` | `PORT` | The port number on which the server will listen for incoming connections (e.g., `3000`, `8080`) |
| `node_env` | `string \| undefined` | `NODE_ENV` | Defines the runtime environment (`development`, `production`, `test`). Used to conditionally enable/disable features like error stack traces or debugging tools |

### Database Configuration

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `database_url` | `string \| undefined` | `DB_URL` | MongoDB connection string or other database URI. Contains authentication credentials, host, port, and database name (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`) |

### Security & Authentication

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `salt_factor` | `number` | `SALT_WORK_FACTOR` | **Type-cast to Number**. Determines the computational complexity of password hashing using bcrypt. Higher values (8-12 recommended) increase security but also increase hashing time. Typical range: 10-12 |
| `gen_pass` | `string` | `GENERATE_PASS` | **Type-asserted as string**. Default or temporary password used for user account creation or password reset functionality. Should be a strong, randomly generated string |
| `jwt_access_secret` | `string` | `JWT_ACCESS_SECRET` | **Type-asserted as string**. Secret key used to sign and verify JWT access tokens. Must be a long, random, and cryptographically secure string (minimum 32 characters recommended) |
| `jwt_refresh_secret` | `string` | `JWT_REFRESH_SECRET` | **Type-asserted as string**. Secret key for signing refresh tokens. Should be different from the access token secret for security isolation |
| `jwt_forget_password_secret` | `string` | `JWT_FORGET_PASSWORD_SECRET` | **Type-asserted as string**. Secret key specifically for signing password reset tokens. Using a separate secret limits the scope of potential token misuse |

### Token Expiration Settings

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `expire_access_in` | `string` | `EXPIRE_ACCESS_TOKEN_IN` | **Type-asserted as string**. Duration before access tokens expire (e.g., `15m` for 15 minutes, `1h` for 1 hour, `1d` for 1 day). Short expiration enhances security by limiting token lifetime |
| `expire_refresh_in` | `string` | `EXPIRE_REFRESH_TOKEN_IN` | **Type-asserted as string**. Duration before refresh tokens expire (e.g., `7d`, `30d`). Longer expiration allows users to stay logged in without re-entering credentials |
| `expire_forget_password_in` | `string` | `EXPIRE_FORGET_PASSWORD_TOKEN_IN` | **Type-asserted as string**. Validity period for password reset links (e.g., `1h`, `24h`). Should be relatively short to prevent security risks from lingering reset URLs |

### Frontend Integration

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `frontend_url` | `string \| undefined` | `FRONTEND_URL` | Base URL of the frontend application (e.g., `http://localhost:3000`, `https://app.example.com`). Used for CORS configuration, email link generation, and redirect URLs |

### Email Service Configuration

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `user_email` | `string` | `USER_EMAIL` | **Type-asserted as string**. Sender email address for transactional emails (verification, password reset, notifications) |
| `email_password` | `string` | `EMAIL_PASSWORD` | **Type-asserted as string**. App-specific password or SMTP authentication credential for the email account. **Never commit this to version control** |
| `email_host` | `string` | `STEMAIL_HOST` | **Type-asserted as string**. SMTP server hostname (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`). Note the variable name `STEMAIL_HOST` likely indicates SendGrid integration |
| `email_port` | `string \| undefined` | `EMAIL_PORT` | SMTP server port number. Common ports: `587` (TLS), `465` (SSL), `25` (unencrypted - not recommended) |

### Cloudinary Configuration (Image/Media CDN)

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `cloudinary_cloud_name` | `string` | `CLOUDINARY_CLOUD_NAME` | **Type-asserted as string**. Your Cloudinary cloud name (found in Cloudinary dashboard). Part of the media delivery URL: `https://res.cloudinary.com/{cloud_name}/` |
| `cloudinary_api_key` | `string` | `CLOUDINARY_API_KEY` | **Type-asserted as string**. API key for authenticating requests to Cloudinary's REST API |
| `cloudinary_api_secret` | `string` | `CLOUDINARY_API_SECRET` | **Type-asserted as string**. Secret key for signing API requests. **Keep this confidential** - it grants full access to your Cloudinary account |

### FreeImageHost Configuration (Alternative Image Hosting)

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `freeimagehost_api_key` | `string` | `FREEIMAGEHOSTAPIKEY` | **Type-asserted as string**. API key for freeimage.host service, a free alternative for image uploads |
| `freeimagehost_url` | `string` | `FREEIMAGEHOSTURL` | **Type-asserted as string**. Base API endpoint URL for the freeimage.host service (e.g., `https://freeimage.host/api/1/upload`) |

### AI/ML Service Configuration

| Property | Type | Environment Variable | Description |
|----------|------|---------------------|-------------|
| `gemini_api_key` | `string` | `GEMINI_API_KEY` | **Type-asserted as string**. API key for Google's Gemini AI model. Enables AI-powered features like content generation, image analysis, or chat completion |

---

## Type Safety Notes

### Type Assertions (`as string`)
Properties with `as string` tell TypeScript to treat the value as a string even though `process.env` properties are typed as `string | undefined`. This is a **type assertion** (not a runtime conversion) and assumes the environment variable is always defined. If the variable is missing, the application may encounter runtime errors.

**Recommended Enhancement:**
```typescript
if (!process.env.JWT_ACCESS_SECRET) {
  throw new Error('JWT_ACCESS_SECRET is required');
}
```

### Type Casting (`Number()`)
- `salt_factor: Number(process.env.SALT_WORK_FACTOR)` explicitly converts the environment variable from string to number
- Returns `NaN` if the value isn't a valid number, which could cause runtime issues
- Consider adding validation:
```typescript
const saltFactor = Number(process.env.SALT_WORK_FACTOR);
if (isNaN(saltFactor)) throw new Error('SALT_WORK_FACTOR must be a number');
```

---

## Required Environment Variables (.env Example)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

# Security
SALT_WORK_FACTOR=10
GENERATE_PASS=TempPass123!
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-min-32-chars
JWT_FORGET_PASSWORD_SECRET=your-super-secret-jwt-reset-key-min-32-chars

# Token Expiration
EXPIRE_ACCESS_TOKEN_IN=15m
EXPIRE_REFRESH_TOKEN_IN=7d
EXPIRE_FORGET_PASSWORD_TOKEN_IN=1h

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (Example with Gmail)
USER_EMAIL=your-app@gmail.com
EMAIL_PASSWORD=your-app-specific-password
STEMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-secret

# FreeImageHost
FREEIMAGEHOSTAPIKEY=your-freeimage-api-key
FREEIMAGEHOSTURL=https://freeimage.host/api/1/upload

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

---

## Usage Example

```typescript
import config from './config';

// Access configuration values
const port = config.port || 3000;
const dbUrl = config.database_url;

// Use in JWT signing
jwt.sign(payload, config.jwt_access_secret, { 
  expiresIn: config.expire_access_in 
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret
});
```

---

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets periodically**, especially JWT secrets
4. **Use app-specific passwords** for email services, not your main account password
5. **Set appropriate file permissions** for `.env` files (e.g., `600` on Linux/macOS)
6. **Validate all required environment variables** at application startup
7. **Use environment variable injection** in production (Docker secrets, Kubernetes secrets, cloud provider secret managers) rather than `.env` files

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `TypeError: Cannot read property of undefined` | Missing environment variable | Ensure all variables in `.env` file are defined |
| `NaN` value for `salt_factor` | Non-numeric value in `SALT_WORK_FACTOR` | Set numeric value (e.g., `10`) |
| JWT verification failures | Different secrets across deployments | Use consistent secrets or implement secret rotation |
| Email sending fails | Incorrect SMTP settings | Verify host, port, and credentials; ensure less secure app access is enabled for Gmail |
| Cloudinary upload fails | Invalid credentials | Verify API key and secret in Cloudinary dashboard |

---

## Version History
- **Current Version**: Exports configuration object with 18 properties covering server, database, authentication, email, media storage, and AI services
- **Dependencies**: `dotenv` for environment variable loading
- This documentation provides a thorough explanation of every configuration property, its purpose, type handling, security considerations, and practical usage examples.


