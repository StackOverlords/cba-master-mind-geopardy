import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/permission.middleware";

const router = Router();
const questionController = new QuestionController();

router.post("/create", authenticateToken, checkPermission("create"), questionController.createQuestion.bind(questionController));
router.get("/", authenticateToken, checkPermission("retrieve"), questionController.findAll.bind(questionController));
router.get("/:id", authenticateToken, checkPermission("retrieve"), questionController.findById.bind(questionController));
router.put("/:id/update", authenticateToken, checkPermission("update"), questionController.update.bind(questionController));
router.delete("/:id/delete", authenticateToken, checkPermission("delete"), questionController.delete.bind(questionController));

export default router;