import { PrismaClient } from "@prisma/client";

async function GenerateSeed() {
  const prisma = new PrismaClient();

  await prisma.plan.createMany({
    data: [
      {
        name: "Gratuito",
        description: ["Maneja 1 negocio sin limites"],
        price: 0,
        code: "free",
        position: 1,
      },
      {
        name: "Mensual",
        description: [
          "Suscripcion mensual! Maneja varios negocios sin limites!",
        ],
        price: 100,
        code: "licence",
        position: 2,
      },
    ],
  });
}

GenerateSeed();
