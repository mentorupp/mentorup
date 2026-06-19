import type { NextAuthConfig } from "next-auth";
import { getAuthSecret, getAuthUrl } from "./auth-secret";

/**
 * Config leve para Edge Middleware (sem Prisma/bcrypt).
 * Providers reais ficam em auth.ts
 */
export const authConfig = {
  secret: getAuthSecret(),
  ...(getAuthUrl() ? { url: getAuthUrl() } : {}),
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    error: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isDashboard && !isLoggedIn) return false;
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
