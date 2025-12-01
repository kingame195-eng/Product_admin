# 🔐 AUTHORIZATION & PERMISSIONS - Chi Tiết Phân Quyền

**Hướng dẫn chi tiết: Nơi đặt quy tắc phân quyền trong project**

---

## 📍 Chỗ Phân Quyền Chính

### 1️⃣ **Backend - Route Level**

**File: `backend/src/modules/products/product.routes.ts`**

```typescript
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ProductController } from "./product.controller";

const router = Router();
const productController = new ProductController();

// ✅ Tất cả routes dưới đây cần authentication
router.use(authMiddleware); // ← Check user login trước

// Tất cả users (admin, manager, staff) đều có thể GET
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

// Chỉ admin mới có thể POST (tạo sản phẩm)
router.post(
  "/",
  roleMiddleware("admin"), // ← Check role = admin
  validateRequest(productValidation.create),
  productController.create
);

// Chỉ admin mới có thể PUT (sửa)
router.put(
  "/:id",
  roleMiddleware("admin"),
  validateRequest(productValidation.update),
  productController.update
);

// Chỉ admin mới có thể DELETE (xóa)
router.delete("/:id", roleMiddleware("admin"), productController.delete);

export default router;
```

---

### 2️⃣ **Backend - Controller Level**

**File: `backend/src/modules/products/product.controller.ts`**

```typescript
export class ProductController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ← Middleware đã check role rồi, không cần check lại
      const userId = req.user?.id;
      const product = await this.productService.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };
}
```

---

### 3️⃣ **Frontend - Route Level**

**File: `frontend/src/App.tsx`**

```typescript
<Routes>
  <Route path="/login" element={<Login />} />

  {/* User Routes - cho non-admin */}
  <Route element={<ProtectedRoute />}>
    <Route path="/user" element={<UserDashboard />} />
  </Route>

  {/* Admin Routes - chỉ cho admin */}
  <Route
    element={
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    }
  >
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products" element={<Products />} /> {/* ← Chỉ admin vào */}
  </Route>
</Routes>
```

---

### 4️⃣ **Frontend - Component Level**

**File: `frontend/src/routes/ProtectedAdminRoute.tsx`**

```typescript
export const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spin />;

  // ← Check role = admin
  if (user?.role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};
```

---

## 🏗️ 3 Tầng Phân Quyền

```
┌─────────────────────────────────────────┐
│  FRONTEND (React)                       │
│  ProtectedAdminRoute                    │ ← Route-based (role check)
│  {user.role === "admin" ? <...> : <...>}│ ← Component-based
└─────────────────────────────────────────┘
             ↓ (API call)
┌─────────────────────────────────────────┐
│  BACKEND (Express)                      │
│  Route Middleware (roleMiddleware)      │ ← Route-based (check JWT role)
│  Controller Logic                       │ ← Business logic
│  Service                                │ ← Data access
└─────────────────────────────────────────┘
```

---

## 🛠️ Cách Tạo Role Middleware

### Step 1: Tạo `roleMiddleware.ts`

**File: `backend/src/middlewares/role.middleware.ts`**

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";

/**
 * Role Middleware
 * Kiểm tra user role (admin, manager, staff, user)
 *
 * @param allowedRoles - Roles được phép (array hoặc string)
 *
 * Usage:
 * router.post("/", roleMiddleware("admin"), controller.create);
 * router.post("/", roleMiddleware(["admin", "manager"]), controller.create);
 */
export const roleMiddleware = (allowedRoles: string | string[]) => {
  // Convert string to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Get user role từ JWT token (attach bởi authMiddleware)
      const userRole = (req as any).user?.role;

      console.log("[ROLE] User role:", userRole, "Allowed:", roles);

      // Check nếu user role nằm trong allowedRoles
      if (!roles.includes(userRole)) {
        throw new AppError(
          `Only ${roles.join(", ")} can access this resource`,
          403
        );
      }

      // User role OK → gọi next middleware
      next();
    } catch (error) {
      next(error);
    }
  };
};
```

---

### Step 2: Update Routes

**File: `backend/src/modules/products/product.routes.ts`**

```typescript
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware"; // ← Import
import { ProductController } from "./product.controller";

const router = Router();
const productController = new ProductController();

// ✅ Tất cả requests phải authenticate
router.use(authMiddleware);

// ✅ Everyone có thể GET
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

// ❌ Chỉ admin có thể POST
router.post(
  "/",
  roleMiddleware("admin"), // ← Check role = admin
  productController.create
);

// ❌ Chỉ admin + manager có thể PUT
router.put(
  "/:id",
  roleMiddleware(["admin", "manager"]), // ← Array = multiple roles
  productController.update
);

