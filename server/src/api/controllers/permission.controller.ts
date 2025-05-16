import { PermissionService } from "../../core/services/permission.service";
import { asyncHandler } from "../middlewares/async.middleware";
import { Request, Response } from "express";


export class PermissionController {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    create = asyncHandler(async (req: Request, res: Response) => {
        const permission = await this.permissionService.create(req.body);
        res.status(201).json(permission);
    })

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const permissions = await this.permissionService.findAll(req.query);
        res.status(200).json(permissions);
    })

    update = asyncHandler(async (req: Request, res: Response) => {
        const permission = await this.permissionService.update(req.params.id, req.body)
        res.status(200).json(permission);
    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        await this.permissionService.delete(req.params.id);
        res.status(200).json({ message: "Permission deleted successfully" })
    })
}