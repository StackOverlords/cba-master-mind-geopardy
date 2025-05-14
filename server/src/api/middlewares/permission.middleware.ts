import { Request, Response, NextFunction, RequestHandler } from "express";
import { CustomError } from "./error.middleware";
import { UserModel } from "../../core/models/User.model";

type PermissionCode = "category.create" | "category.update" | "category.delete"; // Añade todos los permisos necesarios

interface AuthenticatedRequest extends Request {
    user?: { uid: string;[key: string]: any };
}

export const checkPermission = (requiredPermissionCode: PermissionCode) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        const uid = req.user?.uid;
        console.log(
            uid, "Estoy en mi middleware de permissions"
        )
        console.log(
            requiredPermissionCode, "Estoy validando los permisos"
        )
        if (!uid) {
            throw new CustomError("Auth error: UID missing", 401);
        }

        try {
            const user = await UserModel.findOne(
                { firebaseUid: uid },
                { permissions: 1, role: 1, _id: 0 }
            ).populate<{ permissions: { code: string }[] }>("permissions").lean();

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (!user?.permissions) {
                throw new CustomError("Insufficient permissions", 403);
            }
            if (user.role === "admin") return next();
            
            if (!user.permissions.some(p => p.code === requiredPermissionCode)) {
                return res.status(403).json({
                    error: `Requires permission: ${requiredPermissionCode}`,
                    requiredPermission: requiredPermissionCode
                });
            }

            next();
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) throw error;
            throw new CustomError("Permission validation failed", 500);
        }
    };
};