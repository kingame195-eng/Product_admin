import mongoose, { Schema, Document } from "mongoose";

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

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    shortDescription: { type: String, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: String, trim: true },
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    images: [{ type: String }],
    thumbnail: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: String },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for profit margin
productSchema.virtual("profitMargin").get(function (this: IProduct) {
  if (this.costPrice && this.price) {
    return ((this.price - this.costPrice) / this.price) * 100;
  }
  return 0;
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
