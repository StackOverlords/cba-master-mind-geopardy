import { UserModel, IUser } from '../../core/models/User.model';

export class UserRepository {
  
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async findByFirebaseUUID(uuid: string): Promise<IUser | null> {
    return await UserModel.findOne({
      firebaseUid: uuid,
    });
  }

  async findAll(): Promise<IUser[]> {
    return await UserModel.find();
  }

  async update(uuid: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findOneAndUpdate({ firebaseUid: uuid }, userData, { new: true });
  }

  async delete(uuid: string): Promise<IUser | null> {
    return await UserModel.findOneAndUpdate({ firebaseUid: uuid }, {
      isDeleted: true
    }, {
      new: true
    });
  }
} 