# Complete Module Documentation for Express MongoDB Project

## 📁 Project Structure Overview

```
src/
├── modules/
│   ├── order/
│   │   ├── order.interface.ts
│   │   ├── order.model.ts
│   │   ├── order.service.ts
│   │   ├── order.controller.ts
│   │   ├── order.route.ts
│   │   └── order.validation.ts (optional)
│   ├── product/
│   │   ├── product.interface.ts
│   │   ├── product.model.ts
│   │   ├── product.service.ts
│   │   ├── product.controller.ts
│   │   ├── product.route.ts
│   │   └── product.validation.ts
│   └── user/
│       ├── user.interface.ts
│       ├── user.model.ts
│       ├── user.service.ts
│       ├── user.controller.ts
│       ├── user.route.ts
│       └── user.validation.ts
├── middleware/
│   ├── auth.ts
│   ├── upload.ts
│   └── catchAsync.ts
├── utils/
│   └── sendResponse.ts
└── app.ts
```

---

## 1️⃣ order.interface.ts - TypeScript Interface Documentation

```typescript
/**
 * ORDER INTERFACE MODULE
 * 
 * This file defines the TypeScript interfaces for the Order entity.
 * TypeScript interfaces provide compile-time type checking and better IDE support.
 * 
 * 📚 TypeScript Interface Documentation:
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html
 * @see https://www.typescriptlang.org/docs/handbook/interfaces.html
 * 
 * 📚 MongoDB with TypeScript Best Practices:
 * @see https://www.mongodb.com/compatibility/using-typescript-with-mongodb
 * @see https://mongoosejs.com/docs/typescript.html
 */

import { Types, Document } from 'mongoose';

/**
 * Enum for Order Status
 * Using const enum for better performance and type safety
 */
export const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;

export type TOrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

/**
 * Enum for Payment Methods
 */
export const PaymentMethod = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_BANKING: 'mobile_banking'
} as const;

export type TPaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

/**
 * Enum for Payment Status
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

export type TPaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

/**
 * ORDER ITEM INTERFACE
 * Represents a single product item within an order
 */
export interface IOrderItem {
  productId: Types.ObjectId;      // Reference to Product collection
  name: string;                    // Product name (denormalized for performance)
  sku: string;                     // Stock Keeping Unit
  quantity: number;                // Quantity ordered
  unitPrice: number;               // Price per unit at time of order
  totalPrice: number;              // quantity * unitPrice
  discount?: number;               // Individual item discount if any
  image?: string;                  // Product image URL
}

/**
 * SHIPPING ADDRESS INTERFACE
 * Contains all shipping-related address information
 */
export interface IShippingAddress {
  fullName: string;                // Recipient's full name
  phone: string;                   // Contact phone number
  email?: string;                  // Email for shipping updates
  addressLine1: string;            // Street address
  addressLine2?: string;           // Apartment, suite, etc.
  city: string;                    // City name
  state: string;                   // State/Province
  postalCode: string;              // ZIP/Postal code
  country: string;                 // Country name
  landmark?: string;               // Nearby landmark for easy finding
}

/**
 * BILLING ADDRESS INTERFACE
 * Can be same as shipping address or different
 */
export interface IBillingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * PAYMENT DETAILS INTERFACE
 * Stores payment transaction information
 */
export interface IPaymentDetails {
  method: TPaymentMethod;          // Payment method used
  status: TPaymentStatus;          // Current payment status
  transactionId?: string;          // Gateway transaction ID
  paidAt?: Date;                   // When payment was completed
  gatewayResponse?: any;           // Raw response from payment gateway
  amount: number;                  // Amount paid
  currency: string;                // Currency code (USD, EUR, BDT, etc.)
}

/**
 * ORDER COUPON/DISCOUNT INTERFACE
 */
export interface IOrderDiscount {
  couponCode?: string;             // Applied coupon code
  discountAmount: number;          // Total discount amount
  discountType: 'percentage' | 'fixed'; // Type of discount
  appliedBy?: Types.ObjectId;      // Admin who applied (if manual)
}

/**
 * MAIN ORDER INTERFACE
 * This is the primary interface for Order document in MongoDB
 * 
 * 📚 MongoDB Document Interface Pattern:
 * Extends Document to get all MongoDB document properties (_id, __v, etc.)
 */
export interface IOrder extends Document {
  // Core Identifiers
  orderNumber: string;              // Unique human-readable order number (e.g., ORD-20241225-001)
  
  // Relationships
  userId: Types.ObjectId;           // Reference to User who placed the order
  items: IOrderItem[];              // Array of ordered items
  
  // Addresses
  shippingAddress: IShippingAddress;
  billingAddress: IBillingAddress;
  sameAsShipping?: boolean;         // If billing address same as shipping
  
  // Financial Information
  subtotal: number;                 // Sum of all item total prices before tax/discount
  discount: IOrderDiscount;         // Applied discounts
  tax: number;                      // Total tax amount
  shippingCost: number;             // Delivery/shipping fee
  grandTotal: number;               // Final total = subtotal - discount + tax + shippingCost
  
  // Payment Information
  payment: IPaymentDetails;
  
  // Order Status
  status: TOrderStatus;
  statusHistory: IOrderStatusHistory[]; // Track status changes
  
  // Tracking Information
  trackingNumber?: string;          // Courier tracking number
  courierService?: string;          // Name of courier service (e.g., DHL, FedEx)
  estimatedDelivery?: Date;         // Estimated delivery date
  deliveredAt?: Date;               // Actual delivery timestamp
  
  // Additional Information
  notes?: string;                   // Customer order notes
  specialInstructions?: string;     // Special delivery instructions
  isDeleted: boolean;               // Soft delete flag
  
  // Timestamps (automatically managed by Mongoose)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ORDER STATUS HISTORY INTERFACE
 * Tracks all status changes with timestamps and reasons
 */
export interface IOrderStatusHistory {
  status: TOrderStatus;
  changedAt: Date;
  changedBy: Types.ObjectId;        // User/Admin who changed status
  note?: string;                    // Reason for status change
}

/**
 * CREATE ORDER INPUT TYPE
 * Used when creating a new order (omits auto-generated fields)
 * 
 * 📚 TypeScript Utility Types Documentation:
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
 */
export type TCreateOrderInput = Omit<IOrder, 
  '_id' | 'orderNumber' | 'statusHistory' | 'isDeleted' | 'createdAt' | 'updatedAt'
> & {
  status?: TOrderStatus;            // Optional, defaults to 'pending'
};

/**
 * UPDATE ORDER INPUT TYPE
 * Makes all fields optional for partial updates
 * 
 * 📚 Partial Utility Type:
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
 */
export type TUpdateOrderInput = Partial<Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>>;

/**
 * ORDER FILTER TYPE
 * For filtering orders in find operations
 */
export interface IOrderFilter {
  userId?: Types.ObjectId;
  status?: TOrderStatus;
  paymentStatus?: TPaymentStatus;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  orderNumber?: string;
}
```

---

## 2️⃣ order.model.ts - Mongoose Model Documentation

