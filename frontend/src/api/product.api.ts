import api from "./axios.config";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  categoryId?: string;
  images: string[];
  thumbnail?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const productApi = {
  getAll: (filter: ProductFilter) => api.get("/products", { params: filter }),

  getById: (id: string) => api.get(`/products/${id}`),

  create: (data: Partial<Product>) => api.post("/products", data),

  update: (id: string, data: Partial<Product>) =>
    api.put(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),

  bulkDelete: (ids: string[]) => api.post("/products/bulk-delete", { ids }),

  uploadImage: (file: File) => {
    const formData = new FormData();

    formData.append("image", file);

    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getStats: () => api.get("/products/stats"),
};
