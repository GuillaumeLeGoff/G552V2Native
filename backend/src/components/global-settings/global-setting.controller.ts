import { GlobalSetting } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { GlobalSettingService } from "./global-setting.service";
import { CreateGlobalSettingDto } from "./global-setting.validation";
import { log } from "console";

@Service()
export class GlobalSettingController {
  constructor(
    @Inject(() => GlobalSettingService)
    private globalSettingService: GlobalSettingService
  ) {}

  getGlobalSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const globalSettings: GlobalSetting[] =
        await this.globalSettingService.getGlobalSettings();
      res.status(200).json({ data: globalSettings, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  createGlobalSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const globalSettingData: CreateGlobalSettingDto = req.body;
      log
      const newGlobalSetting: GlobalSetting =
        await this.globalSettingService.createGlobalSetting(globalSettingData);
      res.status(201).json({ data: newGlobalSetting, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  getGlobalSettingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const globalSettingId: number = parseInt(req.params.globalSettingId);
      const globalSetting: GlobalSetting | null =
        await this.globalSettingService.getGlobalSettingById(globalSettingId);
      if (!globalSetting) {
        res.status(404).json({ message: "Global setting not found" });
      } else {
        res.status(200).json({ data: globalSetting, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateGlobalSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const globalSettingId: number = parseInt(req.params.globalSettingId);
      const globalSettingData: CreateGlobalSettingDto = req.body;
      const updatedGlobalSetting: GlobalSetting | null =
        await this.globalSettingService.updateGlobalSetting(
          globalSettingId,
          globalSettingData
        );
      if (!updatedGlobalSetting) {
        res.status(404).json({ message: "Global setting not found" });
      } else {
        res
          .status(200)
          .json({ data: updatedGlobalSetting, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteGlobalSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const globalSettingId: number = parseInt(req.params.globalSettingId);
      const deletedGlobalSetting: GlobalSetting | null =
        await this.globalSettingService.deleteGlobalSetting(globalSettingId);
      if (!deletedGlobalSetting) {
        res.status(404).json({ message: "Global setting not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
