# 📡 API DOCUMENTATION - Toàn Bộ Endpoints

**Danh sách tất cả API endpoints trong Product Admin System**

---

## 🔗 Base URL

- **Development:** `http://localhost:5001/api/v1`
- **Production:** `https://yourdomain.com/api/v1`

---

## 🔐 Authentication

Tất cả request (trừ Login/Register) cần header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Token được thêm tự động bởi Axios interceptor** trong `frontend/src/api/axios.config.ts`

---

# 🔑 AUTH Endpoints

## 1. Register - Đăng ký tài khoản

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@gmail.com",
      "fullName": "John Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## 2. Login - Đăng nhập

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "admin@gmail.com",
      "fullName": "Admin User",
      "role": "admin"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Errors:**

- `400 Bad Request` - Email/password invalid
- `401 Unauthorized` - Credentials wrong

---

## 3. Refresh Token - Refresh access token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Auto-called by Axios interceptor** khi access token expired (401)

---

## 4. Get Current User - Lấy info user hiện tại

```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@gmail.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

---

# 📦 PRODUCT Endpoints

**Require:** `Authorization` header (All endpoints need auth)

## 1. Get All Products - Lấy danh sách sản phẩm

```http
GET /api/v1/products?page=1&limit=10&search=iPhone&status=published
Authorization: Bearer eyJhbGc...
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Trang thứ bao nhiêu |
| limit | number | 10 | Số sản phẩm/trang |
| search | string | - | Tìm kiếm theo tên |
| status | string | - | Filter: published, draft, archived |
| sort | string | -createdAt | Sắp xếp: name, price, createdAt |

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15",
      "sku": "IP15-128",
      "price": 20000000,
      "salePrice": 18000000,
      "quantity": 50,
      "status": "published",
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 156,
    "totalPages": 16
  }
}
```

---

## 2. Get Product by ID - Lấy 1 sản phẩm

```http
GET /api/v1/products/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15",
    "sku": "IP15-128",
    "price": 20000000,
    "salePrice": 18000000,
    "quantity": 50,
    "description": "Latest iPhone model",
    "status": "published",
    "createdBy": "507f1f77bcf86cd799439010",
    "updatedBy": "507f1f77bcf86cd799439010",
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z"
  }
}
```

**Errors:**

- `404 Not Found` - Product không tồn tại

---

## 3. Create Product - Tạo sản phẩm mới

```http
POST /api/v1/products
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "iPhone 15",
  "sku": "IP15-128",
  "price": 20000000,
  "salePrice": 18000000,
  "quantity": 50,
  "description": "Latest iPhone model",
  "categoryId": "507f1f77bcf86cd799439012",
  "status": "published"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15",
    "sku": "IP15-128",
    "price": 20000000,
    "salePrice": 18000000,
    "quantity": 50,
    "status": "published",
    "createdBy": "507f1f77bcf86cd799439010"
  }
}
```

---

## 4. Update Product - Cập nhật sản phẩm

```http
PUT /api/v1/products/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "price": 19000000,
  "quantity": 45,
  "status": "draft"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15",
    "price": 19000000,
    "quantity": 45,
    "status": "draft",
    "updatedBy": "507f1f77bcf86cd799439010"
  }
}
```

---

## 5. Delete Product - Xóa sản phẩm

```http
DELETE /api/v1/products/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 6. Bulk Delete - Xóa nhiều sản phẩm cùng lúc

```http
POST /api/v1/products/bulk-delete
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "ids": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "3 products deleted successfully"
}
```

---

## 7. Get Stats - Lấy thống kê

```http
GET /api/v1/products/stats
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalProducts": 156,
    "totalInventoryValue": 5000000000,
    "lowStockProducts": 23,
    "totalSalesThisMonth": 12500000000
  }
}
```

---

## 8. Upload Image - Upload ảnh sản phẩm

```http
POST /api/v1/upload/image
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data

(file upload: image.jpg)
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/products/1701410400000-123456789.jpg",
    "filename": "1701410400000-123456789.jpg"
  }
}
```

---

# 🏷️ CATEGORY Endpoints

## 1. Get All Categories - Lấy danh sách danh mục

```http
GET /api/v1/categories
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Electronics",
      "description": "Electronic devices",
      "isActive": true
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Accessories",
      "isActive": true
    }
  ]
}
```

---

## 2. Create Category - Tạo danh mục

```http
POST /api/v1/categories
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Electronics",
    "description": "Electronic devices",
    "isActive": true
  }
}
```

---

# 🏥 HEALTH Check

## Health Status - Kiểm tra server

```http
GET /api/v1/health
```

**Response (200 OK):**

```json
{
  "status": "OK",
  "timestamp": "2025-12-01T10:00:00.000Z"
}
```

---

# 📊 Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Email must be a valid email address"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# 🧪 Test Endpoints (Curl)

### Login

```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'
```

### Get Products

```bash
curl -X GET http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product

```bash
curl -X POST http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "price": 20000000,
    "quantity": 50
  }'
```

---

# 📚 Frontend Integration (React)

## Using `productApi` helper

```typescript
import { productApi } from "../api/product.api";

// Get all products
const { data } = await productApi.getAll({ page: 1, limit: 10 });

// Get single product
const product = await productApi.getById("507f1f77bcf86cd799439011");

// Create product
const newProduct = await productApi.create({
  name: "iPhone 15",
  price: 20000000,
});

// Update product
const updated = await productApi.update("507f1f77bcf86cd799439011", {
  price: 19000000,
});

// Delete product
await productApi.delete("507f1f77bcf86cd799439011");

// Upload image
const { url } = await productApi.uploadImage(file);
```

---

# 🔒 Security Features

✅ **Implemented:**

- JWT authentication (access + refresh tokens)
- Password hashing (bcryptjs)
- CORS protection
- Request validation (Joi)
- Error handling + logging
- SQL injection protection (Mongoose)

⚠️ **Production Checklist:**

- [ ] Change JWT secrets to strong random keys
- [ ] Enable HTTPS only
- [ ] Set CORS_ORIGIN to frontend domain only
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Add rate limiting
- [ ] Enable request logging
- [ ] Setup monitoring/alerts

---

**Generated:** 2025-12-01
**Status:** ✅ All endpoints documented
