import type { ActivityType, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function logActivity(
  type: ActivityType,
  options?: {
    userId?: string | null;
    path?: string;
    label?: string;
    meta?: Prisma.InputJsonValue;
  }
) {
  try {
    await prisma.activityEvent.create({
      data: {
        type,
        userId: options?.userId ?? undefined,
        path: options?.path,
        label: options?.label,
        meta: options?.meta ?? {},
      },
    });
  } catch {
    /* non-blocking */
  }
}
