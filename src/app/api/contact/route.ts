import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  course: z.string().min(2),
  service: z.string().min(1),
  deadline: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = schema.parse(await req.json());

    const lead = await prisma.contactLead.create({
      data: {
        userId: session?.user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        course: data.course,
        service: data.service,
        deadline: data.deadline ? new Date(data.deadline) : null,
        message: data.message,
      },
    });

    await logActivity("CONTACT_SUBMIT", {
      userId: session?.user?.id,
      label: data.service,
      meta: { email: data.email, course: data.course, leadId: lead.id },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Erro ao enviar" }, { status: 500 });
  }
}
