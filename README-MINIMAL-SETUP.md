# Hướng Dẫn Setup Tối Thiểu - Product Admin System

## Mục Đích

File này hướng dẫn tạo 3 file tối thiểu để chạy backend server cơ bản. Sau khi hoàn thành, bạn có thể chạy `npm run dev` thành công và bắt đầu phát triển các tính năng theo file `README-Admin-Product-Management.md`.

## 3 File Tối Thiểu Cần Tạo

### 1. File: `backend/src/config/database.ts`

**Mục đích:** Kết nối MongoDB

```typescript
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/product_admin";

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
```

---

### 2. File: `backend/src/app.ts`

**Mục đích:** Cấu hình Express application

```typescript
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
```

---

### 3. File: `backend/src/server.ts`

**Mục đích:** Khởi động server và kết nối database

```typescript
import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kết nối database
    await connectDB();

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
```

---

## Cách Sử Dụng

### Bước 1: Tạo 3 file trên

Tạo đúng đường dẫn như đã chỉ định:

- `backend/src/config/database.ts`
- `backend/src/app.ts`
- `backend/src/server.ts`

### Bước 2: Kiểm tra file `.env`

Đảm bảo file `backend/.env` có:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/product_admin?authSource=admin
PORT=5000
NODE_ENV=development
```

### Bước 3: Chạy server

```bash
cd backend
npm run dev
```

### Bước 4: Kiểm tra

Mở browser truy cập: `http://localhost:5000/api/v1/health`

Bạn sẽ thấy response:

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-11-24T..."
}
```

---

## Sau Khi Setup Xong

Bây giờ bạn có server chạy thành công! Tiếp theo:

### 1. Thêm tính năng Authentication

Tham khảo section **"Authentication Service"** trong `README-Admin-Product-Management.md` (dòng 862+)

### 2. Thêm Product Module

Tham khảo section **"Product Model"** (dòng 383+), **"Product Service"** (dòng 497+), **"Product Controller"** (dòng 638+)

### 3. Thêm Category Module

Tham khảo section **"Category Module"** (dòng 1075+)

### 4. Thêm Upload Image

Tham khảo section **"Upload Middleware"** (dòng 2134+)

---

## Cấu Trúc Thư Mục Hiện Tại

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          ✅ (File 1)
│   ├── app.ts                    ✅ (File 2)
│   └── server.ts                 ✅ (File 3)
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## Cấu Trúc Thư Mục Đầy Đủ (Sau Khi Làm Theo README)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          ✅ Đã có
│   │   └── env.ts               ⏳ Tự làm (không bắt buộc)
│   ├── middlewares/
│   │   ├── auth.middleware.ts   ⏳ Làm khi cần auth
│   │   ├── error.middleware.ts  ⏳ Làm khi cần
│   │   └── validation.middleware.ts
│   ├── modules/
│   │   ├── auth/                ⏳ Làm theo README
│   │   ├── products/            ⏳ Làm theo README
│   │   └── categories/          ⏳ Làm theo README
│   ├── utils/
│   │   └── error.util.ts        ⏳ Làm khi cần
│   ├── app.ts                   ✅ Đã có
│   └── server.ts                ✅ Đã có
```

---

## Lưu Ý Quan Trọng

1. **TypeScript**: Tất cả file đều là `.ts`, không phải `.js`
2. **Import/Export**: Dùng ES6 modules (`import`/`export`)
3. **Database**: Đảm bảo MongoDB container đang chạy
4. **Dependencies**: Đã cài đủ packages (express, mongoose, cors, dotenv, typescript...)

---

## Troubleshooting

### Lỗi: `Cannot find module 'express'`

```bash
npm install
```

### Lỗi: `MongoDB connection failed`

Kiểm tra:

- Docker container MongoDB đang chạy: `docker ps`
- File `.env` có `MONGODB_URI` đúng
- Username/password khớp với khi tạo container

### Lỗi: `Port 5000 already in use`

Đổi port trong `.env`:

```env
PORT=3000
```

---

## Kết Luận

Sau khi setup 3 file này, bạn có:

- ✅ Server Express chạy được
- ✅ MongoDB kết nối thành công
- ✅ Health check endpoint hoạt động
- ✅ Nền tảng để phát triển các module theo README chính

**Bước tiếp theo:** Mở file `README-Admin-Product-Management.md` và làm theo từng section để thêm tính năng!
