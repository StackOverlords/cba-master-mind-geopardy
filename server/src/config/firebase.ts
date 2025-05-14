import admin from "firebase-admin";
import { CustomError } from "../api/middlewares/error.middleware";

if (
  !process.env.FB_ADMIN_PROJECT_ID ||
  !process.env.FB_ADMIN_CLIENT_EMAIL ||
  !process.env.FB_ADMIN_PRIVATE_KEY
) {
  throw new CustomError("❌ Configuración de Firebase Admin incompleta en variables de entorno", 500);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_ADMIN_PROJECT_ID,
      clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  console.log("✅ Firebase Admin configurado correctamente (vía env vars)");
} catch (error) {
  console.error("❌ Error al configurar Firebase Admin:", error);
  process.exit(1);
}

export const auth = admin.auth();