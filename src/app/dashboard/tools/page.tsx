import Link from "next/link";
import {
  toolGroups,
  tools,
  type ToolGroup,
} from "@/lib/tools-config";

const groupOrder: ToolGroup[] = ["estudo", "producao", "pesquisa", "tcc", "apresentacao"];

export default function ToolsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold text-surface-900">Ferramentas</h1>
      <p className="mt-1 max-w-2xl text-zinc-600">
        {tools.length} ferramentas de IA para Saúde e Humanas — organizadas pelo que universitários
        mais usam hoje.
      </p>

      <div className="mt-8 space-y-10">
        {groupOrder.map((groupId) => {
          const group = toolGroups[groupId];
          const groupTools = tools.filter((t) => t.group === groupId);
          if (groupTools.length === 0) return null;

          return (
            <section key={groupId}>
              <div className="mb-4">
                <h2 className="font-display text-lg font-bold">
                  {group.emoji} {group.label}
                </h2>
                <p className="text-sm text-zinc-500">{group.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="rounded-2xl border border-surface-200 bg-white p-5 transition hover:border-primary-200 hover:shadow-lg"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Icon size={20} />
                        </div>
                        {tool.popular && (
                          <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-600 uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold">{tool.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{tool.description}</p>
                      <p className="mt-3 text-xs font-semibold text-primary-600">
                        {tool.freeUnlimited ? "Grátis ilimitado" : `${tool.credits} créditos/uso`}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
