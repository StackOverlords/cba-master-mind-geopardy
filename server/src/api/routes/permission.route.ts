import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/permission.middleware";


const router = Router();
const permissionController = new PermissionController();


router.post("/create", authenticateToken, checkPermission('create'), permissionController.create.bind(permissionController));
router.get("/", authenticateToken, checkPermission('retrieve'), permissionController.findAll.bind(permissionController));
router.put("/:id/update", authenticateToken, checkPermission('update'), permissionController.update.bind(permissionController));
router.delete("/:id/delete", authenticateToken, checkPermission('delete'), permissionController.delete.bind(permissionController));

export default router;