import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { IUser, UserModel } from "../../core/models/User.model";
import { auth } from "../../config/firebase";
import { CustomError } from "../../api/middlewares/error.middleware";

export class AuthRepository {

    async validUid(uuid: string): Promise<boolean> {
        const exists = await UserModel.exists({ firebaseUid: uuid, isDeleted: false });
        return !!exists;
    }

    async verifyToken(token: string): Promise<DecodedIdToken> {
        try {
            return await auth.verifyIdToken(token);
        } catch (error) {
            throw new CustomError("Token inválido o expirado", 401);
        }
    }

    async getUserData(uuid: string): Promise<IUser | null> {
        const user = await UserModel.findOne(
            {
                firebaseUid: uuid,
                isDeleted: false
            },
            {
                createdAt: 0,
                updatedAt: 0
            }
        ).lean();
        return user;
    }
}