```typescript
/**
 * ORDER MODEL MODULE
 * 
 * This file defines the Mongoose schema and model for the Order collection.
 * Mongoose schemas provide data validation, middleware, and MongoDB interactions.
 * 
 * 📚 Mongoose Documentation:
 * @see https://mongoosejs.com/docs/guide.html
 * @see https://mongoosejs.com/docs/schematypes.html
 * @see https://mongoosejs.com/docs/middleware.html
 * @see https://mongoosejs.com/docs/validation.html
 * 
 * 📚 MongoDB Best Practices:
 * @see https://www.mongodb.com/docs/manual/core/data-model-design/
 * @see https://www.mongodb.com/docs/manual/core/schema-validation/
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import {
  IOrder,
  IOrderItem,
  IShippingAddress,
  IBillingAddress,
  IPaymentDetails,
  IOrderDiscount,
  IOrderStatusHistory,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TOrderStatus,
  TPaymentMethod,
  TPaymentStatus
} from './order.interface';

/**
 * HELPER FUNCTION: Generate Unique Order Number
 * Format: ORD-YYYYMMDD-XXXX (e.g., ORD-20241225-0001)
 */
function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${dateStr}-${random}`;
}

/**
 * ORDER ITEM SUB-SCHEMA
 * Defines the structure for each product item in the order
 */
const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',           // Reference to Product model
    required: [true, 'Product ID is required'],
    index: true               // Index for faster queries
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    uppercase: true,
    trim: true,
    index: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [999, 'Quantity cannot exceed 999']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative'],
    validate: {
      validator: (v: number) => v >= 0,
      message: 'Unit price must be a non-negative number'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  image: {
    type: String,
    trim: true
  }
}, {
  _id: false                  // No separate _id for sub-documents
});

/**
 * SHIPPING ADDRESS SUB-SCHEMA
 */
const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-]{10,15}$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true,
    maxlength: [200, 'Address too long']
  },
  addressLine2: {
    type: String,
    trim: true,
    maxlength: [200, 'Address too long']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    index: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: 'Bangladesh'
  },
  landmark: {
    type: String,
    trim: true
  }
}, {
  _id: false
});

/**
 * BILLING ADDRESS SUB-SCHEMA
 */
const BillingAddressSchema = new Schema<IBillingAddress>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required for billing'],
    trim: true,
    lowercase: true
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  }
}, {
  _id: false
});

/**
 * PAYMENT DETAILS SUB-SCHEMA
 */
const PaymentDetailsSchema = new Schema<IPaymentDetails>({
  method: {
    type: String,
    enum: {
      values: Object.values(PaymentMethod),
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: {
      values: Object.values(PaymentStatus),
      message: '{VALUE} is not a valid payment status'
    },
    default: PaymentStatus.PENDING
  },
  transactionId: {
    type: String,
    trim: true,
    index: true,
    sparse: true
  },
  paidAt: {
    type: Date
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    uppercase: true,
    default: 'BDT',
    enum: ['USD', 'EUR', 'BDT', 'GBP', 'INR']
  }
}, {
  _id: false
});

/**
 * ORDER DISCOUNT SUB-SCHEMA
 */
const OrderDiscountSchema = new Schema<IOrderDiscount>({
  couponCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'fixed'
  },
  appliedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  _id: false
});

/**
 * ORDER STATUS HISTORY SUB-SCHEMA
 */
const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>({
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    trim: true
  }
}, {
  _id: false
});

/**
 * MAIN ORDER SCHEMA
 * 
 * 📚 Schema Options Documentation:
 * @see https://mongoosejs.com/docs/guide.html#options
 */
const OrderSchema = new Schema<IOrder>(
  {
    // Core Identifiers
    orderNumber: {
      type: String,
      unique: true,
      required: [true, 'Order number is required'],
      uppercase: true,
      trim: true,
      index: true,
      default: generateOrderNumber
    },

    // Relationships
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    // Items
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: (items: IOrderItem[]) => items && items.length > 0,
        message: 'Order must contain at least one item'
      }
    },

    // Addresses
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, 'Shipping address is required']
    },
    billingAddress: {
      type: BillingAddressSchema,
      required: [true, 'Billing address is required']
    },
    sameAsShipping: {
      type: Boolean,
      default: false
    },

    // Financial Information
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    discount: {
      type: OrderDiscountSchema,
      default: () => ({ discountAmount: 0, discountType: 'fixed' })
    },
    tax: {
      type: Number,
      required: [true, 'Tax amount is required'],
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    shippingCost: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required'],
      min: [0, 'Grand total cannot be negative']
    },

    // Payment Information
    payment: {
      type: PaymentDetailsSchema,
      required: [true, 'Payment details are required']
    },

    // Order Status
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true
    },
    statusHistory: {
      type: [OrderStatusHistorySchema],
      default: []
    },

    // Tracking Information
    trackingNumber: {
      type: String,
      trim: true,
      sparse: true,
      index: true
    },
    courierService: {
      type: String,
      trim: true
    },
    estimatedDelivery: {
      type: Date
    },
    deliveredAt: {
      type: Date
    },

    // Additional Information
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Instructions cannot exceed 500 characters']
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    // Schema Options
    timestamps: true,           // Automatically adds createdAt and updatedAt
    versionKey: '__v',          // Version key for document versioning
    toJSON: {                   // Transform the document when using .toJSON()
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {                 // Transform the document when using .toObject()
      virtuals: true
    }
  }
);

/**
 * INDEXES FOR PERFORMANCE OPTIMIZATION
 * 
 * 📚 MongoDB Indexing Documentation:
 * @see https://mongoosejs.com/docs/guide.html#indexes
 * @see https://www.mongodb.com/docs/manual/indexes/
 */
// Compound index for user orders query (most common query)
OrderSchema.index({ userId: 1, createdAt: -1 });

// Compound index for status and date queries
OrderSchema.index({ status: 1, createdAt: -1 });

// Index for payment status queries
OrderSchema.index({ 'payment.status': 1 });

// Text index for search functionality
OrderSchema.index({ 
  orderNumber: 'text',
  'shippingAddress.fullName': 'text',
  'items.name': 'text' 
});

/**
 * PRE-SAVE MIDDLEWARE
 * Executes before saving a document
 * 
 * 📚 Mongoose Middleware Documentation:
 * @see https://mongoosejs.com/docs/middleware.html
 */
OrderSchema.pre<IOrder>('save', async function(next) {
  // Auto-generate order number if not provided
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }

  // Ensure grand total is correctly calculated
  const calculatedTotal = this.subtotal - this.discount.discountAmount + this.tax + this.shippingCost;
  if (Math.abs(calculatedTotal - this.grandTotal) > 0.01) {
    this.grandTotal = calculatedTotal;
  }

  // Add initial status to history if new order
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status as TOrderStatus,
      changedAt: new Date(),
      changedBy: this.userId,
      note: 'Order created'
    });
  }

  // Add status change to history if status changed
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status as TOrderStatus,
      changedAt: new Date(),
      changedBy: this.userId,
      note: `Status changed to ${this.status}`
    });

    // If status is delivered, set deliveredAt
    if (this.status === OrderStatus.DELIVERED && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
  }

  // If billing address is same as shipping, copy it
  if (this.sameAsShipping && this.shippingAddress) {
    this.billingAddress = { ...this.shippingAddress } as any;
  }

  next();
});

/**
 * PRE-FIND MIDDLEWARE
 * Automatically exclude soft-deleted documents
 */
OrderSchema.pre(/^find/, function(next) {
  // @ts-ignore - 'this' is the query object
  this.where({ isDeleted: false });
  next();
});

