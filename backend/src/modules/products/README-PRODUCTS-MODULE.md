# Product Module - Hướng Dẫn Chi Tiết

## 📁 Tổng Quan Cấu Trúc

```
products/
├── product.model.ts      → Định nghĩa cấu trúc dữ liệu (Schema)
├── product.service.ts    → Logic nghiệp vụ (CRUD operations)
├── product.controller.ts → Xử lý HTTP requests
├── product.routes.ts     → Định nghĩa URL endpoints
└── product.validation.ts → Validate dữ liệu đầu vào
```

---

## 🗂️ product.model.ts - Định Nghĩa Dữ Liệu

### Công dụng

Định nghĩa **cấu trúc sản phẩm** sẽ lưu vào MongoDB. Giống như bản thiết kế của 1 chiếc xe.

### Nội dung chính

#### 1. Interface IProduct - Khai báo kiểu dữ liệu TypeScript

```typescript
export interface IProduct extends Document {
  name: string; // Tên sản phẩm (bắt buộc)
  slug: string; // URL-friendly name (vd: iphone-15-pro)
  sku: string; // Mã sản phẩm duy nhất (vd: IP15-128GB-BLK)
  description?: string; // Mô tả chi tiết (? = không bắt buộc)
  price: number; // Giá bán
  salePrice?: number; // Giá khuyến mãi
  costPrice?: number; // Giá vốn
  quantity: number; // Số lượng tồn kho
  categoryId?: ObjectId; // ID danh mục
  images: string[]; // Mảng URL ảnh
  status: "draft" | "published" | "archived"; // Trạng thái
  // ... các field khác
}
```

**Ví dụ dữ liệu thực tế:**

```json
{
  "name": "iPhone 15 Pro Max 256GB",
  "slug": "iphone-15-pro-max-256gb",
  "sku": "IP15PM-256-TIT",
  "description": "Chip A17 Pro, Camera 48MP...",
  "price": 29990000,
  "salePrice": 27990000,
  "costPrice": 22000000,
  "quantity": 50,
  "status": "published"
}
```

#### 2. Schema - Định nghĩa cấu trúc MongoDB

```typescript
const productSchema = new Schema<IProduct>({
  name: {
    type: String, // Kiểu dữ liệu
    required: true, // Bắt buộc phải có
    trim: true, // Tự động xóa khoảng trắng đầu/cuối
  },
  sku: {
    type: String,
    required: true,
    unique: true, // Không được trùng
    uppercase: true, // Tự động viết HOA
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Giá >= 0
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"], // Chỉ cho phép 3 giá trị này
    default: "draft", // Giá trị mặc định
  },
  // ...
});
```

**Các tính năng quan trọng:**

**A. Validation (Kiểm tra dữ liệu)**

```typescript
price: { type: Number, min: 0 }  // Giá không được âm
sku: { unique: true }             // SKU không được trùng
email: { required: true }         // Email bắt buộc
```

**B. Transform (Biến đổi tự động)**

```typescript
slug: {
  lowercase: true;
} // "IPHONE" → "iphone"
sku: {
  uppercase: true;
} // "ip15" → "IP15"
name: {
  trim: true;
} // " iPhone " → "iPhone"
```

**C. Timestamps (Tự động tạo createdAt/updatedAt)**

```typescript
{
  timestamps: true; // Tự động thêm 2 field:
}
// → createdAt: 2025-11-24T10:30:00Z
// → updatedAt: 2025-11-24T15:45:00Z
```

#### 3. Indexes - Tăng tốc truy vấn

```typescript
// Text search - Tìm kiếm theo tên/mô tả
productSchema.index({ name: "text", description: "text" });
// → Dùng: Product.find({ $text: { $search: "iPhone" } })

// Compound index - Lọc theo nhiều điều kiện
productSchema.index({ categoryId: 1, status: 1 });
// → Dùng: Product.find({ categoryId: "xyz", status: "published" })

// Sort index - Sắp xếp
productSchema.index({ createdAt: -1 });
// → Dùng: Product.find().sort({ createdAt: -1 }) // Mới nhất trước
```

#### 4. Virtual Fields - Tính toán tự động

```typescript
productSchema.virtual("profitMargin").get(function () {
  if (this.costPrice && this.price) {
    return ((this.price - this.costPrice) / this.price) * 100;
  }
  return 0;
});
```

