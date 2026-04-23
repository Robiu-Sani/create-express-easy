

## Table of Contents
1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Core Features](#core-features)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This comprehensive image upload middleware provides a robust, secure, and flexible solution for handling image uploads in Express.js applications. It seamlessly integrates with the FreeImage.host API to automatically upload images to cloud storage, eliminating the need for local image persistence while maintaining high performance and security standards.

### Key Benefits

- **Automatic Cloud Upload**: Images are instantly uploaded to FreeImage.host and never stored locally
- **Automatic Cleanup**: Temporary files are deleted immediately after successful upload or error
- **Multiple Upload Patterns**: Support for single, multiple, and multi-field image uploads
- **Security First**: File type validation, size limits, and sanitized filenames
- **Production Ready**: Built with error handling, TypeScript support, and configurable limits

### Use Cases

- User profile picture uploads
- Product image galleries for e-commerce
- Blog post featured images
- Multi-image document uploads
- Gallery management systems
- Social media content uploads
- Real estate property images
- Event management photo submissions

---

## Configuration

### Step 1: Configure Your Environment

Create or update your `config/index.ts` file:

```typescript
// config/index.ts
export default {
  // Other configurations...
  
  freeimagehost_api_key: "YOUR_FREEIMAGE_HOST_API_KEY",
  freeimagehost_url: "https://freeimage.host/api/1/upload",
  
  // Optional: Adjust upload limits
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']
  }
};
```

### Step 2: Get FreeImage.host API Key

1. Visit [FreeImage.host](https://freeimage.host/)
2. Create a free account
3. Navigate to "API" section in your dashboard
4. Generate your unique API key
5. Copy the key to your configuration

### Step 3: Import Middleware in Your App

```typescript
// app.ts or server.ts
import express from 'express';
import { 
  uploadImageSingle, 
  uploadImageMultiple, 
  uploadImageFields 
} from './middleware/imageUpload';

const app = express();

// Your routes will be defined here
```

---

## Core Features

### 1. **Automatic Temporary Directory Management**
   - Creates a `tmp` directory automatically if it doesn't exist
   - Uses unique filenames with timestamps to prevent collisions
   - Sanitizes original filenames to prevent injection attacks

### 2. **File Validation & Security**
   - **File Type Validation**: Only allows image formats (jpg, jpeg, png, gif, webp, jfif)
   - **Size Limiting**: Maximum 5MB file size (configurable)
   - **Filename Sanitization**: Removes potentially dangerous characters
   - **MIME Type Checking**: Validates actual file content

### 3. **Automatic Cleanup**
   - Temporary files are deleted after successful upload
   - Files are also deleted if upload fails
   - Prevents accumulation of orphaned files

### 4. **Error Resilience**
   - Comprehensive try-catch blocks
   - Graceful error handling with meaningful messages
   - Always cleans up temp files in finally blocks

---

## API Reference

### Function: `uploadImageSingle()`

Creates middleware for handling single image upload from a form field.

#### Syntax
```typescript
uploadImageSingle(fieldName?: string): Express.Middleware[]
```

#### Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldName` | `string` | `"image"` | The name of the form field containing the image |

#### Returns
Array of Express middleware functions that process the upload and attach the image URL to `req.body[fieldName]`.

#### What Happens Behind the Scenes
1. Multer receives the uploaded file from the specified form field
2. File is temporarily saved to the `tmp` directory with a unique, sanitized filename
3. The file is automatically uploaded to FreeImage.host API
4. Upon successful upload, the temporary file is deleted
5. The returned image URL is attached to `req.body[fieldName]`
6. If upload fails, the temporary file is still deleted and an error response is sent

#### Example Usage
```typescript
router.post('/avatar', uploadImageSingle('avatar'), updateAvatarController);
```

---

### Function: `uploadImageMultiple()`

Handles multiple image uploads from a single form field (array of files).

#### Syntax
```typescript
uploadImageMultiple(fieldName?: string): Express.Middleware[]
```

#### Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `fieldName` | `string` | `"images"` | The form field name containing multiple images |

#### Returns
Array of middleware functions that upload all images and attach an array of URLs to `req.body[fieldName]`.

#### What Happens Behind the Scenes
1. Multer receives multiple files from the same form field
2. Each file is temporarily saved with unique names
3. All files are uploaded to FreeImage.host in parallel using Promise.all()
4. After all uploads complete (or fail), all temporary files are cleaned up
5. An array of image URLs is attached to `req.body[fieldName]`

#### Example Usage
```typescript
router.post('/gallery', uploadImageMultiple('product_images'), uploadGalleryController);
```

---

### Function: `uploadImageFields()`

Handles multiple image uploads from different form fields simultaneously.

#### Syntax
```typescript
uploadImageFields(fieldNames: string[]): Express.Middleware[]
```

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `fieldNames` | `string[]` | Array of form field names that will contain images |

#### Returns
Array of middleware functions that upload all images and attach each URL to `req.body[fieldName]`.

#### What Happens Behind the Scenes
1. Multer receives files from multiple different form fields
2. Each field can contain one image (maxCount: 1 per field)
3. Files are uploaded in parallel to FreeImage.host
4. Each image URL is attached to `req.body[fieldName]` using its respective field name
5. All temporary files are automatically cleaned up after processing

#### Example Usage
```typescript
router.post('/profile', 
  uploadImageFields(['avatar', 'cover_photo', 'thumbnail']), 
  updateProfileController
);
```

---

### Function: `uploadSingleImageToService()`

Core function that handles the actual upload to FreeImage.host. Used internally but available for direct use.

#### Syntax
```typescript
uploadSingleImageToService(imagePath: string): Promise<string>
```

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `imagePath` | `string` | Absolute or relative path to the temporary image file |

#### Returns
`Promise<string>` - The URL of the uploaded image

#### Throws
Error if API configuration is missing or upload fails

---

### Function: `uploadImageSingleInService()`

Service-layer wrapper for direct image uploads without middleware.

#### Syntax
```typescript
uploadImageSingleInService(imagePath: string): Promise<string>
```

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `imagePath` | `string` | Path to the image file to upload |

#### Returns
`Promise<string>` - The URL of the uploaded image

---

## Usage Examples

### Example 1: Basic Single Image Upload

**Route Definition:**
```typescript
// routes/userRoutes.ts
import { Router } from 'express';
import { uploadImageSingle } from '../middleware/imageUpload';
import { updateProfilePicture } from '../controllers/userController';

const router = Router();

router.post(
  '/profile-picture', 
  uploadImageSingle('profile_image'), 
  updateProfilePicture
);

export default router;
```

**Controller:**
```typescript
// controllers/userController.ts
import { Request, Response } from 'express';

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    // The image URL is automatically attached to req.body.profile_image
    const imageUrl = req.body.profile_image;
    
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No image was uploaded'
      });
    }
    
    // Save to database
    await User.findByIdAndUpdate(req.user.id, {
      profilePicture: imageUrl
    });
    
    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { imageUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: error.message
    });
  }
};
```

**Frontend Form (React Example):**
```jsx
const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profile_image', file);
  
  const response = await fetch('/api/users/profile-picture', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded image URL:', result.data.imageUrl);
};
```

---

### Example 2: Multiple Images Upload (Product Gallery)

**Route Definition:**
```typescript
// routes/productRoutes.ts
import { Router } from 'express';
import { uploadImageMultiple } from '../middleware/imageUpload';
import { addProductImages } from '../controllers/productController';

const router = Router();

router.post(
  '/:productId/images',
  uploadImageMultiple('gallery_images'),
  addProductImages
);

export default router;
```

**Controller:**
```typescript
// controllers/productController.ts
import { Request, Response } from 'express';

export const addProductImages = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    // req.body.gallery_images contains an array of image URLs
    const imageUrls = req.body.gallery_images;
    
    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images were uploaded'
      });
    }
    
    // Save all image URLs to database
    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { images: { $each: imageUrls } } },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: `${imageUrls.length} images uploaded successfully`,
      data: { images: imageUrls, product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload product images',
      error: error.message
    });
  }
};
```

**Frontend Multiple File Upload:**
```jsx
const uploadProductImages = async (files) => {
  const formData = new FormData();
  
  // Append all files with the same field name
  for (let i = 0; i < files.length; i++) {
    formData.append('gallery_images', files[i]);
  }
  
  const response = await fetch('/api/products/123/images', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded gallery URLs:', result.data.images);
};
```

---

### Example 3: Multi-Field Image Upload (Complete Profile)

**Route Definition:**
```typescript
// routes/profileRoutes.ts
import { Router } from 'express';
import { uploadImageFields } from '../middleware/imageUpload';
import { completeProfile } from '../controllers/profileController';

const router = Router();

router.post(
  '/complete',
  uploadImageFields(['avatar', 'cover_photo', 'id_card']),
  completeProfile
);

export default router;
```

**Controller:**
```typescript
// controllers/profileController.ts
import { Request, Response } from 'express';

export const completeProfile = async (req: Request, res: Response) => {
  try {
    // Each field's image URL is attached separately
    const { avatar, cover_photo, id_card, username, bio } = req.body;
    
    // Validate all required images are present
    if (!avatar || !cover_photo || !id_card) {
      return res.status(400).json({
        success: false,
        message: 'Please upload all required images: avatar, cover photo, and ID card'
      });
    }
    
    // Save complete profile data
    const profile = await Profile.create({
      userId: req.user.id,
      username,
      bio,
      avatar,
      coverPhoto: cover_photo,
      idCard: id_card
    });
    
    res.status(201).json({
      success: true,
      message: 'Profile completed successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete profile',
      error: error.message
    });
  }
};
```

**Frontend Multi-Field Upload:**
```jsx
const completeProfileForm = async (formData) => {
  const apiFormData = new FormData();
  
  // Append text fields
  apiFormData.append('username', formData.username);
  apiFormData.append('bio', formData.bio);
  
  // Append image files with different field names
  apiFormData.append('avatar', formData.avatarFile);
  apiFormData.append('cover_photo', formData.coverFile);
  apiFormData.append('id_card', formData.idCardFile);
  
  const response = await fetch('/api/profile/complete', {
    method: 'POST',
    body: apiFormData
  });
  
  const result = await response.json();
  console.log('Profile URLs:', {
    avatar: result.data.avatar,
    cover: result.data.coverPhoto,
    idCard: result.data.idCard
  });
};
```

---

### Example 4: Conditional Upload (Optional Images)

**Route Definition:**
```typescript
// routes/blogRoutes.ts
import { Router } from 'express';
import { uploadImageSingle } from '../middleware/imageUpload';
import { createBlogPost } from '../controllers/blogController';

const router = Router();

router.post(
  '/posts',
  uploadImageSingle('featured_image'), // This field is optional
  createBlogPost
);

export default router;
```

**Controller with Optional Image:**
```typescript
// controllers/blogController.ts
import { Request, Response } from 'express';

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    // featured_image may or may not exist in req.body
    const featuredImage = req.body.featured_image || null;
    
    const postData: any = {
      title,
      content,
      tags: tags ? tags.split(',') : []
    };
    
    // Only add featured image if it was uploaded
    if (featuredImage) {
      postData.featuredImage = featuredImage;
    }
    
    const post = await BlogPost.create(postData);
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};
```

---

### Example 5: Complete E-commerce Product Creation

**Route Definition:**
```typescript
// routes/productRoutes.ts
import { Router } from 'express';
import { uploadImageFields } from '../middleware/imageUpload';
import { createProduct } from '../controllers/productController';

const router = Router();

router.post(
  '/products',
  uploadImageFields(['main_image', 'hover_image', 'catalog_image']),
  createProduct
);

export default router;
```

**Controller:**
```typescript
// controllers/productController.ts
import { Request, Response } from 'express';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      category,
      main_image,
      hover_image,
      catalog_image
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !main_image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, and main_image are required'
      });
    }
    
    const product = await Product.create({
      name,
      price: parseFloat(price),
      description,
      category,
      images: {
        main: main_image,
        hover: hover_image || null,
        catalog: catalog_image || null
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};
```

---

### Example 6: User Registration with Avatar

**Route Definition:**
```typescript
// routes/authRoutes.ts
import { Router } from 'express';
import { uploadImageSingle } from '../middleware/imageUpload';
import { registerUser } from '../controllers/authController';

const router = Router();

router.post(
  '/register',
  uploadImageSingle('avatar'),
  registerUser
);

export default router;
```

**Controller:**
```typescript
// controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username, fullName, avatar } = req.body;
    
    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and username are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      fullName,
      avatar: avatar || null, // Use uploaded avatar or null
      createdAt: new Date()
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};
```

---

## Error Handling

### Common Error Responses

The middleware automatically handles errors and returns consistent JSON responses:

#### 1. **File Type Error**
```json
{
  "success": false,
  "message": "Error uploading image",
  "error": "Only image files are allowed!"
}
```

#### 2. **File Size Error**
```json
{
  "success": false,
  "message": "Error uploading image",
  "error": "File too large"
}
```

#### 3. **API Configuration Error**
```json
{
  "success": false,
  "message": "Error uploading image",
  "error": "Image hosting API configuration missing in config file"
}
```

#### 4. **Upload Failed Error**
```json
{
  "success": false,
  "message": "Error uploading image",
  "error": "Invalid response from image hosting service"
}
```

#### 5. **Multi-Field Upload Error**
```json
{
  "success": false,
  "message": "Error uploading multi-field images",
  "error": "Detailed error message here"
}
```

### Handling Errors in Your Controller

```typescript
export const myController = async (req: Request, res: Response) => {
  try {
    // The middleware would have already sent an error response
    // if upload failed, so if we reach here, upload succeeded
    const imageUrl = req.body.image;
    
    // Your business logic here
  } catch (error) {
    // This catch block handles errors from your business logic
    // not from the upload middleware
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
```

---

## Best Practices

### 1. **Always Specify Field Names**
```typescript
// Good - explicit field name
router.post('/avatar', uploadImageSingle('profile_picture'), controller);

// Bad - uses default 'image'
router.post('/avatar', uploadImageSingle(), controller);
```

### 2. **Validate Uploaded URLs in Controllers**
```typescript
export const updateProfile = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  
  // Always check if the upload was successful
  if (!avatar) {
    return res.status(400).json({
      success: false,
      message: 'Avatar upload failed or was not provided'
    });
  }
  
  // Proceed with your logic
};
```

### 3. **Handle Optional Uploads Gracefully**
```typescript
router.post('/post', uploadImageSingle('thumbnail'), createPost);

export const createPost = async (req: Request, res: Response) => {
  const { thumbnail } = req.body;
  
  const postData = {
    title: req.body.title,
    content: req.body.content,
    // thumbnail might be undefined - that's fine for optional images
    ...(thumbnail && { thumbnail })
  };
  
  await Post.create(postData);
};
```

### 4. **Use Environment Variables for API Keys**
```typescript
// config/index.ts
export default {
  freeimagehost_api_key: process.env.FREEIMAGEHOST_API_KEY,
  freeimagehost_url: process.env.FREEIMAGEHOST_URL || "https://freeimage.host/api/1/upload"
};
```

### 5. **Add Request Size Limits to Express**
```typescript
// app.ts
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### 6. **Log Upload Errors for Monitoring**
```typescript
// In your middleware or controller
try {
  const imageUrl = await uploadSingleImageToService(file.path);
  return imageUrl;
} catch (error) {
  console.error(`[ImageUpload] Failed for file ${file.originalname}:`, error);
  throw error;
}
```

---

## Troubleshooting

### Issue 1: "Only image files are allowed!"

**Solution:** Ensure you're uploading a valid image file with one of these extensions: `.jpg`, `.jpeg`, `.jfif`, `.png`, `.webp`, `.gif`

### Issue 2: Files are not being deleted from tmp folder

**Solution:** Check file permissions on the tmp directory. The Node.js process needs write/delete permissions.

```bash
chmod 755 tmp
```

### Issue 3: "Image hosting API configuration missing"

**Solution:** Verify your config file has the correct API key and URL:

```typescript
console.log(config.freeimagehost_api_key); // Should not be undefined
console.log(config.freeimagehost_url);     // Should be valid URL
```

### Issue 4: Upload timeout or slow performance

**Solution:** Increase axios timeout in the middleware:

```typescript
const uploadRes = await axios.post(apiurl, formData, {
  headers: formData.getHeaders(),
  timeout: 30000 // 30 seconds
});
```

### Issue 5: "File too large" error

**Solution:** Adjust the file size limit in the multer configuration:

```typescript
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increase to 10MB
  },
});
```

### Issue 6: req.body.fieldName is undefined after upload

**Solution:** Make sure your form field name matches exactly:

```javascript
// Frontend
formData.append('profile_image', file); // Matches field name

// Backend
uploadImageSingle('profile_image') // Must match exactly
```

### Issue 7: CORS errors when calling from frontend

**Solution:** Configure CORS in your Express app:

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

---

## Summary

This image upload middleware provides a complete, production-ready solution for handling image uploads in your Express.js applications. Key takeaways:

- **Simple Integration**: Just add the middleware to your routes
- **Automatic Cloud Storage**: No need to manage local image storage
- **Multiple Patterns**: Support for single, multiple, and multi-field uploads
- **Secure by Default**: File validation and sanitization built-in
- **Self-Cleaning**: Temporary files are automatically deleted

**Basic Usage Pattern:**
```typescript
router.post('/your-route', uploadImageSingle('field_name'), yourController);
```

The middleware handles all the complexity of file uploads, cloud storage integration, and cleanup, allowing you to focus on your business logic. The uploaded image URL will be available in `req.body.field_name` for you to use as needed.
