import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validation.middleware";
import { productValidation } from "./product.validation";

const router = Router();
const productController = new ProductController();

router.use(authMiddleware);

// Place specific routes BEFORE parametric routes
router.get("/stats", productController.getStats);
router.post("/bulk-delete", productController.bulkDelete);

// Parametric routes AFTER specific routes
router.get("/", productController.getAll);
router.get("/:id", productController.getById);

router.post(
  "/",
  validateRequest(productValidation.create),
  productController.create
);

router.put(
  "/:id",
  validateRequest(productValidation.update),
  productController.update
);

router.delete("/:id", productController.delete);

export default router;
