import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { AuthRepository } from "../../infrastructure/repositories/auth.repository";
import { IUser } from "../models/User.model";

export class AuthService {
    private authRepository: AuthRepository;
    constructor() {
        this.authRepository = new AuthRepository();
    }

    async validUid(uuid: string): Promise<boolean | null> {
        return await this.authRepository.validUid(uuid);
    }

    async verifyToken(token: string): Promise<DecodedIdToken> {
        return await this.authRepository.verifyToken(token);
    }

    async getUserData(uuid: string): Promise<IUser | null> {
        return await this.authRepository.getUserData(uuid);
    }
}