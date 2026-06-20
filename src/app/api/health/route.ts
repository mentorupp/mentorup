import { NextResponse } from "next/server";
import { isOpenAIConfigured } from "@/lib/ai";
import { getAuthSecret, getAuthUrl } from "@/lib/auth-secret";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: Boolean(getAuthSecret() && process.env.DATABASE_URL),
    authSecretSet: Boolean(getAuthSecret()),
    databaseUrlSet: Boolean(process.env.DATABASE_URL),
    openaiConfigured: isOpenAIConfigured(),
    authUrl: getAuthUrl() ?? null,
    vercelUrl: process.env.VERCEL_URL ?? null,
  });
}
