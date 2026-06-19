import type { Role } from "@prisma/client";
import { auth } from "./auth";

export const ADMIN_EMAILS = [
  "icloud.jonalves@gmail.com",
  ...(process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? []),
].filter(Boolean);

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isAdminRole(role?: string | null) {
  return role === "ADMIN";
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || !isAdminRole(session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export function roleLabel(role: Role) {
  return role === "ADMIN" ? "Admin" : "Usuário";
}