/**
 * VIRTUAL PROPERTIES
 * Computed properties not stored in MongoDB
 * 
 * 📚 Mongoose Virtuals Documentation:
 * @see https://mongoosejs.com/docs/guide.html#virtuals
 */

// Virtual for checking if order is cancellable
OrderSchema.virtual('isCancellable').get(function(this: IOrder) {
  return [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(this.status as TOrderStatus);
});

// Virtual for order age in days
OrderSchema.virtual('ageInDays').get(function(this: IOrder) {
  const diffTime = Math.abs(Date.now() - this.createdAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for formatted total price
OrderSchema.virtual('formattedGrandTotal').get(function(this: IOrder) {
  return `${this.payment.currency} ${this.grandTotal.toFixed(2)}`;
});

/**
 * INSTANCE METHODS
 * Methods available on document instances
 */
OrderSchema.methods = {
  /**
   * Mark order as paid
   */
  async markAsPaid(transactionId: string, gatewayResponse?: any): Promise<void> {
    this.payment.status = PaymentStatus.PAID;
    this.payment.transactionId = transactionId;
    this.payment.paidAt = new Date();
    if (gatewayResponse) {
      this.payment.gatewayResponse = gatewayResponse;
    }
    await this.save();
  },

  /**
   * Update order status with validation
   */
  async updateStatus(newStatus: TOrderStatus, userId: Types.ObjectId, note?: string): Promise<void> {
    // Add business logic for status transitions
    const validTransitions: Record<TOrderStatus, TOrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: []
    };

    const allowedNextStatuses = validTransitions[this.status as TOrderStatus];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
    }

    this.status = newStatus;
    this.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      changedBy: userId,
      note
    });

    await this.save();
  }
};

/**
 * STATIC METHODS
 * Methods available on the Model itself
 */
OrderSchema.statics = {
  /**
   * Find orders by user with pagination
   */
  async findByUser(userId: Types.ObjectId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email'),
      this.countDocuments({ userId })
    ]);

    return {
      orders,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  },

  /**
   * Get order statistics for dashboard
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const match: any = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const stats = await this.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          averageOrderValue: { $avg: '$grandTotal' },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);

    const statusWise = await this.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$grandTotal' }
        }
      }
    ]);

    return {
      overall: stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0, totalItems: 0 },
      statusWise
    };
  }
};

/**
 * CREATE AND EXPORT THE MODEL
 * 
 * 📚 Mongoose Model Documentation:
 * @see https://mongoosejs.com/docs/models.html
 */
export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
```

---

## 3️⃣ order.service.ts - Business Logic Documentation

```typescript
/**
 * ORDER SERVICE MODULE
 * 
 * This file contains all business logic for order management.
 * Services act as an abstraction layer between controllers and database models.
 * 
 * 📚 Service Layer Pattern Documentation:
 * @see https://martinfowler.com/eaaCatalog/serviceLayer.html
 * @see https://www.coreycleary.me/what-is-a-service-layer-in-node-js-express-and-why-you-should-use-it
 * 
 * 📚 Best Practices:
 * - Keep business logic separate from controllers
 * - Handle all database operations here
 * - Throw meaningful errors for controller to handle
 * - Use transaction for multi-document operations
 */

import mongoose, { Types } from 'mongoose';
import { Order } from './order.model';
import { IOrder, TCreateOrderInput, TUpdateOrderInput, IOrderFilter, OrderStatus, PaymentStatus } from './order.interface';
import { Product } from '../product/product.model'; // Assuming product model exists
import { User } from '../user/user.model'; // Assuming user model exists

/**
 * ORDER SERVICE CLASS
 * Encapsulates all order-related business operations
 */
export class OrderService {
  
