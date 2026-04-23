# Complete Express.js API Router Documentation: Package Router Setup System

## Table of Contents
1. Overview of Router System
2. Module Router Complete Guide
3. Version Router Complete Guide
4. Application Router Mounting Guide
5. Authentication Middleware Integration
6. File Upload Middleware Integration
7. Route Organization Patterns
8. Complete Router Examples
9. Best Practices for Router Setup

---

## Overview of Router System

This router setup system is designed for the create-express-easy package. It provides a clean, organized way to structure all your API routes. The system uses three main layers. Module routers handle specific features like users or products. Version routers group module routers by API version. The main application mounts all version routers.

### Core Philosophy

Every route belongs to a module. Every module has its own router file. This keeps your codebase organized and maintainable. When you need to add a new feature, you create a new module router. When you need to change an existing feature, you know exactly where to look.

### Benefits of This Structure

You can find any route quickly because each module is separate. Multiple developers can work on different modules without conflicts. API versioning is built-in from the start. Adding new endpoints never breaks existing ones. The pattern is consistent across your entire application.

---

## Module Router Complete Guide

### What Is a Module Router

A module router is an Express router instance that handles all HTTP routes for a specific domain entity. Examples include user router, product router, order router, and auth router. Each module router lives in its own folder with related files like controller, service, model, and constants.

### Standard Module Router Structure

Every module router follows the same pattern. Import Express and create a router instance. Import the module controller for business logic. Import necessary middleware like auth and upload handlers. Import constants like user roles. Define routes with proper HTTP methods. Export the router for use in version aggregation.

### User Module Router Complete Example

```typescript
// module/user/user.router.ts
import express from 'express';
import UserController from './user.controller';
import { uploadImageSingle } from '../../middleware/upload-image-cloudinary';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// ============================
// RETRIEVAL ROUTES
// ============================

// Get all users with search, filter, and pagination
// Query parameters: page, limit, role, status, gender, search
router.get(
  '/', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER), 
  UserController.getAllUsersController
);

// Get single user by ID
router.get(
  '/:id', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.USER), 
  UserController.getSingleUserController
);

// Get user profile (own profile)
router.get(
  '/me/profile',
  auth(USER_ROLE.USER, USER_ROLE.STAFF, USER_ROLE.MANAGER, USER_ROLE.ADMIN),
  UserController.getMyProfileController
);

// ============================
// ACTION ROUTES
// ============================

// Create new user with profile image upload
router.post(
  '/', 
  uploadImageSingle('image'), 
  UserController.createUserController
);

// Update existing user with optional image upload
router.patch(
  '/:id', 
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.STAFF, USER_ROLE.USER),
  uploadImageSingle('image'), 
  UserController.updateSingleUserController
);

// Soft delete user (hide instead of remove)
router.delete(
  '/:id', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER),
  UserController.deleteSingleUserController
);

// Permanently delete user (hard delete)
router.delete(
  '/:id/permanent',
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.permanentDeleteUserController
);

// Restore soft-deleted user
router.patch(
  '/:id/restore',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.restoreUserController
);

// Change user password
router.patch(
  '/:id/change-password',
  auth(USER_ROLE.USER, USER_ROLE.STAFF, USER_ROLE.MANAGER, USER_ROLE.ADMIN),
  UserController.changePasswordController
);

// ============================
// BULK OPERATION ROUTES
// ============================

// Update multiple users' roles at once
// Body: { userIds: ["id1", "id2"], role: "admin" }
router.patch(
  '/bulk/update-role', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER),
  UserController.updateManyUsersRoleController
);

// Update multiple users' status at once
// Body: { userIds: ["id1", "id2"], status: "blocked" }
router.patch(
  '/bulk/update-status', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.updateManyUsersStatusController
);

// Update multiple users' deletion status
// Body: { userIds: ["id1", "id2"], isDeleted: true }
router.patch(
  '/bulk/update-is-deleted',
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.updateManyUsersIsDeletedController
);

// Bulk delete users (soft delete multiple)
router.patch(
  '/bulk/delete',
  auth(USER_ROLE.SUPER_ADMIN),
  UserController.bulkSoftDeleteUsersController
);

// Bulk restore users
router.patch(
  '/bulk/restore',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.bulkRestoreUsersController
);

// ============================
// STATISTICS ROUTES
// ============================

// Get user statistics (total, active, blocked, etc.)
router.get(
  '/stats/overview',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserController.getUserStatisticsController
);

export const userRouter = router;
```

