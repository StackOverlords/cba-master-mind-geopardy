import { UserFilter } from '../../core/interfaces/user.filter.interface';
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

  async findAll({ firebaseUid, name, role, page = 1, limit = 10, sort = 'desc' }: Partial<UserFilter>): Promise<any> {
    const pageNumber = Math.max(1, parseInt(page as any) || 1);
    const limitNumber = Math.max(1, parseInt(limit as any) || 10);

    const isUnlimited = limitNumber === -1;

    const filter: Record<string, any> = { isDeleted: false };

    if (firebaseUid) filter.firebaseUid = firebaseUid;
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (role) filter.role = { $regex: role, $options: 'i' };

    const dataPipeline: any[] = [
      { $sort: { createdAt: sort === 'desc' ? -1 : 1 } },
    ]

    if (!isUnlimited) {
      dataPipeline.push(
        { $skip: (pageNumber - 1) * limitNumber },
        { $limit: limitNumber }
      )
    }
    const query = [
      {
        $match: filter
      },
      {
        $facet: {
          data: dataPipeline,
          totalCount: [
            { $count: 'count' }
          ]
        }
      },
      {
        $project: {
          data: 1,
          totalCount: { $arrayElemAt: ['$totalCount.count', 0] }
        }
      }
    ];

    const [result] = await UserModel.aggregate(query);

    const totalCount = result.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limitNumber);

    return {
      page: pageNumber,
      limit: limitNumber,
      sort,
      totalPages,
      totalCount,
      data: result.data
    };
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