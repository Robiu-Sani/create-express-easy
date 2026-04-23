# Complete Documentation: Email Service with Handlebars Templates

## Table of Contents
1. Overview
2. Installation and Setup
3. Configuration
4. Core Functions
5. Email Templates System
6. Predefined Email Templates API
7. Usage Examples
8. Complete Working Examples
9. Error Handling
10. Best Practices
11. Troubleshooting Guide

---

## Overview

This complete email service provides a production-ready solution for sending emails in Node.js applications. It integrates Nodemailer for email transport and Handlebars for dynamic HTML templates. The service includes caching for performance, support for multiple recipients, attachments, and nine predefined email templates for common use cases.

### Key Features

- Dynamic HTML emails using Handlebars templates
- Automatic template caching for performance
- Support for multiple recipients
- File attachments support
- Nine built-in email templates
- Development and production configurations
- Connection pooling for high volume sending
- Automatic plain text fallback for HTML emails

### Use Cases

User verification with OTP codes, welcome emails for new users, password reset requests, password change confirmations, security alerts for suspicious logins, subscription payment confirmations, general notifications, bulk email sending, and transactional email systems.

---

## Installation and Setup

### Required Packages

```bash
npm install nodemailer handlebars
npm install --save-dev @types/nodemailer @types/handlebars
```

### Directory Structure

Create the following folder structure in your project:

```
your-project/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── services/
│   │   └── email.service.ts
│   └── templates/
│       └── emails/
│           ├── otp-verification.hbs
│           ├── welcome.hbs
│           ├── password-reset.hbs
│           ├── password-changed-success.hbs
│           ├── security-alert.hbs
│           ├── subscription.hbs
│           └── notification.hbs
├── .env
└── package.json
```

---

## Configuration

### Environment Variables Setup

Add these variables to your .env file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
USER_EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL for links in emails
FRONTEND_URL=http://localhost:3000
```

### Gmail App Password Setup

For Gmail, you need an app password. Go to Google Account Settings, enable 2-Factor Authentication, then generate an App Password for Mail. Copy that 16-character password to EMAIL_PASSWORD.

### Other Email Providers

For Outlook use smtp-mail.outlook.com with port 587. For Yahoo use smtp.mail.yahoo.com with port 465. For SendGrid use smtp.sendgrid.net with port 587. For custom SMTP use your provider's host and port.

### Config File Integration

```typescript
// config/index.ts
export default {
  // Email Configuration
  email_host: process.env.EMAIL_HOST || "smtp.gmail.com",
  email_port: process.env.EMAIL_PORT || "587",
  user_email: process.env.USER_EMAIL,
  email_password: process.env.EMAIL_PASSWORD,
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  
  // Other configurations...
};
```

---

## Core Functions

### Function: createTransporter

Creates and verifies a Nodemailer transporter with connection pooling.

**What it does:** Reads email configuration from config, creates a transporter with SMTP settings, enables connection pooling for better performance, verifies the connection, and returns both transporter and user email.

**Returns:** Object containing transporter instance and user email address

**Throws:** Error if email credentials are missing or connection fails

### Function: compileTemplate

Compiles Handlebars templates with caching for performance.

**Parameters:** templateName is the filename without extension, data is an object of variables to inject into the template

**What it does:** Checks cache for existing compiled template, reads template file from src/templates/emails directory, compiles with Handlebars, caches the compiled template, returns rendered HTML string

**Caching:** Templates are compiled once and cached forever. Restart server to pick up template changes during development.

### Function: sendEmail

Main function that sends emails with all options.

**Parameters:** to accepts string or array of recipients, subject is email subject line, text is plain text version, html is direct HTML string, template is template name for compiled HTML, templateData is data for template, attachments is array of file attachments

**What it does:** Creates transporter, compiles template if provided, generates plain text from HTML as fallback, sends email with all options, logs success message, returns send info

### Interface: SendEmailOptions

The options object accepts these properties. To is required and can be string or array. Subject is required. Text is optional plain text version. Html is optional direct HTML. Template is optional template name. TemplateData is optional object for template variables. Attachments is optional array of files.

---

## Email Templates System

### Creating Handlebars Templates

Handlebars templates use double curly braces for variables. Create .hbs files in src/templates/emails directory.

### Template Example: OTP Verification

```handlebars
<!DOCTYPE html>
<html>
<head>
  <style>
    .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; }
  </style>
