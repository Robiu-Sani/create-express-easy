# Complete Documentation: Cloudinary Image Upload Middleware

## Table of Contents
1. Overview
2. Configuration Setup
3. Core Features
4. API Reference
5. Usage Examples
6. Error Handling
7. Best Practices
8. Troubleshooting Guide

---

## Overview

This Cloudinary image upload middleware provides a production-ready solution for handling image uploads in Express.js applications. It automatically uploads images to Cloudinary's cloud storage, eliminating local file management while providing enterprise-grade image optimization and CDN delivery.

### Key Benefits

- Direct cloud upload to Cloudinary with automatic folder organization
- Automatic temporary file cleanup prevents disk space issues
- Three flexible upload patterns for different use cases
- Built-in file validation for security
- Enterprise features including image transformation and CDN
- Production-ready error handling

### Supported Image Formats

JPG, JPEG, JFIF, PNG, WEBP, GIF with 5MB maximum file size

---

## Configuration Setup

### Step 1: Cloudinary Account Setup

Create a free account at cloudinary.com. After registration, locate your cloud name, API key, and API secret in the dashboard dashboard. The free plan includes 25GB storage and 25GB monthly bandwidth.

### Step 2: Environment Configuration

Add Cloudinary credentials to your config file:

```typescript
// config/index.ts
export default {
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
};
```

Add to your .env file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 3: Import Middleware

```typescript
import { 
  uploadImageSingle, 
  uploadImageMultiple, 
  uploadImageFields 
} from "./middleware/imageUpload";
```

---

## Core Features

### Automatic Directory Management

The middleware automatically creates a tmp directory in your project root when the application starts. This directory stores files temporarily during upload. All files are automatically deleted after Cloudinary upload completes or fails.

### File Validation Security

Only image files with extensions jpg, jpeg, jfif, png, webp, or gif are allowed. Maximum file size is 5MB. Filenames are sanitized to remove potentially dangerous characters. Invalid files are rejected immediately with clear error messages.

### Cloudinary Integration

Images upload to a folder named mern_setup in your Cloudinary account. The folder name can be customized in the uploadToCloudinary function. Cloudinary returns secure HTTPS URLs ready for use in your application.

### Automatic Cleanup System

Every temporary file is deleted immediately after Cloudinary confirms successful upload. The cleanup runs even if upload fails, thanks to the finally block. This prevents disk space exhaustion in production.

### Error Resilience

Comprehensive error handling catches all failure scenarios. Failed uploads return consistent JSON responses. Console logging helps with debugging. The middleware never leaves temporary files behind.

---

## API Reference

### uploadImageSingle()

Creates middleware for single image upload from one form field.

**Syntax:** uploadImageSingle(fieldName?: string)

**Parameters:** fieldName is optional, defaults to "image". Specifies which form field contains the file.

**Returns:** Array of Express middleware functions

**What happens:** Multer receives file from specified field. File saves to tmp directory with unique name. File uploads to Cloudinary folder. Temporary file deletes. Cloudinary URL attaches to req.body[fieldName]. Controller receives request with URL ready to use.

**Example:**
```typescript
router.post('/avatar', uploadImageSingle('profile_pic'), updateAvatar);
```

---

### uploadImageMultiple()

Handles multiple images from a single form field.

**Syntax:** uploadImageMultiple(fieldName?: string)

**Parameters:** fieldName is optional, defaults to "images". This field accepts multiple files.

**Returns:** Array of Express middleware functions

**What happens:** Multer receives multiple files from same field. Each file saves with unique name. All files upload to Cloudinary in parallel using Promise.all. All temporary files delete after upload. Array of URLs attaches to req.body[fieldName].

**Example:**
```typescript
router.post('/gallery', uploadImageMultiple('photos'), uploadGallery);
```

---

### uploadImageFields()

Handles multiple images from different form fields.

**Syntax:** uploadImageFields(fieldNames: string[])

**Parameters:** fieldNames is required array of field names. Each field accepts one image.

**Returns:** Array of Express middleware functions

**What happens:** Multer receives files from multiple fields. Each field gets one image. All images upload to Cloudinary in parallel. Each URL attaches to req.body using its field name. All temporary files clean up automatically.

**Example:**
```typescript
router.post('/profile', uploadImageFields(['avatar', 'cover', 'id_card']), updateProfile);
```

---

### uploadToCloudinary()

Core upload function available for direct use.

**Syntax:** uploadToCloudinary(imagePath: string): Promise<string>

**Parameters:** imagePath is path to temporary image file

**Returns:** Promise resolving to Cloudinary secure_url

**Throws:** Error with message if upload fails

**Features:** Uploads to "mern_setup" folder. Uses auto resource type. Returns HTTPS URL. Auto-cleans temp file.

---

## Usage Examples

### Example 1: Single Image Upload for User Avatar

**Route:**
```typescript
router.post('/users/avatar', uploadImageSingle('avatar'), updateUserAvatar);
```

**Controller:**
```typescript
export const updateUserAvatar = async (req: Request, res: Response) => {
  const imageUrl = req.body.avatar;
  
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  
  await User.findByIdAndUpdate(req.user.id, { avatar: imageUrl });
  
  res.json({ success: true, url: imageUrl });
};
```

**Frontend:**
```javascript
const formData = new FormData();
formData.append('avatar', selectedFile);
fetch('/api/users/avatar', { method: 'POST', body: formData });
```

