import { CategoryController } from "../controllers/category.controller";
import { Router } from "express";

const router = Router();
const categoryController = new CategoryController();

router.post("/create", categoryController.createCategory.bind(categoryController));
router.get("/", categoryController.findAll.bind(categoryController));
router.put("/:id/update", categoryController.update.bind(categoryController));
router.delete("/:id/delete", categoryController.delete.bind(categoryController));

export default router;