  /**
   * CREATE ORDER
   * Creates a new order with inventory validation and transaction support
   * 
   * @param orderData - The order data to create
   * @returns Promise<IOrder> - The created order document
   * @throws Error - If inventory insufficient or validation fails
   * 
   * @example
   * const newOrder = await OrderService.createOrder({
   *   userId: new Types.ObjectId(),
   *   items: [...],
   *   shippingAddress: {...}
   * });
   */
  static async createOrder(orderData: TCreateOrderInput): Promise<IOrder> {
    // Start a MongoDB transaction for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. VALIDATE AND RESERVE INVENTORY
      for (const item of orderData.items) {
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}`);
        }

        // Reserve inventory by reducing stock
        product.stockQuantity -= item.quantity;
        await product.save({ session });
      }

      // 2. CALCULATE FINANCIALS
      const subtotal = orderData.items.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // Apply discount if coupon code provided
      let discountAmount = 0;
      let discountType: 'percentage' | 'fixed' = 'fixed';
      
      if (orderData.discount?.couponCode) {
        // Validate coupon logic here
        // This is a placeholder - implement your coupon validation
        discountAmount = orderData.discount.discountAmount || 0;
        discountType = orderData.discount.discountType || 'fixed';
      }

      // Calculate tax (example: 15% VAT)
      const taxRate = 0.15;
      const tax = (subtotal - discountAmount) * taxRate;
      
      // Shipping cost (example logic - can be based on location/weight)
      const shippingCost = orderData.shippingCost || 50;

      // Grand total calculation
      const grandTotal = subtotal - discountAmount + tax + shippingCost;

      // 3. CREATE ORDER DOCUMENT
      const order = new Order({
        ...orderData,
        subtotal,
        discount: {
          couponCode: orderData.discount?.couponCode,
          discountAmount,
          discountType,
          appliedBy: orderData.discount?.appliedBy
        },
        tax,
        shippingCost,
        grandTotal,
        status: orderData.status || OrderStatus.PENDING,
        statusHistory: [],
        payment: {
          ...orderData.payment,
          amount: grandTotal,
          status: PaymentStatus.PENDING
        }
      });

      await order.save({ session });

      // 4. COMMIT TRANSACTION
      await session.commitTransaction();
      session.endSession();

      // 5. POPULATE REFERENCES FOR RESPONSE
      return await order.populate([
        { path: 'userId', select: 'name email phone' },
        { path: 'items.productId', select: 'name images sku' }
      ]);

    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * GET ORDER BY ID
   * Retrieves a single order by its ID
   * 
   * @param orderId - The MongoDB ObjectId of the order
   * @param populateOptions - Optional populate configuration
   * @returns Promise<IOrder | null> - The order or null if not found
   */
  static async getOrderById(
    orderId: string | Types.ObjectId,
    populateOptions?: { user?: boolean; products?: boolean }
  ): Promise<IOrder | null> {
    let query = Order.findById(orderId);

    if (populateOptions?.user) {
      query = query.populate('userId', 'name email phone avatar');
    }

    if (populateOptions?.products) {
      query = query.populate('items.productId', 'name images sku price');
    }

    return await query.exec();
  }

  /**
   * GET ORDER BY ORDER NUMBER
   * Retrieves an order using the human-readable order number
   * 
   * @param orderNumber - The unique order number (e.g., ORD-20241225-001)
   * @returns Promise<IOrder | null> - The order or null if not found
   */
  static async getOrderByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    return await Order.findOne({ orderNumber: orderNumber.toUpperCase() }).exec();
  }

  /**
   * GET ALL ORDERS WITH FILTERS AND PAGINATION
   * 
   * @param filter - Filter criteria for orders
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param sortBy - Sort field (default: createdAt)
   * @param sortOrder - Sort order asc/desc (default: desc)
   * @returns Promise with orders array and pagination metadata
   * 
   * @example
   * const result = await OrderService.getAllOrders(
   *   { status: 'pending', minAmount: 100 },
   *   1, 20, 'createdAt', 'desc'
   * );
   */
  static async getAllOrders(
    filter: IOrderFilter = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    orders: IOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build query filter
    const query: any = {};

    if (filter.userId) {
      query.userId = filter.userId;
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.paymentStatus) {
      query['payment.status'] = filter.paymentStatus;
    }

    if (filter.orderNumber) {
      query.orderNumber = { $regex: filter.orderNumber, $options: 'i' };
    }

    // Date range filter
    if (filter.startDate || filter.endDate) {
      query.createdAt = {};
      if (filter.startDate) {
        query.createdAt.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        query.createdAt.$lte = new Date(filter.endDate);
      }
    }

    // Amount range filter
    if (filter.minAmount !== undefined || filter.maxAmount !== undefined) {
      query.grandTotal = {};
      if (filter.minAmount !== undefined) {
        query.grandTotal.$gte = filter.minAmount;
      }
      if (filter.maxAmount !== undefined) {
        query.grandTotal.$lte = filter.maxAmount;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute parallel queries for efficiency
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(), // Use lean() for better performance when no document modification needed
      Order.countDocuments(query)
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * GET USER ORDERS
   * Retrieves all orders for a specific user with pagination
   * 
   * @param userId - The user's ObjectId
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with user orders and metadata
   */
  static async getUserOrders(
    userId: Types.ObjectId | string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: IOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.productId', 'name images'),
      Order.countDocuments({ userId })
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * UPDATE ORDER STATUS
   * Updates the status of an order with validation
   * 
   * @param orderId - The order ID
   * @param newStatus - New status to set
   * @param userId - User making the change (for audit)
   * @param note - Optional note about the status change
   * @returns Promise<IOrder | null> - Updated order or null
   */
  static async updateOrderStatus(
    orderId: string | Types.ObjectId,
    newStatus: OrderStatus,
    userId: Types.ObjectId | string,
    note?: string
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);

    if (!order) {
      return null;
    }

    // Use the instance method defined in the model
    await order.updateStatus(newStatus as any, new Types.ObjectId(userId), note);

    return order;
  }

  /**
   * UPDATE ORDER DETAILS
   * Partially updates an order (excluding status)
   * 
   * @param orderId - The order ID
   * @param updateData - Data to update
   * @returns Promise<IOrder | null> - Updated order or null
   */
  static async updateOrder(
    orderId: string | Types.ObjectId,
    updateData: TUpdateOrderInput
  ): Promise<IOrder | null> {
    // Prevent updating certain fields directly
    const allowedUpdates = [
      'shippingAddress',
      'billingAddress',
      'notes',
      'specialInstructions',
      'trackingNumber',
      'courierService',
      'estimatedDelivery'
    ];

    const filteredUpdate: any = {};
    for (const key of allowedUpdates) {
      if (updateData[key as keyof TUpdateOrderInput] !== undefined) {
        filteredUpdate[key] = updateData[key as keyof TUpdateOrderInput];
      }
    }

    return await Order.findByIdAndUpdate(
      orderId,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * CANCEL ORDER
   * Cancels an order and restores inventory
   * 
   * @param orderId - The order ID
   * @param userId - User cancelling the order
   * @param reason - Reason for cancellation
   * @returns Promise<IOrder | null> - Cancelled order or null
   */
  static async cancelOrder(
    orderId: string | Types.ObjectId,
    userId: Types.ObjectId | string,
    reason?: string
  ): Promise<IOrder | null> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);

      if (!order) {
        throw new Error('Order not found');
      }

      if (!order.isCancellable) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      // Restore inventory
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } },
          { session }
        );
      }

      // Update order status
      await order.updateStatus(
        OrderStatus.CANCELLED as any,
        new Types.ObjectId(userId),
        reason || 'Order cancelled by user'
      );

      await session.commitTransaction();
      session.endSession();

      return order;

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * PROCESS PAYMENT
   * Updates payment status for an order
   * 
   * @param orderId - The order ID
   * @param paymentStatus - New payment status
   * @param transactionId - Gateway transaction ID
   * @param gatewayResponse - Raw gateway response
   * @returns Promise<IOrder | null> - Updated order
   */
  static async processPayment(
    orderId: string | Types.ObjectId,
    paymentStatus: PaymentStatus,
    transactionId?: string,
    gatewayResponse?: any
  ): Promise<IOrder | null> {
    const order = await Order.findById(orderId);

    if (!order) {
      return null;
    }

    order.payment.status = paymentStatus;
    
    if (transactionId) {
      order.payment.transactionId = transactionId;
    }
    
    if (gatewayResponse) {
      order.payment.gatewayResponse = gatewayResponse;
    }

    if (paymentStatus === PaymentStatus.PAID) {
      order.payment.paidAt = new Date();
    }

    await order.save();

    return order;
  }

  /**
   * GET ORDER STATISTICS
   * Returns aggregated statistics for dashboard/reporting
   * 
   * @param startDate - Optional start date filter
   * @param endDate - Optional end date filter
   * @returns Promise with order statistics
   */
  static async getOrderStatistics(startDate?: Date, endDate?: Date): Promise<any> {
    return await Order.getStatistics(startDate, endDate);
  }

  /**
   * SOFT DELETE ORDER
   * Marks an order as deleted without removing from database
   * 
   * @param orderId - The order ID
   * @returns Promise<IOrder | null> - Soft deleted order
   */
  static async softDeleteOrder(orderId: string | Types.ObjectId): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { isDeleted: true },
      { new: true }
    ).exec();
  }

  /**
   * PERMANENTLY DELETE ORDER
   * WARNING: This permanently removes the order from database
   * 
   * @param orderId - The order ID
   * @returns Promise<boolean> - True if deleted, false otherwise
   */
  static async permanentDeleteOrder(orderId: string | Types.ObjectId): Promise<boolean> {
    const result = await Order.findByIdAndDelete(orderId).exec();
    return result !== null;
  }

  /**
   * BULK UPDATE ORDER STATUS
   * Updates status for multiple orders at once
   * 
   * @param orderIds - Array of order IDs
   * @param newStatus - New status to set
   * @param userId - User making the change
   * @returns Promise with update result
   */
  static async bulkUpdateStatus(
    orderIds: string[] | Types.ObjectId[],
    newStatus: OrderStatus,
    userId: Types.ObjectId | string
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        $set: { status: newStatus },
        $push: {
          statusHistory: {
            status: newStatus,
            changedAt: new Date(),
            changedBy: userId,
            note: 'Bulk status update'
          }
        }
      }
    );

    return {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    };
  }

  /**
   * SEARCH ORDERS
   * Search orders by various fields with text search
   * 
   * @param searchTerm - Term to search for
   * @param limit - Maximum results
   * @returns Promise with matching orders
   */
  static async searchOrders(searchTerm: string, limit: number = 20): Promise<IOrder[]> {
    return await Order.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .populate('userId', 'name email')
      .exec();
  }
}

// Export individual functions for easier importing
export const {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  processPayment,
  getOrderStatistics,
  softDeleteOrder,
  permanentDeleteOrder,
  bulkUpdateStatus,
  searchOrders
} = OrderService;

export default OrderService;
```

---

## 4️⃣ order.controller.ts - Controller Documentation

```typescript
/**
 * ORDER CONTROLLER MODULE
 * 
 * This file handles HTTP requests and responses for order endpoints.
 * Controllers are responsible for:
 * - Extracting request data (body, params, query)
 * - Calling appropriate service methods
 * - Sending formatted responses back to client
 * - Error handling with catchAsync wrapper
 * 
 * 📚 Express.js Documentation:
 * @see https://expressjs.com/en/guide/routing.html
 * @see https://expressjs.com/en/api.html#req
 * @see https://expressjs.com/en/api.html#res
 * 
 * 📚 HTTP Status Codes:
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * 📚 Response Structure Pattern:
 * @see https://www.google.com/search?q=rest+api+response+format+best+practices
 */

import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { OrderService } from './order.service';
import { catchAsync } from '../../middleware/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OrderStatus, PaymentStatus, TCreateOrderInput } from './order.interface';

/**
 * Extended Request interface with user property
 * Added by authentication middleware
 */
interface IAuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
    email: string;
  };
}

/**
 * CREATE ORDER CONTROLLER
 * Handles POST /api/orders - Creates a new order
 * 
 * @route POST /api/orders
 * @access Private - User or Admin
 * @body {TCreateOrderInput} - Order creation data
 * @returns {201} Created order with populated references
 * 
 * @example
 * POST /api/orders
 * {
 *   "items": [
 *     {
 *       "productId": "507f1f77bcf86cd799439011",
 *       "quantity": 2,
 *       "unitPrice": 499,
 *       "totalPrice": 998
 *     }
 *   ],
 *   "shippingAddress": {
 *     "fullName": "John Doe",
 *     "phone": "+1234567890",
 *     "addressLine1": "123 Main St",
 *     "city": "New York",
 *     "state": "NY",
 *     "postalCode": "10001",
 *     "country": "USA"
 *   },
 *   "payment": {
 *     "method": "card",
 *     "currency": "USD"
 *   }
 * }
 */
export const createOrder = catchAsync(async (req: IAuthenticatedRequest, res: Response) => {
  // Extract user ID from authenticated user
  const userId = new Types.ObjectId(req.user?._id);
  
  // Prepare order data with user ID
  const orderData: TCreateOrderInput = {
    ...req.body,
    userId,
    // Ensure billing address is set (use shipping if not provided)
    billingAddress: req.body.billingAddress || req.body.shippingAddress,
    sameAsShipping: !req.body.billingAddress
  };

  // Call service to create order
  const order = await OrderService.createOrder(orderData);

  // Send success response
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

/**
 * GET ORDER BY ID CONTROLLER
 * Handles GET /api/orders/:id - Retrieves a single order
 * 
 * @route GET /api/orders/:id
 * @access Private - User (own orders) or Admin (all orders)
 * @param {string} id - Order ID parameter
 * @returns {200} Order document with populated references
 */
export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Validate ObjectId format
  if (!Types.ObjectId.isValid(id)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid order ID format',
      data: null
    });
  }

  const order = await OrderService.getOrderById(id, { user: true, products: true });

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  // Check authorization: users can only view their own orders
  const authenticatedReq = req as IAuthenticatedRequest;
  if (authenticatedReq.user?.role !== 'admin' && 
      order.userId._id.toString() !== authenticatedReq.user?._id) {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: 'You are not authorized to view this order',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: order
  });
});

/**
 * GET ORDER BY ORDER NUMBER CONTROLLER
 * Handles GET /api/orders/number/:orderNumber - Retrieves order by order number
 * 
 * @route GET /api/orders/number/:orderNumber
 * @access Private - User (own orders) or Admin
 * @param {string} orderNumber - Order number parameter (e.g., ORD-20241225-001)
 * @returns {200} Order document
 */
export const getOrderByOrderNumber = catchAsync(async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  
  const order = await OrderService.getOrderByOrderNumber(orderNumber);

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found with this order number',
      data: null
    });
  }

  // Authorization check
  const authenticatedReq = req as IAuthenticatedRequest;
  if (authenticatedReq.user?.role !== 'admin' && 
      order.userId.toString() !== authenticatedReq.user?._id) {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: 'You are not authorized to view this order',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order retrieved successfully',
    data: order
  });
});

/**
 * GET ALL ORDERS CONTROLLER
 * Handles GET /api/orders - Retrieves all orders with filters and pagination
 * 
 * @route GET /api/orders
 * @access Private - Admin only (or can be extended for users to see their orders)
 * @query {string} status - Filter by order status
 * @query {string} paymentStatus - Filter by payment status
 * @query {string} startDate - Filter by start date (ISO format)
 * @query {string} endDate - Filter by end date (ISO format)
 * @query {number} minAmount - Minimum order amount
 * @query {number} maxAmount - Maximum order amount
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @query {string} sortBy - Sort field (default: createdAt)
 * @query {string} sortOrder - Sort order asc/desc (default: desc)
 * @returns {200} Paginated orders array with metadata
 */
export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters with defaults
  const {
    status,
    paymentStatus,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    orderNumber,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter: any = {};
  if (status) filter.status = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (startDate) filter.startDate = new Date(startDate as string);
  if (endDate) filter.endDate = new Date(endDate as string);
  if (minAmount) filter.minAmount = Number(minAmount);
  if (maxAmount) filter.maxAmount = Number(maxAmount);
  if (orderNumber) filter.orderNumber = orderNumber as string;

  // Check role - if regular user, only show their orders
  const authenticatedReq = req as IAuthenticatedRequest;
  if (authenticatedReq.user?.role !== 'admin') {
    filter.userId = authenticatedReq.user?._id;
  }

  const result = await OrderService.getAllOrders(
    filter,
    Number(page),
    Number(limit),
    sortBy as string,
    sortOrder as 'asc' | 'desc'
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders retrieved successfully',
    data: result
  });
});

/**
 * GET USER ORDERS CONTROLLER
 * Handles GET /api/orders/user/:userId - Retrieves orders for specific user
 * 
 * @route GET /api/orders/user/:userId
 * @access Private - User (own orders) or Admin
 * @param {string} userId - User ID parameter
 * @query {number} page - Page number
 * @query {number} limit - Items per page
 * @returns {200} User's orders with pagination
 */
export const getUserOrders = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Validate user ID
  if (!Types.ObjectId.isValid(userId)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Invalid user ID format',
      data: null
    });
  }

  // Authorization check
  const authenticatedReq = req as IAuthenticatedRequest;
  if (authenticatedReq.user?.role !== 'admin' && 
      authenticatedReq.user?._id !== userId) {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: 'You are not authorized to view these orders',
      data: null
    });
  }

  const result = await OrderService.getUserOrders(
    userId,
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User orders retrieved successfully',
    data: result
  });
});

/**
 * UPDATE ORDER STATUS CONTROLLER
 * Handles PATCH /api/orders/:id/status - Updates order status
 * 
 * @route PATCH /api/orders/:id/status
 * @access Private - Admin only
 * @param {string} id - Order ID parameter
 * @body {string} status - New order status
 * @body {string} note - Optional note about status change
 * @returns {200} Updated order
 */
export const updateOrderStatus = catchAsync(async (req: IAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body;

  // Validate status
  if (!status || !Object.values(OrderStatus).includes(status)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`,
      data: null
    });
  }

  const order = await OrderService.updateOrderStatus(
    id,
    status as OrderStatus,
    req.user!._id,
    note
  );

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Order status updated to ${status} successfully`,
    data: order
  });
});

/**
 * UPDATE ORDER DETAILS CONTROLLER
 * Handles PATCH /api/orders/:id - Partially updates order
 * 
 * @route PATCH /api/orders/:id
 * @access Private - Admin only (or user for limited fields)
 * @param {string} id - Order ID parameter
 * @body {object} updateData - Fields to update
 * @returns {200} Updated order
 */
export const updateOrder = catchAsync(async (req: IAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  // Define allowed fields for user updates vs admin updates
  const allowedUserUpdates = ['notes', 'specialInstructions'];
  const updateData: any = {};
  
  if (req.user?.role === 'admin') {
    // Admin can update more fields
    const adminAllowed = ['shippingAddress', 'billingAddress', 'notes', 'specialInstructions', 'trackingNumber', 'courierService', 'estimatedDelivery'];
    for (const key of adminAllowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
  } else {
    // Regular users can only update limited fields
    for (const key of allowedUserUpdates) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
  }

  const order = await OrderService.updateOrder(id, updateData);

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order updated successfully',
    data: order
  });
});

/**
 * CANCEL ORDER CONTROLLER
 * Handles POST /api/orders/:id/cancel - Cancels an order
 * 
 * @route POST /api/orders/:id/cancel
 * @access Private - User (own orders) or Admin
 * @param {string} id - Order ID parameter
 * @body {string} reason - Reason for cancellation (optional)
 * @returns {200} Cancelled order
 */
export const cancelOrder = catchAsync(async (req: IAuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  // First check if order exists and user is authorized
  const existingOrder = await OrderService.getOrderById(id);
  
  if (!existingOrder) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  // Check authorization: users can only cancel their own orders
  if (req.user?.role !== 'admin' && 
      existingOrder.userId.toString() !== req.user?._id) {
    return sendResponse(res, {
      statusCode: 403,
      success: false,
      message: 'You are not authorized to cancel this order',
      data: null
    });
  }

  const order = await OrderService.cancelOrder(id, req.user!._id, reason);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

/**
 * PROCESS PAYMENT CONTROLLER
 * Handles POST /api/orders/:id/payment - Updates payment status
 * 
 * @route POST /api/orders/:id/payment
 * @access Private - Admin only
 * @param {string} id - Order ID parameter
 * @body {string} paymentStatus - New payment status
 * @body {string} transactionId - Transaction ID from payment gateway
 * @body {object} gatewayResponse - Raw gateway response
 * @returns {200} Updated order
 */
export const processPayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, transactionId, gatewayResponse } = req.body;

  // Validate payment status
  if (!paymentStatus || !Object.values(PaymentStatus).includes(paymentStatus)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: `Invalid payment status. Must be one of: ${Object.values(PaymentStatus).join(', ')}`,
      data: null
    });
  }

  const order = await OrderService.processPayment(
    id,
    paymentStatus as PaymentStatus,
    transactionId,
    gatewayResponse
  );

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Payment status updated to ${paymentStatus} successfully`,
    data: order
  });
});