// ❌ Chỉ admin có thể DELETE
router.delete("/:id", roleMiddleware("admin"), productController.delete);

export default router;
```

---

## 📊 Role Permissions Matrix

| Endpoint    | GET     | POST     | PUT      | DELETE   |
| ----------- | ------- | -------- | -------- | -------- |
| /products   | ✅ All  | ❌ Admin | ❌ Admin | ❌ Admin |
| /categories | ✅ All  | ❌ Admin | ❌ Admin | ❌ Admin |
| /auth/me    | ✅ Auth | -        | -        | -        |
| /auth/login | -       | ✅ All   | -        | -        |

---

## 🎯 Roles System

### Available Roles

```typescript
type UserRole = "admin" | "manager" | "staff" | "user";

// Permissions by role
Permissions = {
  admin: {
    create: true, // Tạo sản phẩm
    read: true, // Xem sản phẩm
    update: true, // Sửa sản phẩm
    delete: true, // Xóa sản phẩm
    manage_users: true,
    reports: true,
  },
  manager: {
    create: true,
    read: true,
    update: true,
    delete: false, // ← Không xóa
    manage_users: false,
    reports: true,
  },
  staff: {
    create: false,
    read: true,
    update: false,
    delete: false,
    manage_users: false,
    reports: false,
  },
  user: {
    create: false,
    read: true, // Chỉ xem
    update: false,
    delete: false,
    manage_users: false,
    reports: false,
  },
};
```

---

## 🔄 Authorization Flow

### 1. User Login

```
POST /api/v1/auth/login
{ email, password }
↓
AuthService.login()
↓
JWT Token = jwt.sign({ id, email, role }, secret)
↓
Return token + user info (role included)
```

### 2. Request to Protected Route

```
GET /api/v1/products
Headers: Authorization: Bearer TOKEN
↓
authMiddleware: verify JWT
↓
req.user = { id, email, role }  ← Role attach vào request
↓
roleMiddleware: check req.user.role
↓
✅ Role OK → next()
❌ Role wrong → throw AppError 403
↓
Controller xử lý
```

### 3. Response

```json
{
  "success": true,
  "data": { ... },
  "role": "admin"  // ← Client biết role của user
}
```

---

## 💡 Best Practices

### ✅ DO:

```typescript
// 1. Check role ở middleware (centralized)
router.post("/", roleMiddleware("admin"), controller.create);

// 2. Fail fast (check quyền trước execute logic)
router.use(authMiddleware); // Before all routes

// 3. Use descriptive error messages
throw new AppError("Only admin can create products", 403);

// 4. Log authorization attempts
console.log(`[ROLE] User ${user.id} tried to access admin route`);
```

### ❌ DON'T:

```typescript
// 1. Check role ở controller (spread logic)
create = (req, res) => {
  if (req.user.role !== "admin") {
    throw error;
  } // ← Don't
};

// 2. Allow before check
router.post("/", controller.create, roleMiddleware); // ← Wrong order

// 3. Generic error messages
throw new AppError("Unauthorized", 401); // ← Too vague

// 4. Trust frontend role (always verify server-side)
// Frontend có thể fake role, backend phải verify!
```

---

## 🧪 Test Authorization

### Test Admin

```bash
curl -X POST http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone"}'

# Response: 201 Created ✅
```

### Test Non-Admin

```bash
curl -X POST http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone"}'

# Response: 403 Forbidden ❌
# Message: "Only admin can access this resource"
```

---

## 📋 Implementation Checklist

- [ ] Create `roleMiddleware.ts`
- [ ] Add `roleMiddleware` imports to all route files
- [ ] Wrap admin-only endpoints with `roleMiddleware("admin")`
- [ ] Wrap manager endpoints with `roleMiddleware(["admin", "manager"])`
- [ ] Test each endpoint with different roles
- [ ] Update API documentation
- [ ] Add role-based UI in frontend (show/hide buttons)
- [ ] Test frontend redirect (non-admin → /user)
- [ ] Update database seed with different roles
- [ ] Add monitoring/logs for authorization failures

---

## 🚀 Next Steps

1. **Implement roleMiddleware** (file: `backend/src/middlewares/role.middleware.ts`)
2. **Update all routes** to use `roleMiddleware`
3. **Test with curl** or Postman
4. **Update frontend** to handle different roles (show/hide UI)
5. **Add role-based buttons** (disable for non-admin)

---

**Summary:**

- ✅ Frontend: ProtectedAdminRoute component
- ✅ Backend: authMiddleware (verify JWT)
- ❌ Backend: roleMiddleware (not created yet - create it!)
- ✅ Routes: Use both middlewares

Nếu bạn muốn, tôi có thể tạo `roleMiddleware.ts` cho bạn ngay! 🚀
