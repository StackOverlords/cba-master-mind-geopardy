import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { IUser } from '../models/User.model';
import { IPermission } from '../models/Permisson.model';
import { CustomError } from '../../api/middlewares/error.middleware';
import { UserFilter } from '../interfaces/user.filter.interface';
import { PermissionRepository } from '../../infrastructure/repositories/permission.repository';

export class UserService {
  private userRepository: UserRepository;
  private permissionRepository: PermissionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.permissionRepository = new PermissionRepository();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      return existingUser;
    }
    const permissions = await this.permissionRepository.findAll({ limit: -1 });
    if (permissions.data.length > 0) {
      userData.permissions = permissions.data.map((permission: IPermission) => permission._id);
    } else {
      userData.permissions = [];
    }
    console.log(permissions);
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

  async getAllUsers({ firebaseUid, name, role, page, limit, sort }: Partial<UserFilter>): Promise<any> {
    return await this.userRepository.findAll({ firebaseUid, name, role, page, limit, sort });
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