# API Documentation

## Overview

This document describes the REST API endpoints for the Real Estate Consultancy Platform.

**Base URL:** `https://your-domain.com/api`  
**Authentication:** Session-based (cookies)  
**Rate Limiting:** 100 requests per 15 minutes (global), 5 requests per 15 minutes (admin auth)

## Authentication

### Client/Developer Authentication (Replit OIDC)

**Endpoint:** `/api/auth/login`  
**Method:** `GET`  
**Description:** Initiates Replit OAuth flow

**Endpoint:** `/api/auth/callback`  
**Method:** `GET`  
**Description:** OAuth callback handler

**Endpoint:** `/api/auth/user`  
**Method:** `GET`  
**Description:** Get current authenticated user  
**Response:**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "client"
}
```

**Endpoint:** `/api/auth/logout`  
**Method:** `POST`  
**Description:** Logout current user

### Admin Authentication (Password-based)

**Endpoint:** `/api/admin/auth/login`  
**Method:** `POST`  
**Body:**
```json
{
  "username": "admin",
  "password": "your-password"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "requiresPasswordChange": true
}
```

**Endpoint:** `/api/admin/auth/change-password`  
**Method:** `POST`  
**Body:**
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-secure-password"
}
```

**Endpoint:** `/api/admin/auth/user`  
**Method:** `GET`  
**Description:** Get current admin user

**Endpoint:** `/api/admin/auth/logout`  
**Method:** `POST`  
**Description:** Logout admin user

## Consultations

### Book Consultation

**Endpoint:** `/api/consultations/book`  
**Method:** `POST`  
**Authentication:** Required (Client)  
**Body:**
```json
{
  "fullName": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "phone": "+201234567890",
  "cityRegion": "Cairo - New Cairo",
  "preferredDate": "2025-11-20",
  "preferredTime": "10:00",
  "propertyType": "apartment",
  "purposeTypeAr": "شراء",
  "purposeTypeEn": "Purchase",
  "budget": "1500000",
  "firstContactMethod": "phone"
}
```
**Response:**
```json
{
  "bookingId": 123,
  "status": "pending",
  "paymentRequired": true
}
```

### Get User Consultations

**Endpoint:** `/api/consultations`  
**Method:** `GET`  
**Authentication:** Required (Client)  
**Response:**
```json
[
  {
    "id": 123,
    "fullName": "Ahmed Mohamed",
    "status": "confirmed",
    "preferredDate": "2025-11-20",
    "preferredTime": "10:00",
    "createdAt": "2025-11-17T10:00:00Z"
  }
]
```

### Admin: Get All Consultations

**Endpoint:** `/api/admin/consultations`  
**Method:** `GET`  
**Authentication:** Required (Admin)  
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)

**Response:**
```json
{
  "consultations": [...],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### Admin: Update Consultation Status

**Endpoint:** `/api/admin/consultations/:id/status`  
**Method:** `PATCH`  
**Authentication:** Required (Admin)  
**Body:**
```json
{
  "status": "confirmed",
  "notes": "Consultation confirmed for 10 AM"
}
```

## Payments

### Create Payment Intent

**Endpoint:** `/api/payments/create-intent`  
**Method:** `POST`  
**Authentication:** Required (Client)  
**Body:**
```json
{
  "bookingId": 123,
  "amount": 20000,
  "paymentMethod": "stripe"
}
```
**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": 456
}
```

### Webhook: Stripe Payment Success

**Endpoint:** `/api/payments/stripe-webhook`  
**Method:** `POST`  
**Authentication:** Stripe signature verification  
**Description:** Handles Stripe payment events

### Admin: Get Payments

**Endpoint:** `/api/admin/payments`  
**Method:** `GET`  
**Authentication:** Required (Admin)  
**Query Parameters:**
- `status` (optional): pending, succeeded, failed
- `page` (optional): Page number
- `limit` (optional): Items per page

## Properties

### Get Properties

