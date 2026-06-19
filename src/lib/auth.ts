import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { Provider } from "next-auth/providers";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import { PLAN_CREDITS } from "./tools-config";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "E-mail", type: "email" },
      password: { label: "Senha", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email as string },
      });

      if (!user?.password) return null;

      const valid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) token.id = user.id!;

      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              credits: true,
              plan: true,
              area: true,
              course: true,
              name: true,
            },
          });
          if (dbUser) {
            token.credits = dbUser.credits;
            token.plan = dbUser.plan;
            token.area = dbUser.area;
            token.course = dbUser.course;
            token.name = dbUser.name;
          }
        } catch {
          /* DB not connected */
        }
      }

      if (trigger === "update" && session) {
        token.credits = session.credits;
        token.plan = session.plan;
        token.area = session.area;
        token.course = session.course;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.credits = (token.credits as number) ?? 15;
        session.user.plan = (token.plan as string) ?? "FREE";
        session.user.area = (token.area as string | null) ?? null;
        session.user.course = (token.course as string | null) ?? null;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: PLAN_CREDITS.FREE },
          });
        } catch {
          /* ignore */
        }
      }
    },
  },
});
