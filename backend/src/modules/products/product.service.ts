import { Product, IProduct } from "./product.model";

interface ProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class ProductService {
  async create(data: Partial<IProduct>, userId: string): Promise<IProduct> {
    const product = new Product({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });
    return await product.save();
  }

  async findAll(filter: ProductFilter) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      status,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filter;

    const query: any = {};

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (categoryId) query.categoryId = categoryId;
    if (status) query.status = status;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("categoryId", "name slug")
        .populate("createdBy", "fullName email")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id)
      .populate("categoryId")
      .populate("createdBy", "fullName email");
  }

  async update(
    id: string,
    data: Partial<IProduct>,
    userId: string
  ): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      { ...data, updatedBy: userId },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { quantity } },
      { new: true }
    );
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await Product.deleteMany({ _id: { $in: ids } });
    return result.deletedCount || 0;
  }

  async getStats() {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    const lowStock = await Product.countDocuments({ quantity: { $lt: 10 } });
    const outOfStock = await Product.countDocuments({ quantity: 0 });

    return {
      byStatus: stats,
      lowStock,
      outOfStock,
    };
  }
}