**Ví dụ:**

```typescript
const product = await Product.findById("123");
// product.price = 20,000,000
// product.costPrice = 15,000,000
// product.profitMargin = 25% (tự động tính, không lưu DB)
```

---

## 🔧 product.service.ts - Logic Nghiệp Vụ

### Công dụng

Chứa **tất cả logic** làm việc với database. Controller chỉ gọi Service, không trực tiếp thao tác DB.

### Tại sao cần Service Layer?

**❌ Không tốt - Controller trực tiếp gọi DB:**

```typescript
// Controller
async create(req, res) {
  const product = await Product.create(req.body); // ❌ Lộn xộn
  res.json(product);
}
```

**✅ Tốt - Controller gọi Service:**

```typescript
// Service
async create(data, userId) {
  const product = new Product({ ...data, createdBy: userId });
  return await product.save();
}

// Controller
async create(req, res) {
  const product = await productService.create(req.body, req.user.id);
  res.json(product);
}
```

**Lợi ích:**

- ✅ Dễ test (test Service độc lập)
- ✅ Tái sử dụng (nhiều Controller dùng chung Service)
- ✅ Logic tập trung 1 chỗ

---

### Các Method Chính

#### 1. create() - Tạo sản phẩm mới

```typescript
async create(data: Partial<IProduct>, userId: string): Promise<IProduct> {
  const product = new Product({
    ...data,
    createdBy: userId,    // Ghi nhận ai tạo
    updatedBy: userId
  });
  return await product.save();
}
```

**📖 Giải thích từng dòng:**

**Dòng 1: Khai báo function**

```typescript
async create(data: Partial<IProduct>, userId: string): Promise<IProduct>
```

- `async` = Hàm bất đồng bộ, có thể dùng `await` bên trong
- `data: Partial<IProduct>` = Nhận 1 phần dữ liệu sản phẩm (không cần đầy đủ)
  - Ví dụ: Chỉ cần `{ name, price, sku }` thay vì phải có hết 20 field
- `userId: string` = ID của user đang tạo sản phẩm
- `: Promise<IProduct>` = Trả về Promise, khi xong sẽ có object Product

**Dòng 2-6: Tạo Product instance**

```typescript
const product = new Product({
  ...data, // Spread tất cả field từ data
  createdBy: userId, // Thêm field: ai tạo
  updatedBy: userId, // Thêm field: ai sửa lần cuối
});
```

**`...data` (Spread operator):**

```typescript
// Nếu data = { name: "iPhone", price: 20000000 }
// Thì ...data tương đương:
{
  name: "iPhone",
  price: 20000000,
  createdBy: userId,
  updatedBy: userId
}
```

**Tại sao thêm `createdBy` và `updatedBy`?**

- Để biết **ai tạo** sản phẩm này (audit log)
- Khi có lỗi, biết hỏi ai
- Khi cần thống kê: user nào tạo nhiều sản phẩm nhất

**Dòng 7: Lưu vào database**

```typescript
return await product.save();
```

- `product.save()` = Mongoose method lưu vào MongoDB
- `await` = Chờ lưu xong mới chạy tiếp
- `return` = Trả về product đã lưu (có thêm `_id`, `createdAt`...)

**Luồng thực thi:**

```
1. Nhận data: { name: "iPhone", price: 20000000 }
2. Tạo object: { name: "iPhone", price: 20000000, createdBy: "user123", updatedBy: "user123" }
3. Gọi product.save() → Lưu vào MongoDB
4. MongoDB validate:
   - Có name? ✅
   - Có price? ✅
   - SKU unique? ✅
5. MongoDB lưu thành công
6. Trả về: { _id: "673abc...", name: "iPhone", ..., createdAt: "2025-11-24" }
```

---

**Cách dùng:**

```typescript
const newProduct = await productService.create(
  {
    name: "iPhone 15",
    sku: "IP15-128",
    price: 20000000,
  },
  "user123"
);
```

**Chi tiết từng bước:**

**Bước 1: Chuẩn bị data**

```typescript
const data = {
  name: "iPhone 15", // Tên sản phẩm
  sku: "IP15-128", // Mã sản phẩm
  price: 20000000, // Giá 20 triệu
  // Không cần truyền: description, quantity, images... → Partial cho phép
};
```

