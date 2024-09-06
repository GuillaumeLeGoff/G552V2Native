import { Button } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { ButtonService } from "./button.service";
import { CreateButtonDto } from "./button.validation";

@Service()
export class ButtonController {
  constructor(
    @Inject(() => ButtonService) private buttonService: ButtonService
  ) {}

  createButton = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buttonData: CreateButtonDto = req.body;

      const newButton: Button = await this.buttonService.createButton(
        buttonData
      );
      res.status(201).json({ data: newButton, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  getButtonById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buttonId: number = parseInt(req.params.buttonId);
      const button: Button | null = await this.buttonService.getButtonById(
        buttonId
      );
      if (!button) {
        res.status(404).json({ message: "Button not found" });
      } else {
        res.status(200).json({ data: button, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllButtons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buttons: Button[] = await this.buttonService.getAllButtons();
      res.status(200).json({ data: buttons, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  updateButton = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buttonId: number = parseInt(req.params.buttonId);
      const buttonData: CreateButtonDto = req.body;
      const updatedButton: Button | null =
        await this.buttonService.updateButton(buttonId, buttonData);
      if (!updatedButton) {
        res.status(404).json({ message: "Button not found" });
      } else {
        res.status(200).json({ data: updatedButton, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteButton = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buttonId: number = parseInt(req.params.buttonId);
      const deletedButton: Button | null =
        await this.buttonService.deleteButton(buttonId);
      if (!deletedButton) {
        res.status(404).json({ message: "Button not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
