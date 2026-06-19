import { PrismaClient } from "@prisma/client";

const email = process.argv[2] ?? "icloud.jonalves@gmail.com";
const prisma = new PrismaClient();

try {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(`✓ ${user.email} agora é ADMIN (role: ${user.role})`);
} catch (e) {
  if (e.code === "P2025") {
    console.error(`Usuário não encontrado: ${email}`);
    console.error("Cadastre-se primeiro em /register, depois rode este script.");
  } else {
    throw e;
  }
} finally {
  await prisma.$disconnect();
}
