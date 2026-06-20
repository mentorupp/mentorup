import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity";
import { isAdminEmail } from "@/lib/admin";
import {
  normalizeCpf,
  normalizePhone,
  validateCpf,
  validatePhone,
} from "@/lib/br-validation";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/tools-config";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().min(11),
  phone: z.string().min(10),
  area: z.string().optional(),
  course: z.string().optional(),
  university: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const cpf = normalizeCpf(data.cpf);
    const phone = normalizePhone(data.phone);

    if (!validateCpf(cpf)) {
      return NextResponse.json({ error: "CPF inválido." }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "Telefone inválido. Use DDD + número (10 ou 11 dígitos)." },
        { status: 400 }
      );
    }

    const [emailExists, cpfExists, phoneExists] = await Promise.all([
      prisma.user.findUnique({ where: { email: data.email } }),
      prisma.user.findUnique({ where: { cpf } }),
      prisma.user.findUnique({ where: { phone } }),
    ]);

    if (emailExists) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }

    if (cpfExists) {
      return NextResponse.json(
        { error: "CPF já vinculado a uma conta. Uma conta por pessoa." },
        { status: 400 }
      );
    }

    if (phoneExists) {
      return NextResponse.json(
        { error: "Telefone já cadastrado em outra conta." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const admin = isAdminEmail(data.email);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        cpf,
        phone,
        password: hashed,
        area: data.area,
        course: data.course,
        university: data.university,
        credits: PLAN_CREDITS.FREE,
        role: admin ? "ADMIN" : "USER",
      },
      select: { id: true, email: true, name: true },
    });

    await logActivity("REGISTER", {
      userId: user.id,
      label: user.email,
      meta: { course: data.course, university: data.university },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios corretamente." },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar conta. Verifique se o banco de dados está conectado." },
      { status: 500 }
    );
  }
}