</head>
<body>
  <h1>Hello {{userName}}</h1>
  <p>Your verification code is: <span class="otp-code">{{otp}}</span></p>
  <a href="{{verificationUrl}}">Verify Email</a>
  <footer>© {{currentYear}} Code Biruni</footer>
</body>
</html>
```

### Available Template Variables

Each template receives its own set of variables. Common variables include userName, currentYear, and various dynamic data based on email type.

### Template Caching Behavior

Templates are compiled on first use and cached in memory. This dramatically improves performance for subsequent sends. During development, you must restart the server to see template changes. For production, caching is ideal.

---

## Predefined Email Templates API

### EmailTemplates.sendOtpEmail

Sends OTP verification code to user.

**Parameters:** to is recipient email, otp is verification code, userName is optional user name

**Template used:** otp-verification.hbs

**Template variables:** otp, userName, verificationUrl, currentYear

**Use case:** Email verification during registration

### EmailTemplates.sendWelcomeEmail

Welcomes new user to the platform.

**Parameters:** to is recipient email, userName is user's name

**Template used:** welcome.hbs

**Template variables:** userName, version, currentYear

**Use case:** After successful registration

### EmailTemplates.sendPasswordResetEmail

Sends password reset link to user.

**Parameters:** to is recipient email, resetToken is unique token, userName is optional

**Template used:** password-reset.hbs

**Template variables:** userName, resetUrl, expiryTime, currentYear

**Use case:** When user requests password reset

### EmailTemplates.sendPasswordSuccessEmail

Confirms password change was successful.

**Parameters:** to is recipient email, userName is user's name

**Template used:** password-changed-success.hbs

**Template variables:** userName, currentYear

**Use case:** After password is successfully changed

### EmailTemplates.sendSecurityAlertEmail

Notifies user about new login from unknown device.

**Parameters:** to is recipient email, userName is user's name, loginDetails contains device info

**Template used:** security-alert.hbs

**Template variables:** userName, deviceType, browserName, location, ipAddress, loginTime, secureAccountUrl, currentYear

**Use case:** Suspicious login detection

### EmailTemplates.sendSubscriptionEmail

Confirms subscription payment.

**Parameters:** to is recipient email, userName is user's name, subDetails contains payment info

**Template used:** subscription.hbs

**Template variables:** userName, planName, amount, transactionId, currentYear

**Use case:** After successful payment

### EmailTemplates.sendNotificationEmail

Sends general notification with priority level.

**Parameters:** to is recipient(s), title is notification title, message is notification content, userName is optional, actionUrl is optional link, priority is low/medium/high

**Template used:** notification.hbs

**Template variables:** userName, title, message, actionUrl, priorityClass, notificationDate, currentYear

**Use case:** General announcements and alerts

---

## Usage Examples

### Example 1: Sending OTP Email

```typescript
import { EmailTemplates } from './services/email.service';

// Send OTP for email verification
await EmailTemplates.sendOtpEmail(
  'user@example.com',
  '123456',
  'John Doe'
);
```

### Example 2: Welcome Email After Registration

```typescript
// In your auth controller after successful registration
await EmailTemplates.sendWelcomeEmail(
  newUser.email,
  newUser.fullName
);
```

### Example 3: Password Reset Request

```typescript
// Generate reset token and send email
const resetToken = generateResetToken();
await EmailTemplates.sendPasswordResetEmail(
  user.email,
  resetToken,
  user.fullName
);
```

### Example 4: Security Alert for New Login

```typescript
// After detecting login from new device
const loginDetails = {
  device: 'iPhone 13',
  browser: 'Safari',
  location: 'New York, USA',
  ip: '192.168.1.1'
};