**Endpoint:** `/api/properties`  
**Method:** `GET`  
**Authentication:** Optional  
**Query Parameters:**
- `region` (optional): Filter by region
- `propertyType` (optional): apartment, villa, land, commercial
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "properties": [
    {
      "id": 1,
      "titleAr": "شقة فاخرة بالقاهرة الجديدة",
      "titleEn": "Luxury Apartment in New Cairo",
      "price": 1500000,
      "region": "Cairo - New Cairo",
      "propertyType": "apartment",
      "images": [...],
      "developer": {
        "id": 10,
        "name": "ABC Developments",
        "trustScore": 4.5
      }
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

### Developer: Create Property

**Endpoint:** `/api/developer/properties`  
**Method:** `POST`  
**Authentication:** Required (Developer)  
**Body:**
```json
{
  "titleAr": "شقة فاخرة",
  "titleEn": "Luxury Apartment",
  "descriptionAr": "وصف مفصل",
  "descriptionEn": "Detailed description",
  "price": 1500000,
  "region": "Cairo - New Cairo",
  "propertyType": "apartment",
  "images": ["url1", "url2"],
  "amenities": ["parking", "gym", "pool"]
}
```

### Developer: Update Property

**Endpoint:** `/api/developer/properties/:id`  
**Method:** `PATCH`  
**Authentication:** Required (Developer)

### Developer: Delete Property

**Endpoint:** `/api/developer/properties/:id`  
**Method:** `DELETE`  
**Authentication:** Required (Developer)

## Market Data

### Get Market Data

**Endpoint:** `/api/market`  
**Method:** `GET`  
**Authentication:** Optional  
**Query Parameters:**
- `region` (optional): Filter by region
- `propertyType` (optional): Filter by property type

**Response:**
```json
{
  "region": "Cairo - New Cairo",
  "averagePrice": 1200000,
  "pricePerSqm": 8000,
  "trend": "up",
  "trendPercentage": 5.2,
  "lastUpdated": "2025-11-17"
}
```

### Admin: Upload Market Data

**Endpoint:** `/api/admin/market/upload`  
**Method:** `POST`  
**Authentication:** Required (Admin)  
**Body:** FormData with CSV file
**Description:** Bulk upload market data from CSV

## Users

### Admin: Get All Users

**Endpoint:** `/api/admin/users`  
**Method:** `GET`  
**Authentication:** Required (Admin)  
**Query Parameters:**
- `role` (optional): client, developer
- `page`, `limit`

### Admin: Update User Role

**Endpoint:** `/api/admin/users/:id/role`  
**Method:** `PATCH`  
**Authentication:** Required (Admin)  
**Body:**
```json
{
  "role": "developer"
}
```

## Developers

### Admin: Get Developers

**Endpoint:** `/api/admin/developers`  
**Method:** `GET`  
**Authentication:** Required (Admin)

### Admin: Verify Developer

**Endpoint:** `/api/admin/developers/:id/verify`  
**Method:** `POST`  
**Authentication:** Required (Admin)  
**Body:**
```json
{
  "verified": true,
  "trustScore": 4.5
}
```

## Health & Monitoring

### Health Check

**Endpoint:** `/health`  
**Method:** `GET`  
**Authentication:** None  
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-17T10:00:00Z",
  "uptime": 86400,
  "memory": {
    "used": 128,
    "total": 512
  },
  "environment": "production"
}
```

### Readiness Check

**Endpoint:** `/health/ready`  
**Method:** `GET`  
**Authentication:** None  
**Response:**
```json
{
  "ready": true
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "message": "Error description",
  "requestId": "req_abc123"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
- `503` - Service Unavailable (health check failed)

## Rate Limiting

Headers returned with rate-limited requests:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1700220000
```

## Request ID Tracking

All requests include an `X-Request-ID` header in the response for debugging:

```
X-Request-ID: req_abc123def456
```

Use this ID when reporting issues or debugging production problems.
