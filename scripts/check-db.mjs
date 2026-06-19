import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log("Tabelas no Neon:");
  for (const t of tables) console.log(" -", t.table_name);

  const users = await prisma.user.count();
  console.log("\nUsuarios cadastrados:", users);
} finally {
  await prisma.$disconnect();
}
