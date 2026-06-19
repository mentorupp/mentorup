import AdminPanel from "@/components/dashboard/AdminPanel";

export const metadata = {
  title: "Admin — MentorUp",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-surface-900">
        Painel Admin
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Usuários, contatos, pagamentos e atividade em tempo real.
      </p>
      <AdminPanel />
    </div>
  );
}
