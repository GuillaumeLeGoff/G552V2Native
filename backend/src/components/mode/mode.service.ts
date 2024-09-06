import { PrismaClient, Mode, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { CreateModeDto, UpdateModeDto } from "./mode.validation";

const prisma = new PrismaClient();

@Service()
export class ModeService {
  public async createMode(modeData: CreateModeDto): Promise<Mode> {
    return prisma.mode.create({
      data: modeData,
    });
  }

  public async findModeById(modeId: number): Promise<Mode | null> {
    return prisma.mode.findUnique({
      where: { id: modeId },
    });
  }

  public async findModes(): Promise<Mode[]> {
    return prisma.mode.findMany({});
  }

  public async updateMode(
    modeId: number,
    modeData: UpdateModeDto
  ): Promise<Mode> {
    return prisma.mode.update({
      where: { id: modeId },
      data: modeData as Prisma.ModeUpdateInput,
    });
  }

  public async deleteMode(modeId: number): Promise<Mode> {
    return prisma.mode.delete({
      where: { id: modeId },
    });
  }
}
