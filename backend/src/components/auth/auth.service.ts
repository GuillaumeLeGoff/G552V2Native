import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { Service } from "typedi";
import { RegisterDto, LoginUserDto } from "./auth.validation";
import { HttpException } from "../../exceptions/HttpException";

const prisma = new PrismaClient();

@Service()
export class AuthService {
  async register(userData: RegisterDto): Promise<User> {
    const findUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });
    if (findUser) {
      throw new HttpException(
        409,
        `This username ${userData.username} already exists`
      );
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        first_login: true,
        username: userData.username,
        password: hashedPassword,
      },
    });

    for (let i = 1; i <= 15; i++) {
      await prisma.macro.create({
        data: {
          user_id: user.id,
          button_id: i,
          playlist_id: null,
        },
      });
    }

    await prisma.scoring.create({
      data: {
        user_id: user.id,
        timer: 0,
        score_team1: 0,
        score_team2: 0,
        faute_team1: 0,
        faute_team2: 0,
        nom_team1: "",
        nom_team2: "",
        option1: 0,
        option2: 0,
        option3: 0,
        option4: 0,
        option5: 0,
      },
    });

    const uploadDir = path.resolve(
      __dirname,
      process.env.UPLOAD_DIR,
      user.username
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return user;
  }

  async login(credentials: LoginUserDto): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { username: credentials.username },
      include: { activeSessions: true },
    });

    if (!user) {
      throw new HttpException(401, "Incorrect username or password");
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException(401, "Incorrect username or password");
    }
    let activeSession = await prisma.activeSession.findFirst({
      where: { id: 1 },
    });
    const active_token_verify = jwt.verify(
      activeSession.active_token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return false;
        } else {
          return decoded;
        }
      }
    );

    if (active_token_verify.exp < Date.now()) {
      throw new HttpException(409, `User already logged `, {
        username: active_token_verify.username,
      });
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      await prisma.activeSession.update({
        where: { id: 1 },
        data: { active_token: token, user: { connect: { id: user.id } } },
      });
      return token;
    }
  }

  async logout(): Promise<void> {
    await prisma.activeSession.update({
      where: { id: 1 },
      data: { active_token: null, user_id: null },
    });
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidPassword) {
      throw new HttpException(401, "Incorrect old password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
