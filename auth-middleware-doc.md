# 🛡️ Authentication Middleware Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Complete Code](#complete-code)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)
5. [Error Handling](#error-handling)

## 🎯 Overview

This authentication middleware provides JWT-based authentication and role-based access control (RBAC) for Express.js applications. It extracts tokens from cookies or Authorization headers, verifies them, validates user status, and checks role permissions.

## 💻 Complete Code

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../utils/apiError';
import httpStatus from 'http-status';
import { TUserRole } from '../module/user/user.interface';
import User from '../module/user/user.model';
import catchAsync from '../utils/catchAsync';

/**
 * Authentication Middleware
 * 
 * @description Verifies JWT token and authorizes users based on their roles
 * @param {...TUserRole[]} requiredRoles - Roles allowed to access the route
 * @returns {Function} Express middleware
 * 
 * @example
 * // Allow multiple roles
 * router.get('/dashboard', auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER), dashboardHandler);
 * 
 * @example
 * // Allow single role
 * router.delete('/user/:id', auth(USER_ROLE.SUPER_ADMIN), deleteUserHandler);
 * 
 * @example
 * // Allow any authenticated user
 * router.get('/profile', auth(), getProfileHandler);
 */
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract token from Cookies or Authorization Header
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    let token: string | undefined;

    if (cookieToken) {
      // Priority 1: Check Cookies
      token = cookieToken;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // Priority 2: Check Authorization Header
      token = authHeader.split(' ')[1];
    }

    // If no token is found in either place
    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized. Please login to access this resource.',
      );
    }

    let decoded: JwtPayload;

    try {
      // 2. Verify Token
      decoded = Jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

      const { _id, role } = decoded;

      // 3. Check if User exists in Database
      const user = await User.findById(_id);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'This user does not exist');
      }

      // 4. Check if Account is Deleted
      if (user.isDeleted) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'This account has been deleted.',
        );
      }

      // 5. Check if Account is Blocked
      if (user.status === 'blocked') {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Your account has been blocked by an administrator.',
        );
      }

      // 6. Role-Based Authorization
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have the required permissions to access this resource.',
        );
      }

      // 7. Attach Decoded User to Request Object
      req.user = decoded;
      next();
    } catch (err: any) {
      // Handle Specific JWT Errors
      if (err.name === 'TokenExpiredError') {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Session expired. Please login again.',
        );
      } else if (err.name === 'JsonWebTokenError') {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid session. Please provide a valid token.',
        );
      } else {
        throw new ApiError(
          err.statusCode || httpStatus.UNAUTHORIZED,
          err.message || 'Authentication failed.',
        );
      }
    }
  });
};

export default auth;
```

## 📝 Type Definitions

```typescript
// user.constent.ts
export const USER_ROLE = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super-admin',
  USER: 'user',
  DEVELOPER: 'developer',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export type TUserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

// user.interface.ts
import { USER_ROLE } from './user.constent';

export interface userInterface {
  name: string;
  image?: string;
  number?: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  isNewUser?: boolean;
  role: 'admin' | 'user' | 'manager' | 'staff' | 'developer' | 'super-admin';
  status?: 'in-progress' | 'blocked';
  isDeleted: boolean;
  email?: string;
}

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
```

## 📚 Usage Examples

### Basic Route Protection

```typescript
import express from 'express';
import auth from './middleware/auth';
import { USER_ROLE } from './user/user.constent';
import { AuthControllar } from './auth.controllar';

const router = express.Router();

// Public routes (no authentication)
router.post('/login', AuthControllar.loginControllar);
router.post('/forgot-password', AuthControllar.forgetPasswordControllar);

// Protected route - any authenticated user
router.get('/profile', auth(), AuthControllar.getMe);

// Role-specific routes
router.get('/dashboard', 
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPER_ADMIN), 
  AuthControllar.getDashboard
);

// Admin only routes
router.delete('/user/:id', 
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), 
  AuthControllar.deleteUser
);

// Your existing routes
router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.STAFF, USER_ROLE.USER),
  AuthControllar.getMe,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPER_ADMIN, USER_ROLE.DEVELOPER, USER_ROLE.STAFF, USER_ROLE.USER),
  AuthControllar.ChangePasswordControllar,
);

router.patch(
  '/change-password/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  AuthControllar.fromDashbaordChangePasswordControllar,
);
```

### Controller Example with User Data

```typescript
// auth.controllar.ts
import { Request, Response } from 'express';

export const AuthControllar = {
  // Get current user profile
  getMe: async (req: Request, res: Response) => {
    // User data is attached by auth middleware
    const { _id, role, email } = req.user;
    
    // Fetch full user data if needed
    const user = await User.findById(_id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  },
  
  // Change password
  ChangePasswordControllar: async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;
    
    // Update password logic
    await User.findByIdAndUpdate(userId, { password: newPassword });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  },
  
  // Admin changes user password
  fromDashbaordChangePasswordControllar: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    // Admin can change any user's password
    await User.findByIdAndUpdate(id, { password: newPassword });
    
    res.json({
      success: true,
      message: 'User password updated successfully'
    });
  }
};
```

## 📖 API Reference

### Function Signature
```typescript
auth(...requiredRoles: TUserRole[]): ExpressMiddleware
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `requiredRoles` | `...TUserRole[]` | No | `[]` | List of roles allowed to access the route |

### Available Roles
```typescript
USER_ROLE.SUPER_ADMIN   // 'super-admin'
USER_ROLE.ADMIN         // 'admin'
USER_ROLE.MANAGER       // 'manager'
USER_ROLE.DEVELOPER     // 'developer'
USER_ROLE.STAFF         // 'staff'
USER_ROLE.USER          // 'user'
```

### Request Object Enhancement
After successful authentication, `req.user` contains:
```typescript
req.user = {
  _id: string,    // User ID
  role: string,   // User role
  email?: string, // User email (if available)
  iat: number,    // Token issued at
  exp: number     // Token expiration
}
```

## 🚨 Error Handling

### Error Responses

| Status Code | Error Message | When it occurs |
|-------------|--------------|----------------|
| 401 | You are not authorized. Please login to access this resource. | No token provided |
| 401 | Session expired. Please login again. | JWT token expired |
| 401 | Invalid session. Please provide a valid token. | Invalid JWT token |
| 403 | This account has been deleted. | User `isDeleted` is true |
| 403 | Your account has been blocked by an administrator. | User `status` is 'blocked' |
| 403 | You do not have the required permissions to access this resource. | User role not in `requiredRoles` |
| 404 | This user does not exist | User not found in database |

### Error Response Format

```typescript
{
  success: false,
  message: "Error message here",
  statusCode: 401 | 403 | 404,
  stack?: string // Only in development
}
```

### Handling Errors in Routes

```typescript
// Your routes automatically handle errors through catchAsync
router.get('/protected', auth(USER_ROLE.ADMIN), async (req, res) => {
  // If any error occurs, catchAsync will send proper response
  const data = await someAsyncOperation();
  res.json({ success: true, data });
});
```

## ✅ Summary

This middleware provides:
- **Token extraction** from cookies or Authorization header
- **JWT verification** with expiration handling
- **User validation** (exists, not deleted, not blocked)
- **Role-based access control** for 6 user roles
- **Automatic error handling** through catchAsync
- **Type safety** with TypeScript

Simply import and use in your routes with the appropriate roles! 🚀
