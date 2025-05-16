import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Rutas
router.post('/create', authenticateToken, userController.createUser.bind(userController));
router.get('/firebase/:uuid', authenticateToken, userController.getUserByFirebaseUUID.bind(userController));
router.get('/', authenticateToken, userController.getAllUsers.bind(userController));
router.put('/:uuid/update', authenticateToken, userController.updateUser.bind(userController));

router.get('/:id', authenticateToken, userController.getUserById.bind(userController));
router.delete('/:uuid/delete', authenticateToken, userController.deleteUser.bind(userController));

export default router; 