await EmailTemplates.sendSecurityAlertEmail(
  user.email,
  user.fullName,
  loginDetails
);
```

### Example 5: Subscription Confirmation

```typescript
// After successful payment processing
const subscriptionDetails = {
  planName: 'Pro Plan',
  amount: '$29.99',
  transactionId: 'txn_123456789'
};

await EmailTemplates.sendSubscriptionEmail(
  user.email,
  user.fullName,
  subscriptionDetails
);
```

### Example 6: General Notification

```typescript
// Send system announcement
await EmailTemplates.sendNotificationEmail(
  'user@example.com',
  'Maintenance Notice',
  'Our system will undergo maintenance on Sunday at 2 AM.',
  'John Doe',
  'https://example.com/status',
  'high'
);
```

### Example 7: Bulk Email to Multiple Recipients

```typescript
// Send notification to multiple users
await EmailTemplates.sendNotificationEmail(
  ['user1@example.com', 'user2@example.com', 'user3@example.com'],
  'New Feature Available',
  'Check out our new dashboard features!',
  'All Users',
  'https://example.com/features',
  'medium'
);
```

### Example 8: Custom Email with Attachments

```typescript
import { sendEmail } from './services/email.service';

// Send custom email with invoice attachment
await sendEmail({
  to: 'customer@example.com',
  subject: 'Your Invoice',
  template: 'invoice',
  templateData: {
    userName: 'John',
    invoiceNumber: 'INV-001',
    amount: '$150.00'
  },
  attachments: [
    {
      filename: 'invoice.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    }
  ]
});
```

### Example 9: Direct HTML Email Without Template

```typescript
// Send simple HTML email without template system
await sendEmail({
  to: 'admin@example.com',
  subject: 'New User Registration',
  html: '<h1>New User Joined</h1><p>Email: user@example.com</p>'
});
```

### Example 10: Text-Only Email

```typescript
// Send plain text email
await sendEmail({
  to: 'user@example.com',
  subject: 'Simple Notification',
  text: 'This is a plain text email without HTML.'
});
```

---

## Complete Working Examples

### Example: User Registration Flow

```typescript
// auth.controller.ts
import { EmailTemplates } from '../services/email.service';

class AuthController {
  async register(req: Request, res: Response) {
    const { email, fullName, password } = req.body;
    
    // Create user in database
    const user = await User.create({
      email,
      fullName,
      password: hashPassword(password)
    });
    
    // Generate OTP
    const otp = generateOTP();
    await OTPService.saveOTP(email, otp);
    
    // Send welcome email
    await EmailTemplates.sendWelcomeEmail(email, fullName);
    
    // Send OTP for verification
    await EmailTemplates.sendOtpEmail(email, otp, fullName);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Check your email for OTP.'
    });
  }
}
```

### Example: Password Reset Flow

```typescript
// auth.controller.ts
class AuthController {
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    await PasswordReset.create({
      email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600000)
    });
    
    // Send reset email
    await EmailTemplates.sendPasswordResetEmail(
      email,
      resetToken,
      user.fullName
    );
    
    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  }
  
  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    
    const resetRecord = await PasswordReset.findOne({ token });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    
    // Update password
    await User.updateOne(
      { email: resetRecord.email },
      { password: hashPassword(newPassword) }
    );
    
    // Send success email
    await EmailTemplates.sendPasswordSuccessEmail(
      resetRecord.email,
      'User'
    );
    
    // Delete used token
    await resetRecord.deleteOne();
    
    res.json({ success: true, message: 'Password reset successful' });
  }
}
```

### Example: Security Alert on Login

```typescript
// auth.controller.ts
class AuthController {
  async login(req: Request, res: Response) {
    const { email, password, deviceInfo } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if this is a new device
    const isNewDevice = await checkNewDevice(user._id, deviceInfo);
    
    if (isNewDevice) {
      // Send security alert
      await EmailTemplates.sendSecurityAlertEmail(
        user.email,
        user.fullName,
        {
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          location: await getLocation(deviceInfo.ip),
          ip: deviceInfo.ip
        }
      );
    }
    
    // Generate token and respond
    const token = generateToken(user);
    res.json({ success: true, token });
  }
}
```

---

## Error Handling

### Common Errors and Solutions

**Error: Email credentials are not configured**
Solution: Check that USER_EMAIL and EMAIL_PASSWORD are set in .env file.

**Error: Template file not found**
Solution: Verify template exists in src/templates/emails directory with .hbs extension.

**Error: Template compilation failed**
Solution: Check Handlebars syntax in template file. All variables must be properly closed.

**Error: Connection timeout**
Solution: Check SMTP host and port. For Gmail, ensure port 587 is not blocked.

**Error: Invalid login**
Solution: For Gmail, use App Password not regular password. Enable 2FA first.

### Graceful Error Handling Pattern

```typescript
try {
  await EmailTemplates.sendWelcomeEmail(user.email, user.name);
} catch (emailError) {
  console.error('Failed to send welcome email:', emailError);
  // Don't fail the registration just because email failed
  // Log error for monitoring but continue
}
```

---

## Best Practices

### Use Connection Pooling

The transporter already uses connection pooling with maxConnections set to 5. This is optimal for most applications sending under 100 emails per minute.

### Implement Rate Limiting

For bulk email sending, implement rate limiting to avoid being marked as spam. Send no more than 100 emails per minute from a single SMTP connection.

### Always Provide Plain Text Fallback

The service automatically generates plain text from HTML when text is not provided. This ensures email clients that block HTML can still read your message.

### Cache Templates in Production

Templates are automatically cached. For development, restart the server after template changes. For production, caching provides significant performance gains.

### Use Environment Variables

Never hardcode email credentials. Always use environment variables. The service reads from config which reads from .env.

### Monitor Email Sending

Log email send attempts and failures. Track bounce rates and open rates using webhooks from your email provider.

### Handle Bounced Emails

Implement webhook handlers for bounced emails. Remove invalid email addresses from your database to maintain sender reputation.

---

## Troubleshooting Guide

### Issue: Emails going to spam

Solution: Use proper SMTP configuration with SPF and DKIM records. Warm up new email domains gradually. Avoid spam trigger words in subject lines.

### Issue: Gmail blocking sign-in

Solution: Enable 2-Factor Authentication and generate an App Password. Regular Gmail passwords no longer work for SMTP.

### Issue: Template changes not showing

Solution: Restart the server. Templates are cached on first use and not reloaded until server restart.

### Issue: Connection timeout errors

Solution: Check firewall settings. Port 587 must be open. Some hosting providers block SMTP ports.

### Issue: Attachments not sending

Solution: Ensure attachment content is Buffer or string. Verify file size is within email provider limits (usually 25MB).

### Issue: Multiple recipients not receiving

Solution: The service joins array with commas correctly. Check that your email provider allows multiple recipients in one send.

### Issue: Special characters in email

Solution: The service uses UTF-8 encoding automatically. Handlebars escapes HTML by default. Use triple braces for raw HTML if needed.

---

## Summary

This email service provides everything needed for production email sending:

- Nine predefined templates for common use cases
- Handlebars template system with caching
- Connection pooling for performance
- Multiple recipient support
- Attachment handling
- Automatic plain text fallback
- Comprehensive error handling

**Basic usage pattern:**
```typescript
await EmailTemplates.sendWelcomeEmail(user.email, user.name);
```

The service handles all complexity including template compilation, transporter management, and error recovery. Just call the appropriate template function with recipient and data.
