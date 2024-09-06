import { PrismaClient, Button } from "@prisma/client";
import { Service } from "typedi";
import { CreateButtonDto } from "./button.validation";

const prisma = new PrismaClient();

@Service()
export class ButtonService {
  async initializeButtons(): Promise<void> {
    const buttons = await prisma.button.findMany();
    if (buttons.length === 0) {
      for (let i = 1; i <= 15; i++) {
        await prisma.button.create({
          data: { name: `Button ${i}` },
        });
      }
    }
  }
  async getAllButtons(): Promise<Button[]> {
    const buttons = await prisma.button.findMany();
    return buttons;
  }

  async getButtonById(id: number): Promise<Button | null> {
    const button = await prisma.button.findUnique({
      where: { id },
    });
    return button;
  }

  async createButton(buttonData: CreateButtonDto): Promise<Button> {
    const button = await prisma.button.create({
      data: {
        name: buttonData.name,
      },
    });
    return button;
  }

  async updateButton(
    id: number,
    buttonData: CreateButtonDto
  ): Promise<Button | null> {
    const button = await prisma.button.update({
      where: { id },
      data: {
        name: buttonData.name,
      },
    });
    return button;
  }

  async deleteButton(id: number): Promise<Button | null> {
    const button = await prisma.button.delete({
      where: { id },
    });
    return button;
  }
}
