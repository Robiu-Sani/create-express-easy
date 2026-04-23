# Complete Documentation: Handlebars Email Templates System

## Table of Contents
1. Overview of Handlebars Templates
2. Template Directory Structure
3. Creating Your First Template
4. Handlebars Syntax Guide
5. Template Variables and Data Binding
6. Complete Template Examples
7. Template Helpers and Custom Functions
8. Template Styling Guide
9. Testing Templates
10. Template Management Best Practices

---

## Overview of Handlebars Templates

Handlebars is a powerful templating engine that allows you to build dynamic HTML emails with variables, conditions, loops, and helpers. The email service uses Handlebars to compile .hbs template files into complete HTML emails by injecting dynamic data.

### Why Handlebars for Email Templates

Handlebars keeps your HTML separate from your JavaScript code. Designers can edit templates without touching backend code. Variables are simple double curly braces. The syntax is easy to learn. Templates are reusable across different email types. Caching makes rendering extremely fast.

### How Template Compilation Works

The email service reads .hbs files from the templates directory. Handlebars compiles the template into a JavaScript function. This function waits for data and returns complete HTML. The compiled function caches in memory. Subsequent sends use the cached version for speed.

### Template Lifecycle

You create a .hbs file in the emails folder. The email service compiles it on first use. Your controller calls a template function with data. Handlebars replaces variables with actual values. The service sends the rendered HTML as email.

---

## Template Directory Structure

### Standard Folder Layout

```
your-project/
├── src/
│   ├── templates/
│   │   └── emails/
│   │       ├── otp-verification.hbs
│   │       ├── welcome.hbs
│   │       ├── password-reset.hbs
│   │       ├── password-changed-success.hbs
│   │       ├── security-alert.hbs
│   │       ├── subscription.hbs
│   │       ├── notification.hbs
│   │       ├── invoice.hbs
│   │       └── newsletter.hbs
│   └── services/
│       └── email.service.ts
```

### Creating the Directory

```bash
# Run these commands in your terminal
mkdir -p src/templates/emails
```

### File Naming Conventions

Use kebab-case for template filenames like otp-verification.hbs. Use descriptive names that indicate the email purpose. Keep names short but meaningful. Avoid special characters except hyphens.

---

## Creating Your First Template

### Step 1: Create the Template File

Create a new file called welcome.hbs in src/templates/emails/

### Step 2: Basic Template Structure

Every email template should have a complete HTML structure including doctype, head, body, and responsive styling.

### Step 3: Add Variables

Use double curly braces to mark where dynamic data will appear. For example, userName will be replaced with the actual user's name.

### Step 4: Test the Template

Call the email function from your controller to verify the template renders correctly.

### Template File Example

The welcome template includes a greeting with the user's name, a welcome message, a call to action button, and a footer with the current year.

---

## Handlebars Syntax Guide

### Variable Substitution

Variables are the most common Handlebars feature. Use double curly braces around the variable name. The template engine replaces {{variableName}} with the actual value from your data object.

Basic variable: {{userName}}
Nested variable: {{user.profile.name}}
Default values: {{userName "Guest"}}

### Conditional Statements

Use if blocks to show content only when certain conditions are met. The each helper loops through arrays. The unless helper shows content when a condition is false.

