import { Request, Response, NextFunction } from "express";
import { CustomError } from "./error.middleware";
import { auth } from "../../config/firebase";

interface RequestExtend extends Request {
    user?: { uid: string;[key: string]: any }
}

export async function authenticateToken(req: RequestExtend, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req?.body?.accessToken;
    if (!token) {
        throw new CustomError("Token not provided", 401);
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next();
    } catch (error) {
        console.log(error);
        throw new CustomError("Invalid token", 403);
    }
}
 