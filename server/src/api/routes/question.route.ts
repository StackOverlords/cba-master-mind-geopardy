import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

const router = Router();
const questionController = new QuestionController();

router.post("/create", questionController.createQuestion.bind(questionController));
router.get("/", questionController.findAll.bind(questionController));
router.get("/:id", questionController.findById.bind(questionController));
router.put("/:id/update", questionController.update.bind(questionController));
router.delete("/:id/delete", questionController.delete.bind(questionController));

export default router;