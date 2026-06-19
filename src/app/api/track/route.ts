import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  type: z.enum(["PAGE_VIEW", "BILLING_VIEW", "PLAN_INTEREST"]),
  path: z.string().optional(),
  label: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = schema.parse(await req.json());

    await logActivity(body.type, {
      userId: session?.user?.id,
      path: body.path,
      label: body.label,
      meta: body.meta as Prisma.InputJsonValue | undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
