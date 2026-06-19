"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface MindMapData {
  title: string;
  nodes: { id: string; label: string; type: string; parent?: string }[];
}

const typeColors: Record<string, string> = {
  root: "#4f46e5",
  branch: "#6366f1",
  leaf: "#10b981",
};

export default function MindMapViewer({ data }: { data: MindMapData }) {
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const levels: Record<string, number> = {};
    const children: Record<string, string[]> = {};

    data.nodes.forEach((n) => {
      if (n.parent) {
        children[n.parent] = [...(children[n.parent] ?? []), n.id];
      }
    });

    function getLevel(id: string, visited = new Set<string>()): number {
      if (levels[id] !== undefined) return levels[id];
      if (visited.has(id)) return 0;
      visited.add(id);
      const node = data.nodes.find((n) => n.id === id);
      if (!node?.parent) {
        levels[id] = 0;
        return 0;
      }
      levels[id] = getLevel(node.parent, visited) + 1;
      return levels[id];
    }

    data.nodes.forEach((n) => getLevel(n.id));

    const byLevel: Record<number, string[]> = {};
    data.nodes.forEach((n) => {
      const lvl = levels[n.id] ?? 0;
      byLevel[lvl] = [...(byLevel[lvl] ?? []), n.id];
    });

    data.nodes.forEach((n) => {
      const lvl = levels[n.id] ?? 0;
      const idx = byLevel[lvl].indexOf(n.id);
      const total = byLevel[lvl].length;
      nodes.push({
        id: n.id,
        data: { label: n.label },
        position: { x: lvl * 280, y: idx * 100 - (total * 50) / 2 + 200 },
        style: {
          background: typeColors[n.type] ?? "#6366f1",
          color: "white",
          border: "none",
          borderRadius: 12,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: n.type === "root" ? 700 : 500,
          maxWidth: 220,
        },
      });

      if (n.parent) {
        edges.push({
          id: `${n.parent}-${n.id}`,
          source: n.parent,
          target: n.id,
          animated: true,
          style: { stroke: "#a5b4fc", strokeWidth: 2 },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [data]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div>
      <h3 className="font-display mb-4 text-base font-bold text-surface-900">{data.title}</h3>
      <div className="h-[500px] rounded-xl border border-surface-200 bg-surface-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodesDraggable
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e4e4e7" gap={16} />
          <Controls />
          <MiniMap nodeColor={(n) => (n.style?.background as string) ?? "#6366f1"} />
        </ReactFlow>
      </div>
      <div className="mt-3 flex gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary-600" /> Raiz</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> Ramo</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-accent-500" /> Folha</span>
      </div>
    </div>
  );
}