If condition: {{#if isVerified}} Show this {{/if}}
If else: {{#if role}} {{role}} {{else}} User {{/if}}
Unless: {{#unless isDeleted}} Show active content {{/unless}}

### Loop Iteration

Use the each helper to loop through arrays. Inside the loop, you can access properties of each item using dot notation.

Basic each: {{#each users}} {{name}} {{/each}}
With index: {{#each users}} {{@index}}: {{name}} {{/each}}
Empty fallback: {{#each items}} {{name}} {{else}} No items {{/each}}

### Comment Syntax

Handlebars comments do not appear in the final HTML. Use these for developer notes and documentation.

Single line comment: {{! This is a comment }}
Multi line comment: {{!-- This is a multi-line comment that will not appear in the output --}}

### Path Navigation

Use dot notation to access nested properties. Use slash notation for dynamic paths.

Dot notation: {{user.address.city}}
Slash notation: {{user/address/city}}
This context: {{this.property}}

---

## Template Variables and Data Binding

### How Data Flows to Templates

When you call sendEmail with template and templateData, the service passes templateData to Handlebars. Handlebars replaces every {{variable}} with the corresponding value from templateData.

### Required Variables Pattern

Some variables are required for templates to render properly. Always include userName in welcome and notification templates. Always include otp in verification templates. Always include resetUrl in password reset templates.

### Optional Variables Pattern

Provide default values for optional variables using the else helper. Check if variables exist before displaying them.

### Dynamic Data Structure

The templateData object can contain strings, numbers, arrays, objects, and nested structures. Handlebars can access any depth of nesting.

### Common Variables Across Templates

All templates receive currentYear for the footer copyright notice. Most templates receive userName for personalization. Action templates receive URLs for buttons.

---

## Complete Template Examples

### Example 1: OTP Verification Template

This template sends a one-time password for email verification. It includes the OTP code prominently, a verification button, and expiry information.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: white;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 30px;
      background: #f9fafb;
      border-radius: 0 0 10px 10px;
    }
    .otp-code {
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      color: #4F46E5;
      letter-spacing: 8px;
      margin: 30px 0;
      font-family: monospace;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <h2>Hello {{userName}}!</h2>
      <p>Thank you for registering with Code Biruni. Please verify your email address using the code below:</p>
      
      <div class="otp-code">{{otp}}</div>
      
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      
      <p>Alternatively, you can click the button below:</p>
      <div style="text-align: center;">
        <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
      </div>
      
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Example 2: Welcome Email Template

This template welcomes new users to the platform. It includes personalized greeting, platform features, and getting started links.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Code Biruni</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 40px 20px;
    }
    .hero h1 {
      margin: 0;
      font-size: 32px;
    }
    .content {
      padding: 40px 30px;
    }
    .feature {
      margin: 20px 0;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .feature h3 {
      margin: 0 0 10px 0;
      color: #4F46E5;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>Welcome to Code Biruni</h1>
      <p>Version {{version}}</p>
    </div>
    <div class="content">
      <h2>Hi {{userName}},</h2>
      <p>We're thrilled to have you on board! You've joined a community of developers building amazing things.</p>
      
      <div class="feature">
        <h3>🚀 Get Started</h3>
        <p>Complete your profile to unlock all features and connect with other developers.</p>
      </div>
      
      <div class="feature">
        <h3>📚 Learning Resources</h3>
        <p>Access our tutorials, documentation, and code examples to accelerate your learning.</p>
      </div>
      
      <div class="feature">
        <h3>💬 Community Support</h3>
        <p>Join our Discord community to ask questions and share your projects.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://codebiruni.com/dashboard" class="button">Go to Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
      <p>Building the future of development</p>
    </div>
  </div>
</body>
</html>
```

### Example 3: Password Reset Template

This template sends secure password reset links. It includes security warnings and expiry information.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #f3f4f6;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: #ef4444;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px;
    }
    .alert-box {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      padding: 16px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .reset-button {
      display: block;
      width: fit-content;
      margin: 30px auto;
      padding: 14px 32px;
      background: #ef4444;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      text-align: center;
    }
    .warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hello {{userName}},</h2>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <a href="{{resetUrl}}" class="reset-button">Reset My Password</a>
      
      <div class="alert-box">
        <strong>⚠️ Security Notice</strong>
        <p style="margin: 8px 0 0 0;">This link will expire in <strong>{{expiryTime}}</strong>. If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      </div>
      
      <div class="warning">
        <strong>🔒 For your security:</strong>
        <ul style="margin: 8px 0 0 20px;">
          <li>Never share this link with anyone</li>
          <li>Make sure you're on the official website before entering your new password</li>
          <li>Choose a strong, unique password</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 8px; border-radius: 4px;">{{resetUrl}}</p>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
```

### Example 4: Security Alert Template

This template notifies users about logins from new devices with full details.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert - New Login Detected</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #f3f4f6;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: #f59e0b;
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px;
    }
    .device-details {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-label {
      font-weight: bold;
      color: #4b5563;
    }
    .detail-value {
      color: #111827;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #f59e0b;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Security Alert</h1>
    </div>
    <div class="content">
      <h2>Hi {{userName}},</h2>
      <p>We detected a new login to your account from an unfamiliar device or location.</p>
      
      <div class="device-details">
        <h3 style="margin-top: 0;">📱 Login Details:</h3>
        <div class="detail-row">
          <span class="detail-label">Device:</span>
          <span class="detail-value">{{deviceType}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Browser:</span>
          <span class="detail-value">{{browserName}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">{{location}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">IP Address:</span>
          <span class="detail-value">{{ipAddress}}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span>
          <span class="detail-value">{{loginTime}}</span>
        </div>
      </div>
      
      {{#if isSuspicious}}
      <div style="background: #fee2e2; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <strong>⚠️ High Risk Alert</strong>
        <p style="margin: 8px 0 0 0;">This login location is unusual for your account. Please secure your account immediately.</p>
      </div>
      {{/if}}
      
      <p><strong>Was this you?</strong> No action is needed.</p>
      <p><strong>Wasn't you?</strong> Click below to secure your account:</p>
      
      <div style="text-align: center;">
        <a href="{{secureAccountUrl}}" class="button">Secure My Account</a>
      </div>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
      <p>If you didn't perform this action, please contact support immediately.</p>
    </div>
  </div>
</body>
</html>
```

### Example 5: Subscription Confirmation Template

This template sends payment receipts and subscription details.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - Subscription Active</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #f3f4f6;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #10b981, #059669);
      padding: 32px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .checkmark {
      font-size: 48px;
      margin: 20px 0;
    }
    .content {
      padding: 40px;
    }
    .receipt-card {
      background: #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .receipt-row.total {
      font-weight: bold;
      font-size: 18px;
      border-bottom: none;
      margin-top: 10px;
      padding-top: 10px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="checkmark">✅</div>
      <h1>Payment Confirmed!</h1>
    </div>
    <div class="content">
      <h2>Thank You, {{userName}}!</h2>
      <p>Your payment has been successfully processed. Your subscription is now active.</p>
      
      <div class="receipt-card">
        <h3 style="margin-top: 0;">Receipt Details:</h3>
        <div class="receipt-row">
          <span>Plan Name:</span>
          <span><strong>{{planName}}</strong></span>
        </div>
        <div class="receipt-row">
          <span>Amount Paid:</span>
          <span><strong>{{amount}}</strong></span>
        </div>
        <div class="receipt-row">
          <span>Transaction ID:</span>
          <span>{{transactionId}}</span>
        </div>
        <div class="receipt-row">
          <span>Payment Date:</span>
          <span>{{paymentDate}}</span>
        </div>
        <div class="receipt-row total">
          <span>Total:</span>
          <span>{{amount}}</span>
        </div>
      </div>
      
      <p>Your subscription includes:</p>
      <ul>
        <li>Full access to all premium features</li>
        <li>Priority support</li>
        <li>Monthly updates and new features</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="{{dashboardUrl}}" class="button">Access Your Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
      <p>This is your payment receipt. Please save it for your records.</p>
    </div>
  </div>
</body>
</html>
```

### Example 6: Notification Template with Priority Levels

This template handles all general notifications with visual priority indicators.

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #f3f4f6;
    }
    .container {
      max-width: 560px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      padding: 32px;
      text-align: center;
    }
    .header.priority-high {
      background: #ef4444;
    }
    .header.priority-medium {
      background: #f59e0b;
    }
    .header.priority-low {
      background: #10b981;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px;
    }
    .message-box {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .date-badge {
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header {{priorityClass}}">
      <h1>{{title}}</h1>
    </div>
    <div class="content">
      <h2>Hello {{userName}},</h2>
      
      <div class="message-box">
        {{message}}
      </div>
      
      {{#if actionUrl}}
      <div style="text-align: center;">
        <a href="{{actionUrl}}" class="button">Take Action</a>
      </div>
      {{/if}}
      
      <div class="date-badge">
        Notification sent on {{notificationDate}}
      </div>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Code Biruni. All rights reserved.</p>
      <p>You received this notification because you're a registered user.</p>
    </div>
  </div>
</body>
</html>
```

---

## Template Helpers and Custom Functions

### Registering Custom Helpers

You can add custom Handlebars helpers in the email service file before compiling templates.

```typescript
// Add this to email.service.ts before compileTemplate function
import Handlebars from 'handlebars';

// Format date helper
Handlebars.registerHelper('formatDate', function(date: Date, format: string) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Uppercase helper
Handlebars.registerHelper('uppercase', function(str: string) {
  return str.toUpperCase();
});

// Truncate text helper
Handlebars.registerHelper('truncate', function(text: string, length: number) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
});

// Currency formatter
Handlebars.registerHelper('currency', function(amount: number) {
  return `$${amount.toFixed(2)}`;
});

// Conditional equals helper
Handlebars.registerHelper('eq', function(a: any, b: any, options: any) {
  return a === b ? options.fn(this) : options.inverse(this);
});
```

### Using Helpers in Templates

Once registered, use helpers anywhere in your templates:

```handlebars
<!-- Format date -->
<p>Member since: {{formatDate createdAt}}</p>

<!-- Uppercase text -->
<h1>{{uppercase welcomeMessage}}</h1>

<!-- Truncate long text -->
<p>{{truncate longDescription 100}}</p>

<!-- Format currency -->
<p>Total: {{currency amount}}</p>

<!-- Conditional comparison -->
{{#eq user.role "admin"}}
  <p>Welcome Admin User</p>
{{else}}
  <p>Welcome Regular User</p>
{{/eq}}
```

---

## Template Styling Guide

### Email Client Compatibility

Email clients have limited CSS support. Use inline styles or embedded styles in the head. Avoid JavaScript and external stylesheets. Use tables for complex layouts when needed.

### Responsive Design Principles

Use max-width containers for mobile devices. Use media queries for responsive breakpoints. Set font sizes in px not rem. Use fluid images with max-width 100 percent.

### Recommended Base Styles

Set body margins to zero. Use a container with max-width 600px. Center the container with auto margins. Use fallback fonts like Arial or Helvetica. Set line-height to 1.5 for readability.

### Dark Mode Support

Add media queries for dark mode preferences. Use color schemes that work in both light and dark modes. Avoid pure white backgrounds that strain eyes in dark mode.

### Button Styling Best Practices

Use table-based buttons for maximum compatibility. Add padding and border radius for modern clients. Include background color and text color. Provide clear hover states where supported.

### Testing Across Email Clients

Test templates in Gmail, Outlook, Yahoo, Apple Mail, and Thunderbird. Use email testing services like Litmus or Email on Acid. Check mobile rendering on iOS and Android devices.

---

## Testing Templates

### Local Development Testing

Create a test route in your application to preview templates without sending emails.

```typescript
// test.controller.ts
import { compileTemplate } from '../services/email.service';

export const previewTemplate = async (req: Request, res: Response) => {
  const { templateName } = req.params;
  
  const testData = {
    userName: 'Test User',
    otp: '123456',
    resetUrl: 'https://example.com/reset-password?token=test123',
    verificationUrl: 'https://example.com/verify?token=test123',
    currentYear: new Date().getFullYear(),
    version: '1.0.0',
    title: 'Test Notification',
    message: 'This is a test message to preview the template design.',
    planName: 'Pro Plan',
    amount: '$29.99',
    transactionId: 'TEST-123456',
    deviceType: 'iPhone 13',
    browserName: 'Safari',
    location: 'New York, USA',
    ipAddress: '192.168.1.1',
    loginTime: new Date().toLocaleString(),
    priorityClass: 'priority-high'
  };
  
  const html = await compileTemplate(templateName, testData);
  res.send(html);
};
```

### Test Route Setup

```typescript
// test.router.ts
router.get('/preview/:templateName', previewTemplate);
```

Visit http://localhost:5000/preview/welcome in your browser to see the rendered template.

### Unit Testing Templates

```typescript
// email.service.test.ts
import { compileTemplate } from './email.service';

describe('Email Templates', () => {
  it('should compile welcome template with user data', async () => {
    const html = await compileTemplate('welcome', {
      userName: 'John Doe',
      currentYear: 2024,
      version: '1.0.0'
    });
    
    expect(html).toContain('John Doe');
    expect(html).toContain('Welcome to Code Biruni');
    expect(html).not.toContain('{{userName}}');
  });
  
  it('should handle missing variables gracefully', async () => {
    const html = await compileTemplate('welcome', {});
    expect(html).toBeDefined();
    expect(typeof html).toBe('string');
  });
});
```

---

## Template Management Best Practices

### Version Control Templates

Store all .hbs files in Git. Template changes should go through code review. Tag releases with email template versions. Keep a changelog of template modifications.

### Template Naming Conventions

Use descriptive names like password-reset-request.hbs. Include purpose in filename. Avoid generic names like email1.hbs. Use hyphens not underscores.

### Variable Documentation

Document all expected variables at the top of each template file. Include variable types and descriptions. Mark required vs optional variables. Provide example values.

### Template Organization

Group related templates by feature. Keep base layouts separate from content templates. Create partials for repeated elements like headers and footers. Use consistent file naming across features.

### Performance Optimization

Keep templates under 100KB. Optimize images before including. Remove unnecessary whitespace. Use CSS shorthand properties. Minify HTML in production.

### Security Considerations

Sanitize user-generated content before injecting into templates. Never trust user input in template variables. Escape HTML special characters. Use Handlebars default escaping which is safe.

### Template Migration Strategy

When updating templates, test with old data. Maintain backward compatibility. Add new variables as optional. Remove old variables after deprecation period.

---

## Complete Template Checklist

Before deploying a new template, verify these items:

Template file exists in correct directory with .hbs extension. All required variables are documented. Template renders without errors. CSS works across major email clients. Links use full URLs not relative paths. Images have absolute URLs. Responsive design works on mobile. Dark mode is considered. Spelling and grammar are correct. Brand colors and logos are accurate.

---

## Summary

Handlebars email templates provide a powerful, maintainable way to send dynamic HTML emails. The system separates design from code, caches for performance, and supports complex logic through helpers.

**Key points to remember:**

Create .hbs files in src/templates/emails directory. Use double curly braces for variables. Add conditional logic with if and each helpers. Register custom helpers for complex formatting. Test templates using the preview route. Always include plain text fallbacks.

**Basic template structure:**
```handlebars
<!DOCTYPE html>
<html>
<head><style>/* CSS here */</style></head>
<body>
  <h1>Hello {{userName}}</h1>
  <p>{{message}}</p>
  <footer>© {{currentYear}}</footer>
</body>
</html>
```

The email service handles compilation, caching, and sending. You focus on designing beautiful, effective emails that engage your users.
