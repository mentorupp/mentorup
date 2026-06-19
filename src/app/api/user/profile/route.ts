import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().optional(),
  area: z.string().optional(),
  course: z.string().optional(),
  university: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const data = schema.parse(await req.json());

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, area: true, course: true, university: true },
  });

  return NextResponse.json({ user });
}
