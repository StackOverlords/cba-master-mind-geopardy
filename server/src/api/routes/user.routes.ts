import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// Rutas
router.post('/create', userController.createUser.bind(userController)); // swagger true
router.get('/firebase/:uuid', userController.getUserByFirebaseUUID.bind(userController)); // swagger true
router.get('/', userController.getAllUsers.bind(userController)); // swagger true
router.put('/:uuid/update', userController.updateUser.bind(userController)); // swagger true

router.get('/:id', userController.getUserById.bind(userController));
router.delete('/:uuid/delete', userController.deleteUser.bind(userController));

export default router; 