### Product Module Router Example

```typescript
// module/product/product.router.ts
import express from 'express';
import ProductController from './product.controller';
import { uploadImageMultiple } from '../../middleware/upload-image-cloudinary';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// ============================
// PUBLIC ROUTES (No Authentication)
// ============================

// Get all products (public storefront)
router.get('/', ProductController.getAllProductsController);

// Get single product by ID or slug
router.get('/:id', ProductController.getSingleProductController);

// Search products
router.get('/search/:query', ProductController.searchProductsController);

// Get products by category
router.get('/category/:categoryId', ProductController.getProductsByCategoryController);

// ============================
// ADMIN ROUTES (Authentication Required)
// ============================

// Create product with multiple images
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  uploadImageMultiple('images'),
  ProductController.createProductController
);

// Update product
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  uploadImageMultiple('images'),
  ProductController.updateProductController
);

// Delete product
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ProductController.deleteProductController
);

// Update product stock
router.patch(
  '/:id/stock',
  auth(USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.MANAGER),
  ProductController.updateStockController
);

// Bulk product upload via CSV
router.post(
  '/bulk/upload',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  ProductController.bulkUploadProductsController
);

export const productRouter = router;
```

### Auth Module Router Example

```typescript
// module/auth/auth.router.ts
import express from 'express';
import AuthController from './auth.controller';
import { uploadImageSingle } from '../../middleware/upload-image-cloudinary';
import auth from '../../middleware/auth';

const router = express.Router();

// ============================
// PUBLIC AUTH ROUTES
// ============================

// User registration with profile image
router.post(
  '/register',
  uploadImageSingle('avatar'),
  AuthController.registerController
);

// User login
router.post('/login', AuthController.loginController);

// Refresh access token using refresh token
router.post('/refresh-token', AuthController.refreshTokenController);

// Forgot password - send reset email
router.post('/forgot-password', AuthController.forgotPasswordController);

// Reset password with token
router.post('/reset-password', AuthController.resetPasswordController);

// Verify email address
router.get('/verify-email/:token', AuthController.verifyEmailController);

// ============================
// PROTECTED AUTH ROUTES
// ============================

// User logout
router.post('/logout', auth(), AuthController.logoutController);

// Change password (authenticated users only)
router.patch('/change-password', auth(), AuthController.changePasswordController);

// Get current authenticated user
router.get('/me', auth(), AuthController.getCurrentUserController);

// Update profile
router.patch(
  '/profile',
  auth(),
  uploadImageSingle('avatar'),
  AuthController.updateProfileController
);

export const authRouter = router;
```

### Order Module Router Example

```typescript
// module/order/order.router.ts
import express from 'express';
import OrderController from './order.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// ============================
// USER ORDER ROUTES
// ============================

// Create new order
router.post('/', auth(USER_ROLE.USER), OrderController.createOrderController);

// Get my orders (authenticated user's own orders)
router.get('/my-orders', auth(USER_ROLE.USER), OrderController.getMyOrdersController);

// Get single order by ID
router.get('/:id', auth(USER_ROLE.USER, USER_ROLE.ADMIN), OrderController.getSingleOrderController);

// Cancel order
router.patch('/:id/cancel', auth(USER_ROLE.USER), OrderController.cancelOrderController);

// ============================
// ADMIN ORDER ROUTES
// ============================

// Get all orders (admin only)
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.MANAGER),
  OrderController.getAllOrdersController
);

// Update order status
router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  OrderController.updateOrderStatusController
);

// Process refund
router.post(
  '/:id/refund',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.processRefundController
);

// Get order statistics
router.get(
  '/stats/dashboard',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.getOrderStatisticsController
);

export const orderRouter = router;
```

---

## Version Router Complete Guide

### Version 1 Router Setup

The version router aggregates all module routers under a specific API version. This allows you to maintain multiple API versions simultaneously.

