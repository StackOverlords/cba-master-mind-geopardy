import { Router } from 'express';
import { GameController } from '../controllers/game.controller';

const router = Router();
const gameController = new GameController();

router.post("/create", gameController.createGame.bind(gameController));

router.post("/answer", gameController.answerQuestion.bind(gameController));


router.get("/", gameController.findAll.bind(gameController));
router.get("findById", gameController.getById.bind(gameController));
router.put("/:id/update", gameController.updateGame.bind(gameController));
router.delete("/:id/delete", gameController.deleteGame.bind(gameController));

export default router;