import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";
import { AppError } from "../../utils/error.util";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
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

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.findAll(req.query);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

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

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await this.productService.delete(req.params.id);

      if (!success) {
        throw new AppError("Product not found", 404);
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  bulkDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const deletedCount = await this.productService.bulkDelete(ids);

      res.status(200).json({
        success: true,
        message: `${deletedCount} products deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.productService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
