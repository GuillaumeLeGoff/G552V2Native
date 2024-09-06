import { HttpException } from "../exceptions/HttpException";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const getAuthorization = (req) => {
  const header = req.header("Authorization");

  if (header) {
    return header.split(" ")[1];
  }

  return null;
};

export const authMiddleware = async (req, res, next) => {
  const token = getAuthorization(req);

  if (!token) {
    return next(
      new HttpException(
        401,
        "Accès refusé. Aucun jeton d'authentification fourni."
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    

    const session = await prisma.activeSession.findUnique({
      where: {
        id: 1,
        active_token: token,
      },
    });

    if (!session) {
      return next(new HttpException(403, "Jeton d'authentification invalide."));
    }

    // Vérifier si le jeton a expiré et le mettre à jour si nécessaire
    const currentTime = Date.now() / 1000; // Temps actuel en secondes
    if (decoded.exp < currentTime) {
      // Le jeton a expiré, générer un nouveau jeton avec une durée de validité de 1 heure
      const newToken = jwt.sign(
        { user: decoded.user, sessionId: decoded.sessionId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      req.header("x-auth-token", newToken); // Mettre à jour le jeton dans l'en-tête de la requête
    }

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, "Jeton d'authentification expiré."));
    }
    throw new HttpException(400, "Jeton d'authentification invalide.");
  }
};
