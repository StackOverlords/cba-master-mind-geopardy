import { CategoryController } from "../controllers/category.controller";
import { Router } from "express";
import { checkPermission } from "../middlewares/permission.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const categoryController = new CategoryController();

router.post("/create", authenticateToken, checkPermission('create'), categoryController.createCategory.bind(categoryController));
router.get("/", authenticateToken, checkPermission('retrieve'), categoryController.findAll.bind(categoryController));
router.put("/:id/update", authenticateToken, checkPermission('update'), categoryController.update.bind(categoryController));
router.delete("/:id/delete", authenticateToken, checkPermission('delete'), categoryController.delete.bind(categoryController));

export default router;