**Bước 2: Gọi function**

```typescript
const newProduct = await productService.create(data, "user123");
//                  ↑                           ↑      ↑
//                  Chờ                        data   userId
```

**Bước 3: Bên trong function**

```typescript
// 1. Spread data + thêm createdBy, updatedBy
const product = new Product({
  name: "iPhone 15",
  sku: "IP15-128",
  price: 20000000,
  createdBy: "user123", // ← Tự động thêm
  updatedBy: "user123", // ← Tự động thêm
});

// 2. Lưu vào DB
await product.save();
```

**Bước 4: Kết quả**

```typescript
console.log(newProduct);
// Output:
{
  _id: "673abc123def456",           // MongoDB tự tạo
  name: "iPhone 15",
  sku: "IP15-128",
  price: 20000000,
  quantity: 0,                      // Default từ schema
  status: "draft",                  // Default từ schema
  createdBy: "user123",
  updatedBy: "user123",
  createdAt: "2025-11-24T10:30:00Z", // Tự động (timestamps: true)
  updatedAt: "2025-11-24T10:30:00Z"  // Tự động (timestamps: true)
}
```

**Tại sao dùng `await`?**

```typescript
// ❌ KHÔNG dùng await (SAI)
const newProduct = productService.create(data, "user123");
console.log(newProduct); // Promise { <pending> } ← Chưa có data!

// ✅ Dùng await (ĐÚNG)
const newProduct = await productService.create(data, "user123");
console.log(newProduct); // { _id: "...", name: "iPhone 15" } ← Có data!
```

---

#### 2. findAll() - Lấy danh sách có phân trang

