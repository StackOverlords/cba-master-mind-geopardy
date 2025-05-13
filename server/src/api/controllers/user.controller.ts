import { Request, Response } from 'express';
import { UserService } from '../../core/services/user.service';
import { asyncHandler } from '../middlewares/async.middleware';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    res.status(200).json(user);
  });

  getUserByFirebaseUUID = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserByFirebaseUUID(req.params.uuid);
    res.status(200).json(user);
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.status(200).json(users);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.updateUser(req.params.uuid, req.body);
    res.status(200).json(user);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.deleteUser(req.params.uuid);
    res.status(200).json({message:"User deleted successfully"});
  });
} 