```typescript
// routers/v1/index.ts
import express from 'express';
import { authRouter } from '../../module/auth/auth.router';
import { userRouter } from '../../module/user/user.router';
import { productRouter } from '../../module/product/product.router';
import { orderRouter } from '../../module/order/order.router';
import { categoryRouter } from '../../module/category/category.router';

const routerV1 = express.Router();

// Module routes configuration array
const moduleRoutes = [
  {
    path: '/auth',
    route: authRouter,
    description: 'Authentication endpoints'
  },
  {
    path: '/users',
    route: userRouter,
    description: 'User management endpoints'
  },
  {
    path: '/products',
    route: productRouter,
    description: 'Product management endpoints'
  },
  {
    path: '/orders',
    route: orderRouter,
    description: 'Order management endpoints'
  },
  {
    path: '/categories',
    route: categoryRouter,
    description: 'Category management endpoints'
  }
];

// Version info endpoint
routerV1.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Version 1 API - MERN Setup System',
    version: '1.0.0',
    endpoints: moduleRoutes.map(route => ({
      path: `/api/v1${route.path}`,
      description: route.description
    })),
    documentation: 'https://api-docs.example.com/v1',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Mount all module routes
moduleRoutes.forEach((route) => {
  routerV1.use(route.path, route.route);
});

export default routerV1;
```

### Version 2 Router with Breaking Changes

```typescript
// routers/v2/index.ts
import express from 'express';
import { authRouterV2 } from '../../module/auth/auth.router.v2';
import { userRouterV2 } from '../../module/user/user.router.v2';
import { productRouterV2 } from '../../module/product/product.router.v2';

const routerV2 = express.Router();

const moduleRoutesV2 = [
  {
    path: '/auth',
    route: authRouterV2,
    description: 'Authentication with OAuth2 support'
  },
  {
    path: '/users',
    route: userRouterV2,
    description: 'User management with new role system'
  },
  {
    path: '/products',
    route: productRouterV2,
    description: 'Product management with variants support'
  }
];

routerV2.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Version 2 API',
    version: '2.0.0',
    breakingChanges: [
      'Response structure has been simplified',
      'Authentication now requires Bearer token only',
      'Role names have been updated',
      'Pagination parameters changed to page and limit'
    ],
    migrationGuide: 'https://api-docs.example.com/v2/migration',
    deprecatedEndpoints: ['/api/v1/users/bulk/update-status']
  });
});

moduleRoutesV2.forEach((route) => {
  routerV2.use(route.path, route.route);
});

export default routerV2;
```

---

## Application Router Mounting Guide

### Main Application File with Router Mounting

```typescript
// app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import routerV1 from './routers/v1';
import routerV2 from './routers/v2';
import config from './config';

const app: Application = express();

// ============================
// GLOBAL MIDDLEWARES
// ============================

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', config.frontend_url as string],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (config.node_env === 'development') {
  app.use(morgan('dev'));
}

// ============================
// API ROUTES MOUNTING
// ============================

// Mount version 1 routes at /api/v1
app.use('/api/v1', routerV1);

// Mount version 2 routes at /api/v2
app.use('/api/v2', routerV2);

// ============================
// ROOT AND HEALTH ROUTES
// ============================

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Code Biruni API - System is Live',
    data: {
      versions: {
        v1: '/api/v1',
        v2: '/api/v2'
      },
      environment: config.node_env,
      server_time: new Date().toISOString(),
      uptime: process.uptime().toFixed(2) + ' seconds'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================
// ERROR HANDLING MIDDLEWARES
// ============================

app.use(notFound);
app.use(globalErrorHandler);

export default app;
```

---

## Authentication Middleware Integration

### Auth Middleware Usage in Routes

The auth middleware protects routes by verifying JWT tokens and checking user roles. It accepts multiple role arguments.

```typescript
// Example showing different auth patterns

// No authentication - public route
router.get('/public', ProductController.getPublicData);

// Any authenticated user (no role check)
router.get('/protected', auth(), UserController.getProtectedData);

// Single role required
router.get('/admin-only', auth(USER_ROLE.ADMIN), AdminController.getAdminData);

// Multiple roles allowed (any of these roles)
router.get('/staff-area', auth(USER_ROLE.STAFF, USER_ROLE.MANAGER, USER_ROLE.ADMIN), StaffController.getStaffData);

// Super admin only - highest privilege
router.delete('/system', auth(USER_ROLE.SUPER_ADMIN), SystemController.deleteSystemData);

// User can access their own resource
router.get('/my-profile', auth(USER_ROLE.USER, USER_ROLE.STAFF, USER_ROLE.ADMIN), UserController.getMyProfile);
```

