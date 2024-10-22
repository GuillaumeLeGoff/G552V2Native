import { PrismaClient, Macro } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import { UpdateMacroDto } from "./macro.validation";

const prisma = new PrismaClient();

@Service()
export class MacroService {
  public async createMacro(macroData: Macro): Promise<Macro> {
    const macro = await prisma.macro.findUnique({
      where: {
        button_id_user_id: {
          user_id: macroData.user_id,
          button_id: macroData.button_id,
           
        },
      },
    });

    if (macro) {
      throw new HttpException(
        404,
        `Macro for playlist with ID ${macroData.playlist_id} and button with ID ${macroData.button_id} already exists.`
      );
    }

    return prisma.macro.create({
      data: {
        ...macroData,
      },
    });
  }

  public async findAllMacros(): Promise<Macro[]> {
    return prisma.macro.findMany({});
  }

  public async findMacro(button_id: number, user_id: number): Promise<Macro> {
    const macro = await prisma.macro.findUnique({
      where: {
        button_id_user_id: {
          user_id: user_id,
          button_id: button_id,
        },
      },
    });

    if (!macro) {
      throw new HttpException(
        404,
        `Macro with user ID ${user_id} and button ID ${button_id} doesn't exist.`
      );
    }

    return macro;
  }

  public async updateMacro(
    buttonId: number,
    userId: number,
    macroData: UpdateMacroDto
  ): Promise<Macro> {
    console.log(macroData);
    console.log(buttonId);
    console.log(userId);
    

    

    return prisma.macro.update({
      where: {
        button_id_user_id: {
          user_id: userId,
          button_id: buttonId,
        },
      },
      data: {
        playlist_id: macroData.playlistId,
      },
    });
  }

  public async deleteMacro(button_id: number, user_id: number): Promise<Macro> {
    return prisma.macro.delete({
      where: {
        button_id_user_id: {
          user_id: user_id,
          button_id: button_id,
        },
      },
    });
  }
}
