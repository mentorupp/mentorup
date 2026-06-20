import Sidebar from "@/components/dashboard/Sidebar";
import DashboardUpgradeBar from "@/components/dashboard/DashboardUpgradeBar";
import MentorUpLogo from "@/components/MentorUpLogo";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-surface-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-surface-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <MentorUpLogo href="/dashboard" size="sm" />
            <div className="flex gap-2 text-xs">
              <a href="/dashboard/tools" className="rounded-lg bg-primary-50 px-3 py-1.5 font-semibold text-primary-600">Ferramentas</a>
              <a href="/dashboard/areas" className="rounded-lg bg-surface-100 px-3 py-1.5 font-medium text-zinc-600">Áreas</a>
              <a href="/dashboard/billing" className="rounded-lg bg-surface-100 px-3 py-1.5 font-medium text-zinc-600">Planos</a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl p-4 lg:p-8">
          <DashboardUpgradeBar />
          {children}
        </div>
      </main>
    </div>
  );
}