/**
 * GET ORDER STATISTICS CONTROLLER
 * Handles GET /api/orders/statistics/dashboard - Gets order analytics
 * 
 * @route GET /api/orders/statistics/dashboard
 * @access Private - Admin only
 * @query {string} startDate - Start date for statistics
 * @query {string} endDate - End date for statistics
 * @returns {200} Order statistics
 */
export const getOrderStatistics = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const statistics = await OrderService.getOrderStatistics(
    startDate ? new Date(startDate as string) : undefined,
    endDate ? new Date(endDate as string) : undefined
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order statistics retrieved successfully',
    data: statistics
  });
});

/**
 * SOFT DELETE ORDER CONTROLLER
 * Handles DELETE /api/orders/:id/soft - Soft deletes an order
 * 
 * @route DELETE /api/orders/:id/soft
 * @access Private - Admin only
 * @param {string} id - Order ID parameter
 * @returns {200} Soft deleted order
 */
export const softDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await OrderService.softDeleteOrder(id);

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order deleted successfully (soft delete)',
    data: order
  });
});

/**
 * PERMANENT DELETE ORDER CONTROLLER
 * Handles DELETE /api/orders/:id/permanent - Permanently deletes an order
 * 
 * @route DELETE /api/orders/:id/permanent
 * @access Private - Admin only
 * @param {string} id - Order ID parameter
 * @returns {200} Success message
 */
