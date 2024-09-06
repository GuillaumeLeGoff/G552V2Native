import { Macro } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { MacroService } from "./macro.service";
import { CreateMacroDto, UpdateMacroDto } from "./macro.validation";
import { UserType } from "../../types/user.type";


interface CustomRequest extends Request {
  user?: UserType;
}
@Service()
export class MacroController {
  constructor(@Inject(() => MacroService) private macroService: MacroService) {}

  createMacro = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const macroData: CreateMacroDto = req.body;
      const newMacro = await this.macroService.createMacro(macroData);
      res.status(201).json({ data: newMacro, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  findAllMacros = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const macros = await this.macroService.findAllMacros();
      res.status(200).json({ data: macros, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  findMacro = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const button_id= req.params.button_id;
      const user_id = req.user?.id;
      const macro = await this.macroService.findMacro(
        parseInt(button_id),
        user_id
      );
      res.status(200).json({ data: macro, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  updateMacro = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const button_id = req.params.button_id;
      const user_id = req.user?.id;
      const macroData: UpdateMacroDto = req.body;
      const updatedMacro = await this.macroService.updateMacro(
        parseInt(button_id),
        user_id,
        macroData
      );
      res.status(200).json({ data: updatedMacro, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  deleteMacro = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const button_id = req.params.button_id;
      const user_id = req.user?.id;
      await this.macroService.deleteMacro(
        parseInt(button_id),
        user_id
      );
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
