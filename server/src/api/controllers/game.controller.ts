import { Request, Response } from "express";
import { GameService } from "../../core/services/game.service";
import { asyncHandler } from "../middlewares/async.middleware";

export class GameController {
    private gameService: GameService;

    constructor() {
        this.gameService = new GameService();
    }

    createGame = asyncHandler(async (req: Request, res: Response) => {
        const game = await this.gameService.createGame(req.body);
        res.status(201).json(game);
    })

    findAll = asyncHandler(async (req: Request, res: Response) => {
        const games = await this.gameService.findAll();
        res.status(201).json(games);
    })
    getById = asyncHandler(async (req: Request, res: Response) => {
        const game = await this.gameService.findById(req.params.id);
        res.status(201).json(game);
    })

    updateGame = asyncHandler(async (req: Request, res: Response) => {
        const game = await this.gameService.updateGame(req.params.id, req.body);
        res.status(201).json(game);
    })

    deleteGame = asyncHandler(async (req: Request, res: Response) => {
        await this.gameService.deleteGame(req.params.id);
        res.status(201).json({message:"Game deleted successfully"});
    })
}