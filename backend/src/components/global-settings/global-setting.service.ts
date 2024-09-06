import { GlobalSetting, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { CreateGlobalSettingDto } from "./global-setting.validation";

@Service()
export class GlobalSettingService {
  private prisma = new PrismaClient();

  

  async getGlobalSettings(): Promise<GlobalSetting[]> {
    const globalSettings = await this.prisma.globalSetting.findMany();
    return globalSettings;
  }

  async createGlobalSetting(
    globalSettingData: CreateGlobalSettingDto
  ): Promise<GlobalSetting> {
    const newGlobalSetting = await this.prisma.globalSetting.create({
      data: globalSettingData,
    });
    return newGlobalSetting;
  }


  async getGlobalSettingById(
    globalSettingId: number
  ): Promise<GlobalSetting | null> {
    const globalSetting = await this.prisma.globalSetting.findUnique({
      where: { id: globalSettingId },
    });
    return globalSetting;
  }

  async updateGlobalSetting(
    globalSettingId: number,
    globalSettingData: CreateGlobalSettingDto
  ): Promise<GlobalSetting | null> {
    const updatedGlobalSetting = await this.prisma.globalSetting.update({
      where: { id: globalSettingId },
      data: globalSettingData,
    });
    return updatedGlobalSetting;
  }

  async deleteGlobalSetting(
    globalSettingId: number
  ): Promise<GlobalSetting | null> {
    const deletedGlobalSetting = await this.prisma.globalSetting.delete({
      where: { id: globalSettingId },
    });
    return deletedGlobalSetting;
  }
}