---

## File Upload Middleware Integration

### Upload Middleware Usage Patterns

```typescript
// Single image upload to Cloudinary
router.post(
  '/upload-avatar',
  uploadImageSingle('avatar'), // 'avatar' is the form field name
  UserController.uploadAvatar
);

// Multiple images upload from same field
router.post(
  '/upload-gallery',
  uploadImageMultiple('gallery_images'), // Field accepts multiple files
  ProductController.uploadGallery
);

// Multiple different image fields
router.post(
  '/complete-profile',
  uploadImageFields(['profile_image', 'cover_image', 'id_card_image']),
  ProfileController.completeProfile
);
```

---

## Route Organization Best Practices

### Route Order Matters

Place specific routes before parameter routes. This prevents route matching conflicts.

```typescript
// GOOD - Specific routes first
router.get('/me/profile', UserController.getMyProfile);
router.get('/stats/overview', UserController.getStatistics);
router.get('/:id', UserController.getSingleUser);

// BAD - Parameter route catches everything
router.get('/:id', UserController.getSingleUser);
router.get('/me/profile', UserController.getMyProfile); // This will never match
```

### HTTP Method Guidelines

Use GET for retrieving data without side effects. Use POST for creating new resources. Use PATCH for partial updates. Use PUT for complete replacements. Use DELETE for removing resources.

### Naming Conventions

Use plural nouns for resource names like users, products, orders. Use hyphenated names for multi-word resources like user-profiles. Use nested routes for related resources like users/userId/orders.

---

## Complete Router Examples

### Full User Router with All Features

```typescript
// module/user/user.router.ts (Complete)
import express from 'express';
import UserController from './user.controller';
import { uploadImageSingle } from '../../middleware/upload-image-cloudinary';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// Public routes (no auth)
router.post('/', uploadImageSingle('image'), UserController.createUserController);

// Authentication required routes
router.get('/', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER), UserController.getAllUsersController);
router.get('/me/profile', auth(USER_ROLE.USER, USER_ROLE.STAFF, USER_ROLE.ADMIN), UserController.getMyProfileController);
router.get('/stats/overview', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.getUserStatisticsController);
router.get('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.USER), UserController.getSingleUserController);

router.patch('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.STAFF, USER_ROLE.USER), uploadImageSingle('image'), UserController.updateSingleUserController);
router.patch('/:id/change-password', auth(USER_ROLE.USER, USER_ROLE.STAFF, USER_ROLE.ADMIN), UserController.changePasswordController);
router.patch('/:id/restore', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.restoreUserController);

router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER), UserController.deleteSingleUserController);
router.delete('/:id/permanent', auth(USER_ROLE.SUPER_ADMIN), UserController.permanentDeleteUserController);

// Bulk operations
router.patch('/bulk/update-role', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.updateManyUsersRoleController);
router.patch('/bulk/update-status', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.updateManyUsersStatusController);
router.patch('/bulk/update-is-deleted', auth(USER_ROLE.SUPER_ADMIN), UserController.updateManyUsersIsDeletedController);
router.patch('/bulk/delete', auth(USER_ROLE.SUPER_ADMIN), UserController.bulkSoftDeleteUsersController);
router.patch('/bulk/restore', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), UserController.bulkRestoreUsersController);

export const userRouter = router;
```

### Version Router Export Pattern

```typescript
// routers/index.ts - Main router aggregator
import routerV1 from './v1';
import routerV2 from './v2';

export const routers = {
  v1: routerV1,
  v2: routerV2
};
```

---

## Best Practices Summary

Always group related routes in the same module router. Use consistent naming across all routers. Apply authentication middleware to protected routes. Place specific routes before parameterized routes. Use HTTP methods appropriately for each operation. Keep router files focused on routing only. Export routers using clear, consistent names. Document endpoint purposes in comments. Version your APIs from the start. Test all routes before deployment.