export const permanentDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = await OrderService.permanentDeleteOrder(id);

  if (!deleted) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Order not found',
      data: null
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order permanently deleted from database',
    data: null
  });
});

/**
 * BULK UPDATE STATUS CONTROLLER
 * Handles PATCH /api/orders/bulk/status - Bulk updates order statuses
 * 
 * @route PATCH /api/orders/bulk/status
 * @access Private - Admin only
 * @body {string[]} orderIds - Array of order IDs
 * @body {string} status - New status to apply
 * @returns {200} Update result
 */
export const bulkUpdateStatus = catchAsync(async (req: IAuthenticatedRequest, res: Response) => {
  const { orderIds, status } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Please provide an array of order IDs',
      data: null
    });
  }

  if (!status || !Object.values(OrderStatus).includes(status)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`,
      data: null
    });
  }

  const result = await OrderService.bulkUpdateStatus(
    orderIds,
    status as OrderStatus,
    req.user!._id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Bulk status update completed. Updated ${result.modifiedCount} orders.`,
    data: result
  });
});

/**
 * SEARCH ORDERS CONTROLLER
 * Handles GET /api/orders/search/:term - Searches orders by text
 * 
 * @route GET /api/orders/search/:term
 * @access Private - Admin only
 * @param {string} term - Search term
 * @query {number} limit - Maximum results (default: 20)
 * @returns {200} Matching orders
 */
export const searchOrders = catchAsync(async (req: Request, res: Response) => {
  const { term } = req.params;
  const { limit = 20 } = req.query;

  if (!term || term.length < 2) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'Search term must be at least 2 characters',
      data: null
    });
  }

  const orders = await OrderService.searchOrders(term, Number(limit));

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Found ${orders.length} orders matching "${term}"`,
    data: orders
  });
});
```

---

## 5️⃣ order.route.ts - Route Documentation

