import Joi from "joi";

export const productValidation = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(255),
    slug: Joi.string()
      .lowercase()
      .pattern(/^[a-z0-9-]+$/),
    sku: Joi.string().required().uppercase(),
    description: Joi.string().allow(""),
    shortDescription: Joi.string().max(500),
    price: Joi.number().required().min(0),
    salePrice: Joi.number().min(0).less(Joi.ref("price")),
    costPrice: Joi.number().min(0),
    quantity: Joi.number().integer().min(0).default(0),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    brand: Joi.string(),
    weight: Joi.number().min(0),
    dimensions: Joi.object({
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0),
    }),
    images: Joi.array().items(Joi.string().uri()),
    thumbnail: Joi.string().uri(),
    status: Joi.string().valid("draft", "published", "archived"),
    isFeatured: Joi.boolean(),
    seo: Joi.object({
      metaTitle: Joi.string().max(255),
      metaDescription: Joi.string().max(500),
      metaKeywords: Joi.string(),
    }),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(255),
    slug: Joi.string()
      .lowercase()
      .pattern(/^[a-z0-9-]+$/),
    sku: Joi.string().uppercase(),
    description: Joi.string().allow(""),
    shortDescription: Joi.string().max(500),
    price: Joi.number().min(0),
    salePrice: Joi.number().min(0).less(Joi.ref("price")),
    costPrice: Joi.number().min(0),
    quantity: Joi.number().integer().min(0),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    brand: Joi.string(),
    weight: Joi.number().min(0),
    dimensions: Joi.object({
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0),
    }),
    images: Joi.array().items(Joi.string().uri()),
    thumbnail: Joi.string().uri(),
    status: Joi.string().valid("draft", "published", "archived"),
    isFeatured: Joi.boolean(),
    seo: Joi.object({
      metaTitle: Joi.string().max(255),
      metaDescription: Joi.string().max(500),
      metaKeywords: Joi.string(),
    }),
  }).min(1),
};
