import { PrismaClient, User } from "@prisma/client";
import { Service } from "typedi";
import bcrypt from "bcrypt";
import { HttpException } from "../../exceptions/HttpException"; // Make sure the import path is correct
const prisma = new PrismaClient();
@Service()
export class UserService {
  public async createUser(userData: User): Promise<User> {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (existingUser) {
      throw new HttpException(
        409,
        `Username ${userData.username} already exists.`
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        first_login: true,
      },
    });
  }

  public async findUserById(userId: number): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(404, `User with ID ${userId} doesn't exist.`);
    }

    return user;
  }

  public async findUsers(): Promise<User[]> {
    return prisma.user.findMany({});
  }

  public async updateUser(
    userId: number,
    userData: Partial<User>
  ): Promise<User> {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!findUser) {
      throw new HttpException(404, `User with ID ${userId} doesn't exist.`);
    }

    if (userData.username && userData.username !== findUser.username) {
      const findUsername = await prisma.user.findUnique({
        where: { username: userData.username },
      });
      if (findUsername) {
        throw new HttpException(
          409,
          `Username ${userData.username} already exists.`
        );
      }
    }

    let updateData = userData;
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updateData = { ...userData, password: hashedPassword };
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
  public async deleteUser(userId: number): Promise<User> {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!findUser) {
      throw new HttpException(404, `User with ID ${userId} doesn't exist.`);
    }

    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
