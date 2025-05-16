import { Router } from 'express';
import user from './user.routes';
import game from './game.route';
import question from './question.route';
import category from './category.route';
import auth from './auth.route';
import permission from './permission.route';
const router = Router();

router.use('/users', user);
router.use('/game', game);
router.use('/question', question);
router.use('/category', category);
router.use('/auth', auth);
router.use('/permission', permission);

export default router;