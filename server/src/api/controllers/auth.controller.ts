import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async.middleware";
import { CustomError } from "../middlewares/error.middleware";
import { AuthService } from "../../core/services/auth.service";


export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = asyncHandler(async (req: Request, res: Response) => {
        if (!req.body.accessToken) {
            throw new CustomError("Token not provided", 401)
        }
        const validToken = await this.authService.verifyToken(req.body.accessToken);
        if (!validToken) {
            throw new CustomError("Invalid token", 401)
        }
        const user = await this.authService.getUserData(validToken.uid);
        res.status(200).json(user);
    })

}