```typescript
/**
 * ORDER ROUTES MODULE
 * 
 * This file defines all HTTP routes for order endpoints.
 * Routes are responsible for:
 * - Defining URL endpoints
 * - Applying middleware (authentication, validation, file upload)
 * - Mapping requests to controller functions
 * 
 * 📚 Express Routing Documentation:
 * @see https://expressjs.com/en/guide/routing.html
 * @see https://expressjs.com/en/api.html#router
 * 
 * 📚 REST API Design Best Practices:
 * @see https://restfulapi.net/resource-naming/
 * @see https://www.google.com/search?q=rest+api+routing+best+practices
 */

import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  processPayment,
  getOrderStatistics,
  softDeleteOrder,
  permanentDeleteOrder,
  bulkUpdateStatus,
  searchOrders
} from './order.controller';
import { auth } from '../../middleware/auth';
import { uploadFile } from '../../middleware/upload';
import { validate } from '../../middleware/validate';
import {
  createOrderValidation,
  updateOrderValidation,
  updateOrderStatusValidation,
  bulkUpdateValidation,
  orderIdParamValidation
} from './order.validation';

// Create a new router instance
const router = Router();

/**
 * USER ROLES ENUM for authentication middleware
 * Define all available user roles in your application
 */
export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
  SUPPORT: 'support'
} as const;

/**
 * ============================================
 * PUBLIC ROUTES (No authentication required)
 * ============================================
 * Note: Usually orders don't have public routes,
 * but you can add order tracking for guests if needed
 */

// Public order tracking by order number (if you want to allow guests to track orders)
// router.get('/track/:orderNumber', getOrderByOrderNumber);

/**
 * ============================================
 * AUTHENTICATED USER ROUTES
 * ============================================
 * These routes require user to be logged in
 */

// Create a new order
// POST /api/orders
// Access: USER, ADMIN, MANAGER
// Description: Create a new order with items and shipping details
// Body: Order creation data
router.post(
  '/',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER), // Allow authenticated users and admins
  validate(createOrderValidation), // Validate request body with Zod (optional)
  createOrder
);

// Get current user's orders
// GET /api/orders/my-orders
// Access: USER, ADMIN, MANAGER
// Description: Get all orders for the currently authenticated user
router.get(
  '/my-orders',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  getUserOrders
);

// Get order by ID (users can only see their own orders)
// GET /api/orders/:id
// Access: USER, ADMIN, MANAGER, SUPPORT
// Params: id - Order ObjectId
router.get(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPPORT),
  validate(orderIdParamValidation), // Validate ID parameter
  getOrderById
);

// Get order by order number
// GET /api/orders/number/:orderNumber
// Access: USER, ADMIN, MANAGER
// Params: orderNumber - Human-readable order number (e.g., ORD-20241225-001)
router.get(
  '/number/:orderNumber',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  getOrderByOrderNumber
);

// Update order (limited fields for users)
// PATCH /api/orders/:id
// Access: USER (own orders), ADMIN, MANAGER
// Params: id - Order ObjectId
// Body: Fields to update (notes, specialInstructions for users)
router.patch(
  '/:id',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validate(updateOrderValidation),
  updateOrder
);

// Cancel order
// POST /api/orders/:id/cancel
// Access: USER (own orders), ADMIN, MANAGER
// Params: id - Order ObjectId
// Body: { reason: string } (optional)
router.post(
  '/:id/cancel',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validate(orderIdParamValidation),
  cancelOrder
);

/**
 * ============================================
 * ADMIN & MANAGER ROUTES
 * ============================================
 * These routes require elevated privileges
 */

// Get all orders with filters and pagination
// GET /api/orders
// Access: ADMIN, MANAGER, SUPPORT
// Query: status, paymentStatus, startDate, endDate, minAmount, maxAmount, page, limit, sortBy, sortOrder
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPPORT),
  getAllOrders
);

// Get orders for a specific user
// GET /api/orders/user/:userId
// Access: ADMIN, MANAGER
// Params: userId - User ObjectId
// Query: page, limit
router.get(
  '/user/:userId',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  getUserOrders
);

// Update order status
// PATCH /api/orders/:id/status
// Access: ADMIN, MANAGER, SUPPORT
// Params: id - Order ObjectId
// Body: { status: string, note?: string }
router.patch(
  '/:id/status',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPPORT),
  validate(updateOrderStatusValidation),
  updateOrderStatus
);

// Process payment for an order
// POST /api/orders/:id/payment
// Access: ADMIN, MANAGER
// Params: id - Order ObjectId
// Body: { paymentStatus: string, transactionId?: string, gatewayResponse?: object }
router.post(
  '/:id/payment',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  processPayment
);

// Get order statistics/dashboard data
// GET /api/orders/statistics/dashboard
// Access: ADMIN, MANAGER
// Query: startDate, endDate (optional)
router.get(
  '/statistics/dashboard',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  getOrderStatistics
);

// Bulk update order status
// PATCH /api/orders/bulk/status
// Access: ADMIN, MANAGER
// Body: { orderIds: string[], status: string }
router.patch(
  '/bulk/status',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validate(bulkUpdateValidation),
  bulkUpdateStatus
);

// Search orders by text
// GET /api/orders/search/:term
// Access: ADMIN, MANAGER, SUPPORT
// Params: term - Search term (min 2 characters)
// Query: limit - Maximum results (default: 20)
router.get(
  '/search/:term',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.SUPPORT),
  searchOrders
);

// Soft delete an order (mark as deleted)
// DELETE /api/orders/:id/soft
// Access: ADMIN, MANAGER
// Params: id - Order ObjectId
router.delete(
  '/:id/soft',
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  softDeleteOrder
);

// Permanently delete an order (WARNING: This action cannot be undone)
// DELETE /api/orders/:id/permanent
// Access: ADMIN only
// Params: id - Order ObjectId
router.delete(
  '/:id/permanent',
  auth(USER_ROLE.ADMIN), // Only admin can permanently delete
  permanentDeleteOrder
);

/**
 * ============================================
 * FILE UPLOAD EXAMPLE (if needed)
 * ============================================
 * For endpoints that require file uploads (e.g., payment proof, invoice)
 */

// Example: Upload payment proof for an order
// POST /api/orders/:id/upload-payment-proof
// Access: USER (own orders), ADMIN, MANAGER
// File field name: 'paymentProof'
/*
router.post(
  '/:id/upload-payment-proof',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  uploadFile('paymentProof'), // Multer middleware for file upload
  async (req: Request, res: Response) => {
    // Handle uploaded file
    const file = (req as any).file;
    // Process and save file reference to order
    // Then call appropriate controller
  }
);
*/

/**
 * ============================================
 * EXPORT ROUTER
 * ============================================
 * Export the configured router for use in the main app
 * 
 * You can export in two ways:
 * 1. export default router (ES6 modules)
 * 2. module.exports = router (CommonJS)
 * 
 * Both are shown below - choose based on your project setup
 */

// Method 1: ES6 default export (recommended for TypeScript projects)
export default router;

// Method 2: Named export (alternative)
export const orderRouter = router;

// For CommonJS projects (if not using ES6 modules):
// module.exports = router;
// module.exports.orderRouter = router;
```

---

## 6️⃣ order.validation.ts - Zod Validation (Optional)

