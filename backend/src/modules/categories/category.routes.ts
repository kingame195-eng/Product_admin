import { Router } from "express";
import { Category } from "./category.model";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.use(authMiddleware);

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
