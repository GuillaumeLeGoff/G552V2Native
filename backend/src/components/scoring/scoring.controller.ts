import { Scoring } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { ScoringService } from "./scoring.service";
import { CreateScoringDto, UpdateScoringDto } from "./scoring.validation";
import { UserType } from "../../types/user.type";

interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class ScoringController {
  constructor(
    @Inject(() => ScoringService) private scoringService: ScoringService
  ) {}

  createScoring = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const scoringData: CreateScoringDto = req.body;
      const newScoring = await this.scoringService.createScoring(scoringData, req.user);
      res.status(201).json({ data: newScoring, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  findAllScoring = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scoring = await this.scoringService.findAllScoring();
      res.status(200).json({ data: scoring, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  findScoring = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const scoring = await this.scoringService.findScoring(parseInt(id));
      res.status(200).json({ data: scoring, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  updateScoring = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const scoringData: UpdateScoringDto = req.body;
      const updatedScoring = await this.scoringService.updateScoring(
        parseInt(id),
        scoringData
      );
      res.status(200).json({ data: updatedScoring, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  deleteScoring = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.scoringService.deleteScoring(parseInt(id));
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
