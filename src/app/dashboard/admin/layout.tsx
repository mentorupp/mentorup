import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!isAdminRole(session?.user?.role)) {
    redirect("/dashboard");
  }
  return children;
}
