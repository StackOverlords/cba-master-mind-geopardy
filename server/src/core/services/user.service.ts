import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { IUser } from '../models/User.model';
import { CustomError } from '../../api/middlewares/error.middleware';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      return existingUser;
    }
    return await this.userRepository.create(userData);
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  async getUserByFirebaseUUID(uuid: string): Promise<IUser | null> {
    const user = await this.userRepository.findByFirebaseUUID(uuid);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(uuid: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await this.userRepository.findByFirebaseUUID(uuid);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return await this.userRepository.update(uuid, userData);
  }

  async deleteUser(uuid: string): Promise<IUser | null> {
    const user = await this.userRepository.findByFirebaseUUID(uuid);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return await this.userRepository.delete(uuid);
  }
} 