---

### Example 2: Multiple Images for Product Gallery

**Route:**
```typescript
router.post('/products/:id/images', uploadImageMultiple('gallery'), addProductImages);
```

**Controller:**
```typescript
export const addProductImages = async (req: Request, res: Response) => {
  const imageUrls = req.body.gallery;
  
  if (!imageUrls || imageUrls.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded' });
  }
  
  await Product.findByIdAndUpdate(req.params.id, {
    $push: { images: { $each: imageUrls } }
  });
  
  res.json({ success: true, count: imageUrls.length, urls: imageUrls });
};
```

**Frontend:**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('gallery', file));
fetch('/api/products/123/images', { method: 'POST', body: formData });
```

---

### Example 3: Multi-Field Profile Completion

**Route:**
```typescript
router.post('/profile/complete', 
  uploadImageFields(['avatar', 'cover_photo', 'id_document']), 
  completeProfile
);
```

**Controller:**
```typescript
export const completeProfile = async (req: Request, res: Response) => {
  const { avatar, cover_photo, id_document, fullName, bio } = req.body;
  
  if (!avatar || !id_document) {
    return res.status(400).json({ 
      success: false, 
      message: 'Avatar and ID document are required' 
    });
  }
  
  const profile = await Profile.create({
    userId: req.user.id,
    fullName,
    bio,
    avatar,
    coverPhoto: cover_photo,
    idDocument: id_document
  });
  
  res.status(201).json({ success: true, data: profile });
};
```

---

### Example 4: Blog Post with Optional Featured Image

**Route:**
```typescript
router.post('/blog/posts', uploadImageSingle('featured_image'), createBlogPost);
```

**Controller:**
```typescript
export const createBlogPost = async (req: Request, res: Response) => {
  const { title, content, featured_image } = req.body;
  
  const postData: any = { title, content };
  if (featured_image) {
    postData.featuredImage = featured_image;
  }
  
  const post = await BlogPost.create(postData);
  res.status(201).json({ success: true, data: post });
};
```

---

## Error Handling

### Error Responses

**File type error:**
```json
{
  "success": false,
  "message": "Upload failed",
  "error": "Only image files are allowed!"
}
```

**File size error:**
```json
{
  "success": false,
  "message": "Upload failed",
  "error": "File too large"
}
```

**Cloudinary configuration error:**
```json
{
  "success": false,
  "message": "Upload failed",
  "error": "Failed to upload image to Cloudinary"
}
```

**Multi-upload error:**
```json
{
  "success": false,
  "message": "Multi-upload failed",
  "error": "Error details here"
}
```

**Field upload error:**
```json
{
  "success": false,
  "message": "Field upload failed",
  "error": "Error details here"
}
```

---

## Best Practices

### Always Specify Field Names

Use explicit field names instead of defaults for clarity. This makes your code self-documenting and prevents confusion.

### Validate URLs in Controllers

Always check that uploaded URLs exist before saving to database. The middleware may pass through if no file was uploaded for optional fields.

### Handle Optional Uploads Gracefully

For optional images, check existence before using the URL. Use conditional logic to only include images that were actually uploaded.

### Use Environment Variables

Never hardcode Cloudinary credentials. Always load from environment variables using your config system.

### Monitor Cloudinary Usage

Keep track of your Cloudinary storage and bandwidth usage. The free tier has limits that production applications may exceed.

### Customize Folder Names

Change the folder name from "mern_setup" to something meaningful for your application like "user_avatars" or "product_images".

---

## Troubleshooting Guide

### Issue: Only image files are allowed

**Solution:** Verify your file extension matches allowed formats. The middleware checks file extension, not just MIME type.

### Issue: Files not deleting from tmp folder

**Solution:** Check file permissions on tmp directory. Node process needs write and delete permissions. Run chmod 755 tmp on Linux systems.

### Issue: Cloudinary configuration missing error

**Solution:** Verify all three Cloudinary credentials are in your config file and loaded correctly. Console log config values during startup to verify.

### Issue: Upload timeout or slow performance

**Solution:** Cloudinary uploads are usually fast. Check your internet connection. Large files near 5MB limit take longer.

### Issue: File too large error

**Solution:** Adjust file size limit in multer configuration. Change 5 * 1024 * 1024 to your desired limit like 10 * 1024 * 1024 for 10MB.

### Issue: req.body.fieldName is undefined

**Solution:** Ensure your frontend form field name matches exactly. Case-sensitive matching is required.

### Issue: Cloudinary folder not appearing

**Solution:** The folder "mern_setup" creates automatically on first upload. Check your Cloudinary media library after successful upload.

### Issue: CORS errors from frontend

**Solution:** Configure CORS in your Express app to allow your frontend domain. Use cors middleware with appropriate options.

---

## Summary

This Cloudinary image upload middleware provides a complete solution for handling image uploads in Express.js applications with these key features:

- Simple integration with just one line in your route
- Automatic cloud storage with Cloudinary
- Three flexible upload patterns for any scenario
- Built-in security with file validation
- Self-cleaning temporary file management
- Production-ready error handling

**Basic usage pattern:**
```typescript
router.post('/your-route', uploadImageSingle('field_name'), yourController);
```

The uploaded Cloudinary URL is automatically available at req.body.field_name. The middleware handles all complexity including file validation, cloud upload, temporary storage, and automatic cleanup. Your controller only receives successfully uploaded images ready to save to your database.
