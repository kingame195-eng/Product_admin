import { IProduct } from "./product.model";
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
export declare class ProductService {
    create(data: Partial<IProduct>, userId: string): Promise<IProduct>;
    findAll(filter: ProductFilter): Promise<{
        data: (IProduct & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<IProduct | null>;
    update(id: string, data: Partial<IProduct>, userId: string): Promise<IProduct | null>;
    delete(id: string): Promise<boolean>;
    updateStock(id: string, quantity: number): Promise<IProduct | null>;
    bulkDelete(ids: string[]): Promise<number>;
    getStats(): Promise<{
        byStatus: any[];
        lowStock: number;
        outOfStock: number;
    }>;
}
export {};
//# sourceMappingURL=product.service.d.ts.map