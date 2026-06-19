/**
 * Configura o banco Neon: valida conexão e cria tabelas via Prisma.
 * Uso: node scripts/setup-db.mjs
 * Requer DATABASE_URL no arquivo .env
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");

if (!existsSync(envPath)) {
  console.error("❌ Arquivo .env não encontrado.");
  console.error("   Copie .env.example para .env e cole a connection string do Neon.");
  process.exit(1);
}

const env = readFileSync(envPath, "utf8");
const dbMatch = env.match(/^DATABASE_URL=(.+)$/m);

if (!dbMatch || dbMatch[1].includes("COLE") || dbMatch[1].includes("password@ep-xxx")) {
  console.error("❌ DATABASE_URL não configurada no .env");
  console.error("   No Neon: clique em 'Mostrar senha' → copie a connection string completa");
  process.exit(1);
}

console.log("🔄 Conectando ao Neon e criando tabelas...\n");

try {
  execSync("npx prisma db push", { cwd: root, stdio: "inherit", env: process.env });
  console.log("\n✅ Banco conectado! Tabelas criadas com sucesso.");
  console.log("   Agora faça deploy na Vercel com as mesmas variáveis do .env");
} catch {
  console.error("\n❌ Falha ao conectar. Verifique a DATABASE_URL no .env");
  process.exit(1);
}
