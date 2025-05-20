import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/permission.middleware";

import { uploadExcel } from "../middlewares/upload.middleware";

const router = Router();
const questionController = new QuestionController();

router.post("/create", authenticateToken, checkPermission("create"), questionController.createQuestion.bind(questionController));
router.get("/", authenticateToken, checkPermission("retrieve"), questionController.findAll.bind(questionController));
router.get("/:id", authenticateToken, checkPermission("retrieve"), questionController.findById.bind(questionController));
router.put("/:id/update", authenticateToken, checkPermission("update"), questionController.update.bind(questionController));
router.delete("/:id/delete", authenticateToken, checkPermission("delete"), questionController.delete.bind(questionController));

router.post(
    "/import-excel", 
    authenticateToken,
    checkPermission("create"),
    uploadExcel.single("file"), // El nombre "file" debe coincidir con el campo del formulario
    questionController.importExcelQuestions.bind(questionController)
);
// router.post("/createMany/exel",authenticateToken, checkPermission("create"), questionController.createManyQuestions.bind(questionController));
export default router;