```typescript
/**
 * ORDER VALIDATION MODULE
 * 
 * This file contains Zod schemas for validating order-related requests.
 * Zod provides runtime type validation and type inference for TypeScript.
 * 
 * 📚 Zod Documentation:
 * @see https://zod.dev/
 * @see https://github.com/colinhacks/zod
 * 
 * 📚 Validation Best Practices:
 * @see https://www.google.com/search?q=express+request+validation+best+practices
 */

import { z } from 'zod';
import { Types } from 'mongoose';
import { OrderStatus, PaymentMethod, PaymentStatus } from './order.interface';

/**
 * Custom Zod refinement to validate MongoDB ObjectId
 */
const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId format' }
);

/**
 * Order Item Validation Schema
 */
const orderItemSchema = z.object({
  productId: objectIdSchema,
  name: z.string().min(1, 'Product name is required').max(200),
  sku: z.string().min(1, 'SKU is required'),
  quantity: z.number().int().positive('Quantity must be positive').max(999),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
  totalPrice: z.number().nonnegative('Total price cannot be negative'),
  discount: z.number().nonnegative().optional().default(0),
  image: z.string().url().optional().nullable()
});

/**
 * Shipping Address Validation Schema
 */
const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters').max(100),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required').default('Bangladesh'),
  landmark: z.string().optional()
});

/**
 * Billing Address Validation Schema
 */
const billingAddressSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

/**
 * Payment Details Validation Schema
 */
const paymentDetailsSchema = z.object({
  method: z.enum([PaymentMethod.CASH_ON_DELIVERY, PaymentMethod.CARD, PaymentMethod.BANK_TRANSFER, PaymentMethod.MOBILE_BANKING]),
  status: z.enum([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED, PaymentStatus.REFUNDED]).optional(),
  transactionId: z.string().optional(),
  paidAt: z.date().optional(),
  gatewayResponse: z.any().optional(),
  amount: z.number().nonnegative('Payment amount cannot be negative'),
  currency: z.enum(['USD', 'EUR', 'BDT', 'GBP', 'INR']).default('BDT')
});

/**
 * Discount Validation Schema
 */
const discountSchema = z.object({
  couponCode: z.string().optional(),
  discountAmount: z.number().nonnegative().default(0),
  discountType: z.enum(['percentage', 'fixed']).default('fixed'),
  appliedBy: objectIdSchema.optional()
});

/**
 * CREATE ORDER VALIDATION SCHEMA
 * Validates request body for POST /api/orders
 */
export const createOrderValidation = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
    shippingAddress: shippingAddressSchema,
    billingAddress: billingAddressSchema.optional(),
    sameAsShipping: z.boolean().optional().default(true),
    discount: discountSchema.optional(),
    shippingCost: z.number().nonnegative().optional().default(0),
    payment: paymentDetailsSchema,
    notes: z.string().max(1000).optional(),
    specialInstructions: z.string().max(500).optional()
  })
});

/**
 * UPDATE ORDER VALIDATION SCHEMA
 * Validates request body for PATCH /api/orders/:id
 */
export const updateOrderValidation = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema.partial().optional(),
    billingAddress: billingAddressSchema.partial().optional(),
    notes: z.string().max(1000).optional(),
    specialInstructions: z.string().max(500).optional(),
    trackingNumber: z.string().optional(),
    courierService: z.string().optional(),
    estimatedDelivery: z.string().datetime().optional(),
    sameAsShipping: z.boolean().optional()
  })
});

/**
 * UPDATE ORDER STATUS VALIDATION SCHEMA
 * Validates request body for PATCH /api/orders/:id/status
 */
export const updateOrderStatusValidation = z.object({
  body: z.object({
    status: z.enum([
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED
    ]),
    note: z.string().max(500).optional()
  })
});

/**
 * ORDER ID PARAM VALIDATION SCHEMA
 * Validates URL parameter for routes with :id
 */
export const orderIdParamValidation = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

/**
 * BULK UPDATE VALIDATION SCHEMA
 * Validates request body for PATCH /api/orders/bulk/status
 */
export const bulkUpdateValidation = z.object({
  body: z.object({
    orderIds: z.array(objectIdSchema).min(1, 'At least one order ID is required'),
    status: z.enum([
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED
    ])
  })
});

/**
 * GET ORDERS QUERY VALIDATION SCHEMA
 * Validates query parameters for GET /api/orders
 */
export const getOrdersQueryValidation = z.object({
  query: z.object({
    status: z.enum([
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
      OrderStatus.REFUNDED
    ]).optional(),
    paymentStatus: z.enum([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.FAILED, PaymentStatus.REFUNDED]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minAmount: z.string().regex(/^\d+$/).transform(Number).optional(),
    maxAmount: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
  })
});

/**
 * Type inference from Zod schemas
 * These types can be used in controllers for type safety
 */
export type TCreateOrderBody = z.infer<typeof createOrderValidation>['body'];
export type TUpdateOrderBody = z.infer<typeof updateOrderValidation>['body'];
export type TUpdateOrderStatusBody = z.infer<typeof updateOrderStatusValidation>['body'];
export type TBulkUpdateBody = z.infer<typeof bulkUpdateValidation>['body'];
export type TGetOrdersQuery = z.infer<typeof getOrdersQueryValidation>['query'];
```

---

## 🛠️ Supporting Middleware Files

### catchAsync.ts - Async Error Handler

```typescript
/**
 * CATCH ASYNC MIDDLEWARE
 * 
 * This utility wraps async route handlers to eliminate try-catch blocks.
 * It automatically catches errors and passes them to Express error handler.
 * 
 * 📚 Express Error Handling Documentation:
 * @see https://expressjs.com/en/guide/error-handling.html
 * 
 * @param fn - Async function to wrap
 * @returns Express middleware function
 */

import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
```

### sendResponse.ts - Standard Response Utility

```typescript
/**
 * SEND RESPONSE UTILITY
 * 
 * Standardizes API response format across the application.
 * 
 * 📚 API Response Best Practices:
 * @see https://www.google.com/search?q=rest+api+response+format+standard
 * 
 * @param res - Express response object
 * @param options - Response options
 */

import { Response } from 'express';

interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendResponse = <T>(res: Response, options: IApiResponse<T>): void => {
  res.status(options.statusCode).json({
    success: options.success,
    statusCode: options.statusCode,
    message: options.message,
    data: options.data,
    meta: options.meta
  });
};

export default sendResponse;
```

### auth.ts - Authentication Middleware
[auth documentation ](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/auth-middleware-doc.md)

### upload.ts - File Upload Middleware
[upload documentation](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/uploadimage-doc.md) 

### validate.ts - Zod Validation Middleware

```typescript
/**
 * ZOD VALIDATION MIDDLEWARE
 * 
 * Validates request data against Zod schemas.
 * 
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

export default validate;
```

---

## 📚 Complete API Documentation Summary

### Order API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | User, Admin | Create new order |
| GET | `/api/orders/my-orders` | User, Admin | Get current user's orders |
| GET | `/api/orders/:id` | User, Admin, Support | Get order by ID |
| GET | `/api/orders/number/:orderNumber` | User, Admin | Get order by order number |
| PATCH | `/api/orders/:id` | User, Admin | Update order |
| POST | `/api/orders/:id/cancel` | User, Admin | Cancel order |
| GET | `/api/orders` | Admin, Manager | Get all orders (with filters) |
| GET | `/api/orders/user/:userId` | Admin, Manager | Get user's orders |
| PATCH | `/api/orders/:id/status` | Admin, Manager | Update order status |
| POST | `/api/orders/:id/payment` | Admin, Manager | Process payment |
| GET | `/api/orders/statistics/dashboard` | Admin, Manager | Get order statistics |
| PATCH | `/api/orders/bulk/status` | Admin, Manager | Bulk update status |
| GET | `/api/orders/search/:term` | Admin, Manager | Search orders |
| DELETE | `/api/orders/:id/soft` | Admin, Manager | Soft delete order |
| DELETE | `/api/orders/:id/permanent` | Admin | Permanent delete |

---

## 🚀 How to Use This Documentation

1. **Copy the structure** - Create the `modules/order/` folder and all files
2. **Install dependencies**:
   ```bash
   npm install express mongoose typescript zod jsonwebtoken multer
   npm install -D @types/express @types/jsonwebtoken @types/multer
   ```

3. **Set up environment variables**:
   [env setup](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/env-doc.md)

4. **Register routes in app.ts**:
   [go route documentation ](https://github.com/Robiu-Sani/marn-express-initializer/blob/main/router-doc.md)

5. **Customize** based on your business requirements

This documentation provides a production-ready order module with full TypeScript support, validation, authentication, and best practices!