```typescript
async findAll(filter: ProductFilter) {
  const { page = 1, limit = 10, search, status, minPrice, maxPrice } = filter;

  // Xây dựng query
  const query: any = {};

  if (search) {
    query.$text = { $search: search }; // Tìm theo text
  }
  if (status) {
    query.status = status; // Lọc theo trạng thái
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = minPrice; // Giá >= minPrice
    if (maxPrice) query.price.$lte = maxPrice; // Giá <= maxPrice
  }

  // Phân trang
  const skip = (page - 1) * limit;

  // Thực thi query
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("categoryId", "name slug")  // Join với Category
      .sort({ createdAt: -1 })              // Mới nhất trước
      .skip(skip)                           // Bỏ qua X sản phẩm
      .limit(limit)                         // Lấy Y sản phẩm
      .lean(),                              // Trả về plain object
    Product.countDocuments(query)           // Đếm tổng số
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

**Ví dụ sử dụng:**

**A. Lấy trang 1, mỗi trang 10 sản phẩm**

```typescript
await productService.findAll({ page: 1, limit: 10 });
// → Trả về sản phẩm 1-10
```

**B. Tìm kiếm "iPhone" đang published**

```typescript
await productService.findAll({
  search: "iPhone",
  status: "published",
});
```

**C. Lọc giá từ 10tr - 20tr**

```typescript
await productService.findAll({
  minPrice: 10000000,
  maxPrice: 20000000,
});
```

**Response format:**

```json
{
  "data": [
    { "name": "iPhone 15", "price": 20000000, ... },
    { "name": "iPhone 14", "price": 15000000, ... }
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

#### 3. findById() - Lấy 1 sản phẩm theo ID

```typescript
async findById(id: string): Promise<IProduct | null> {
  return await Product.findById(id)
    .populate("categoryId")              // Kèm thông tin category
    .populate("createdBy", "fullName email"); // Kèm thông tin người tạo
}
```

**Ví dụ:**

```typescript
const product = await productService.findById("673abc123...");
// product.categoryId = { _id: "...", name: "Điện thoại", slug: "dien-thoai" }
// product.createdBy = { fullName: "Nguyen Van A", email: "a@gmail.com" }
```

---

#### 4. update() - Cập nhật sản phẩm

```typescript
async update(
  id: string,
  data: Partial<IProduct>,
  userId: string
): Promise<IProduct | null> {
  return await Product.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    {
      new: true,           // Trả về document sau khi update
      runValidators: true  // Chạy validation
    }
  );
}
```

**Ví dụ:**

```typescript
await productService.update(
  "673abc...",
  {
    price: 18000000,
    quantity: 100,
  },
  "user123"
);
```

---

#### 5. delete() - Xóa sản phẩm

```typescript
async delete(id: string): Promise<boolean> {
  const result = await Product.findByIdAndDelete(id);
  return !!result; // Convert to boolean
}
```

**Ví dụ:**

```typescript
const success = await productService.delete("673abc...");
// success = true nếu xóa thành công
// success = false nếu không tìm thấy
```

---

#### 6. bulkDelete() - Xóa nhiều sản phẩm

```typescript
async bulkDelete(ids: string[]): Promise<number> {
  const result = await Product.deleteMany({ _id: { $in: ids } });
  return result.deletedCount || 0;
}
```

**Ví dụ:**

```typescript
const deleted = await productService.bulkDelete([
  "673abc123...",
  "673def456...",
  "673ghi789...",
]);
// deleted = 3 (số sản phẩm đã xóa)
```

---

#### 7. getStats() - Thống kê tổng quan

```typescript
async getStats() {
  // Thống kê theo status
  const stats = await Product.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalValue: { $sum: { $multiply: ["$price", "$quantity"] } }
      }
    }
  ]);

  // Đếm sản phẩm sắp hết hàng
  const lowStock = await Product.countDocuments({ quantity: { $lt: 10 } });

  // Đếm sản phẩm hết hàng
  const outOfStock = await Product.countDocuments({ quantity: 0 });

  return { byStatus: stats, lowStock, outOfStock };
}
```

**Response:**

```json
{
  "byStatus": [
    { "_id": "published", "count": 120, "totalValue": 2400000000 },
    { "_id": "draft", "count": 30, "totalValue": 450000000 }
  ],
  "lowStock": 15,
  "outOfStock": 5
}
```

---

## 🎯 product.controller.ts - Xử Lý HTTP

### Công dụng

- Nhận HTTP request từ client
- Gọi Service để xử lý logic
- Trả HTTP response về client

### Cấu trúc Controller

```typescript
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // Mỗi method xử lý 1 endpoint
  create = async (req, res, next) => { ... }
  getAll = async (req, res, next) => { ... }
  getById = async (req, res, next) => { ... }
  update = async (req, res, next) => { ... }
  delete = async (req, res, next) => { ... }
}
```

---

### Luồng xử lý 1 request

```
Client                Controller              Service              Database
  │                       │                      │                     │
  │  POST /products       │                      │                     │
  ├──────────────────────>│                      │                     │
  │                       │                      │                     │
  │                       │  create(data)        │                     │
  │                       ├─────────────────────>│                     │
  │                       │                      │                     │
  │                       │                      │  Product.save()     │
  │                       │                      ├────────────────────>│
  │                       │                      │                     │
  │                       │                      │  saved product      │
  │                       │                      │<────────────────────┤
  │                       │                      │                     │
  │                       │  product object      │                     │
  │                       │<─────────────────────┤                     │
  │                       │                      │                     │
  │  { success: true, ... }                     │                     │
  │<──────────────────────┤                      │                     │
  │                       │                      │                     │
```

---

### Method chi tiết

#### 1. create() - Tạo sản phẩm

```typescript
create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Lấy userId từ token JWT
    const product = await this.productService.create(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error); // Chuyển error cho error handler
  }
};
```

**Request:**

```http
POST /api/v1/products
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "iPhone 15",
  "sku": "IP15-128",
  "price": 20000000,
  "quantity": 50
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "673abc123...",
    "name": "iPhone 15",
    "sku": "IP15-128",
    "price": 20000000,
    "createdAt": "2025-11-24T10:30:00Z"
  }
}
```

---

#### 2. getAll() - Lấy danh sách

```typescript
getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await this.productService.findAll(req.query);

    res.status(200).json({
      success: true,
      ...result, // Spread data và pagination
    });
  } catch (error) {
    next(error);
  }
};
```

**Request:**

```http
GET /api/v1/products?page=1&limit=10&search=iPhone&status=published
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "iPhone 15", ... },
    { "_id": "...", "name": "iPhone 14", ... }
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

#### 3. getById() - Lấy 1 sản phẩm

```typescript
getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await this.productService.findById(req.params.id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

**Request:**

```http
GET /api/v1/products/673abc123...
```

**Response (200 OK hoặc 404 Not Found):**

```json
{
  "success": true,
  "data": {
    "_id": "673abc123...",
    "name": "iPhone 15",
    "categoryId": { "name": "Điện thoại", ... }
  }
}
```

---

#### 4. update() - Cập nhật

```typescript
update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const product = await this.productService.update(
      req.params.id,
      req.body,
      userId
    );

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
```

**Request:**

```http
PUT /api/v1/products/673abc123...
Content-Type: application/json

{
  "price": 18000000,
  "quantity": 75
}
```

---

#### 5. delete() - Xóa

```typescript
delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await this.productService.delete(req.params.id);

    if (!success) {
      throw new AppError("Product not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
```

**Request:**

```http
DELETE /api/v1/products/673abc123...
```

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🔄 Quy Trình Hoạt Động Tổng Thể

### Ví dụ: Tạo sản phẩm mới

```
1. Client gửi request
   POST /api/v1/products
   Body: { name: "iPhone 15", price: 20000000 }
   Header: Authorization: Bearer eyJhbGc...

2. Routes nhận request
   product.routes.ts
   ↓ Kiểm tra authentication (authMiddleware)
   ↓ Validate dữ liệu (validateRequest)
   ↓ Chuyển đến controller

3. Controller xử lý
   product.controller.ts
   ↓ Lấy userId từ req.user
   ↓ Gọi productService.create()

4. Service xử lý logic
   product.service.ts
   ↓ Thêm createdBy, updatedBy
   ↓ Tạo Product instance
   ↓ Gọi product.save()

5. Model validate và lưu
   product.model.ts
   ↓ Kiểm tra required fields
   ↓ Kiểm tra unique (sku)
   ↓ Chạy validation rules
   ↓ Transform (uppercase sku, trim name)
   ↓ Lưu vào MongoDB

6. MongoDB trả kết quả
   ↓ Document đã lưu

7. Service trả về Controller
   ↓ Product object

8. Controller trả response
   ↓ Status 201
   ↓ JSON: { success: true, data: {...} }

9. Client nhận response
```

---

## 📊 So Sánh Vai Trò

| File           | Vai trò             | Ví dụ                                        |
| -------------- | ------------------- | -------------------------------------------- |
| **Model**      | Định nghĩa cấu trúc | "Sản phẩm phải có tên, giá, SKU unique"      |
| **Service**    | Logic nghiệp vụ     | "Tạo sản phẩm + ghi nhận người tạo"          |
| **Controller** | Xử lý HTTP          | "Nhận POST request → gọi Service → trả JSON" |
| **Routes**     | Định nghĩa URL      | "POST /products → productController.create"  |

---

## 🎓 Tổng Kết

### Khi nào dùng cái gì?

**Thêm field mới?** → Sửa `product.model.ts`

```typescript
// Thêm field "warranty" (thời gian bảo hành)
warranty: { type: Number, default: 12 } // 12 tháng
```

**Thêm logic mới?** → Sửa `product.service.ts`

```typescript
// Thêm method tìm sản phẩm bán chạy
async getBestSellers(limit: number) {
  return await Product.find()
    .sort({ soldCount: -1 })
    .limit(limit);
}
```

**Thêm endpoint mới?** → Sửa `product.controller.ts` + `product.routes.ts`

```typescript
// Controller
getBestSellers = async (req, res, next) => {
  const products = await this.productService.getBestSellers(10);
  res.json({ success: true, data: products });
};

// Routes
router.get("/best-sellers", productController.getBestSellers);
```

---

### Nguyên tắc vàng

1. **Model** = Cấu trúc dữ liệu, validation
2. **Service** = Logic nghiệp vụ, truy vấn DB
3. **Controller** = Xử lý HTTP, không chứa logic phức tạp
4. **Phân tầng rõ ràng** = Dễ test, dễ bảo trì, dễ mở rộng

---

## 🚀 Bước Tiếp Theo

Sau khi hiểu Product Module, bạn có thể:

1. ✅ Tạo Category Module (copy pattern tương tự)
2. ✅ Tạo User Module (thêm authentication logic)
3. ✅ Thêm tính năng upload ảnh
4. ✅ Thêm validation nâng cao
5. ✅ Viết unit tests cho Service

**Lưu ý:** Không cần học thuộc! Hiểu logic và pattern, khi cần thì xem lại file này làm tham khảo.
