import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "../src/components/auth/auth.service"; // Assurez-vous que le chemin est correct
import { RegisterDto } from "../src/components/auth/auth.validation"; // Assurez-vous que le chemin est correct

const prisma = new PrismaClient();

async function main() {
  const existingButton = await prisma.button.findFirst();
  if (!existingButton) {
    const buttons = Array.from({ length: 16 }, (_, i) => ({
      name: `Button ${i + 1}`,
    }));

    if (buttons.length > 0) {
      await prisma.button.createMany({
        data: buttons,
      });
    }
  }

  const authService = new AuthService();

  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    const userData: RegisterDto = {
      username: "admin",
      password: "password",
    };

    const newUser = await authService.register(userData);

    // Création d'un dossier pour l'utilisateur
    const folderData = {
      name: "root",
      parent_id: null, // ou un ID de dossier parent si nécessaire
      path: "root",
    };

    await prisma.folder.create({
      data: {
        name: folderData.name,
        user_id: newUser.id, // Assurez-vous que newUser a un ID
        parent_id: folderData.parent_id,
        path: folderData.path,
      },
    });
  }

  const existingSession = await prisma.activeSession.findFirst();
  if (!existingSession) {
    const activeSessionData = {
      user_id: null,
      active_token: null,
    };
    await prisma.activeSession.create({
      data: activeSessionData,
    });
  }

  const existingGlobalSetting = await prisma.globalSetting.findFirst();
  if (!existingGlobalSetting) {
    const globalSettingData = {
      standby: false,
      standby_start_time: 0,
      standby_end_time: 0,
      restart_at: 0,
    };

    await prisma.globalSetting.create({
      data: globalSettingData,
    });
  }

  const modeData = {
    name: "default",
  };

  const existingMode = await prisma.mode.findFirst();
  if (!existingMode) {
    await prisma.mode.create({
      data: modeData,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
