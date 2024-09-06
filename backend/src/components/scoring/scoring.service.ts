import { PrismaClient, Scoring } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import { UserType } from "../../types/user.type";
import { CreateScoringDto, UpdateScoringDto } from "./scoring.validation";

const prisma = new PrismaClient();

@Service()
export class ScoringService {
  public async createScoring(scoringData: CreateScoringDto, user: UserType): Promise<Scoring> {
    return prisma.scoring.create({
      data: {
        ...scoringData,
        user_id: user.id,
      },
    });
  }

  public async findAllScoring(): Promise<Scoring[]> {
    return prisma.scoring.findMany({});
  }

  public async findScoring(id: number): Promise<Scoring> {
    const scoring = await prisma.scoring.findUnique({
      where: {
        id: id,
      },
    });

    if (!scoring) {
      throw new HttpException(404, `Scoring with ID ${id} doesn't exist.`);
    }

    return scoring;
  }

  public async updateScoring(
    id: number,
    scoringData: UpdateScoringDto
  ): Promise<Scoring> {
    const scoring = await prisma.scoring.findUnique({
      where: {
        id: id,
      },
    });

    if (!scoring) {
      throw new HttpException(404, `Scoring with ID ${id} doesn't exist.`);
    }

    return prisma.scoring.update({
      where: {
        id: id,
      },
      data: {
        ...scoringData,
      },
    });
  }

  public async deleteScoring(id: number): Promise<Scoring> {
    return prisma.scoring.delete({
      where: {
        id: id,
      },
    });
  }
}
