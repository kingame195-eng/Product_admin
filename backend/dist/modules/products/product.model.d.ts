import mongoose, { Document } from "mongoose";
export interface IProduct extends Document {
    name: string;
    slug: string;
    sku: string;
    description?: string;
    shortDescription?: string;
    price: number;
    salePrice?: number;
    costPrice?: number;
    quantity: number;
    categoryId?: mongoose.Types.ObjectId;
    brand?: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    images: string[];
    thumbnail?: string;
    status: "draft" | "published" | "archived";
    isFeatured: boolean;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        metaKeywords?: string;
    };
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=product.model.d.ts.map