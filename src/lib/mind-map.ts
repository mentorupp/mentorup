import type { Edge, Node } from "@xyflow/react";

export const MIND_MAP_TOOL_ID = "mind-map";

export type MindMapNodeData = {
  id: string;
  label: string;
  type: "root" | "branch" | "leaf";
  parent?: string;
};

export type MindMapData = {
  title: string;
  nodes: MindMapNodeData[];
};

export type RawMindMapData = {
  title?: string;
  nodes?: Array<{
    id?: string;
    label?: string;
    type?: string;
    parent?: string;
  }>;
};

export const NODE_DIMENSIONS = {
  root: { width: 240, minHeight: 76 },
  branch: { width: 210, minHeight: 58 },
  leaf: { width: 190, minHeight: 50 },
} as const;

function measureNodeHeight(label: string, type: keyof typeof NODE_DIMENSIONS): number {
  const dim = NODE_DIMENSIONS[type];
  const charsPerLine = type === "root" ? 30 : type === "branch" ? 26 : 24;
  const lines = Math.max(1, Math.ceil(label.length / charsPerLine));
  return Math.max(dim.minHeight, Math.min(lines * 22 + 20, 128));
}

function findRootId(nodes: MindMapNodeData[]): string | null {
  const explicit = nodes.find((n) => n.type === "root");
  if (explicit) return explicit.id;
  const withoutParent = nodes.filter((n) => !n.parent);
  if (withoutParent.length === 1) return withoutParent[0].id;
  return withoutParent[0]?.id ?? nodes[0]?.id ?? null;
}

export function normalizeMindMapData(raw: RawMindMapData): MindMapData {
  const title = raw.title?.trim() || "Mapa Mental";
  const seenIds = new Set<string>();

  let nodes: MindMapNodeData[] = (raw.nodes ?? [])
    .filter((n): n is { id: string; label: string; type?: string; parent?: string } =>
      Boolean(n?.id && n.label?.trim())
    )
    .map((n, index) => {
      let id = String(n.id).trim();
      if (seenIds.has(id)) id = `${id}-${index}`;
      seenIds.add(id);

      const type: MindMapNodeData["type"] =
        n.type === "root" || n.type === "branch" || n.type === "leaf" ? n.type : "leaf";

      return {
        id,
        label: n.label.trim().slice(0, 80),
        type,
        parent: n.parent ? String(n.parent).trim() : undefined,
      };
    });

  if (nodes.length === 0) {
    return {
      title,
      nodes: [{ id: "root", label: title.slice(0, 60), type: "root" }],
    };
  }

  const idSet = new Set(nodes.map((n) => n.id));
  let rootId = findRootId(nodes);

  if (!rootId) {
    rootId = "root";
    nodes.unshift({ id: rootId, label: title.slice(0, 60), type: "root" });
    idSet.add(rootId);
  }

  const roots = nodes.filter((n) => n.type === "root" || !n.parent);
  if (roots.length > 1) {
    const syntheticId = "root-center";
    const syntheticLabel = title.slice(0, 50) || "Tema central";
    nodes = [
      { id: syntheticId, label: syntheticLabel, type: "root" },
      ...nodes.map((n) => {
        if (roots.some((r) => r.id === n.id)) {
          return { ...n, type: "branch" as const, parent: syntheticId };
        }
        return n;
      }),
    ];
    rootId = syntheticId;
    idSet.add(syntheticId);
  } else {
    nodes = nodes.map((n) =>
      n.id === rootId ? { ...n, type: "root", parent: undefined } : n
    );
  }

  nodes = nodes.map((n) => {
    if (n.id === rootId) {
      return { ...n, type: "root", parent: undefined };
    }
    if (!n.parent || !idSet.has(n.parent)) {
      return { ...n, parent: rootId!, type: n.type === "root" ? "branch" : n.type };
    }
    if (n.type === "root") {
      return { ...n, type: "branch" };
    }
    return n;
  });

  const visited = new Set<string>();
  function breakCycle(id: string): boolean {
    if (visited.has(id)) return false;
    visited.add(id);
    const node = nodes.find((n) => n.id === id);
    if (node?.parent && node.parent !== rootId) {
      if (!breakCycle(node.parent)) {
        node.parent = rootId!;
      }
    }
    visited.delete(id);
    return true;
  }
  nodes.forEach((n) => breakCycle(n.id));

  return { title, nodes };
}

export function buildChildrenMap(nodes: MindMapNodeData[]): Map<string, MindMapNodeData[]> {
  const map = new Map<string, MindMapNodeData[]>();
  for (const node of nodes) {
    if (!node.parent) continue;
    const list = map.get(node.parent) ?? [];
    list.push(node);
    map.set(node.parent, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
  }
  return map;
}

export function layoutRadialMindMap(
  nodes: MindMapNodeData[],
  rootId: string,
  centerX = 520,
  centerY = 420
): Map<string, { x: number; y: number; width: number; height: number }> {
  const childrenMap = buildChildrenMap(nodes);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const positions = new Map<string, { x: number; y: number; width: number; height: number }>();

  function subtreeWeight(id: string): number {
    const kids = childrenMap.get(id) ?? [];
    if (kids.length === 0) return 1;
    return kids.reduce((sum, child) => sum + subtreeWeight(child.id), 0);
  }

  function layoutNode(id: string, angleStart: number, angleSpan: number, depth: number) {
    const node = nodeById.get(id);
    if (!node) return;

    const nodeType =
      node.type === "root" ? "root" : node.type === "branch" ? "branch" : "leaf";
    const width = NODE_DIMENSIONS[nodeType].width;
    const height = measureNodeHeight(node.label, nodeType);

    const angle = angleStart + angleSpan / 2;
    const radius = depth === 0 ? 0 : 155 + (depth - 1) * 145;
    const x = centerX + radius * Math.cos(angle - Math.PI / 2);
    const y = centerY + radius * Math.sin(angle - Math.PI / 2);

    positions.set(id, {
      x: x - width / 2,
      y: y - height / 2,
      width,
      height,
    });

    const kids = childrenMap.get(id) ?? [];
    if (kids.length === 0) return;

    let cursor = angleStart;
    const total = kids.reduce((sum, child) => sum + subtreeWeight(child.id), 0);

    for (const child of kids) {
      const weight = subtreeWeight(child.id) / total;
      const span = angleSpan * weight;
      layoutNode(child.id, cursor, span, depth + 1);
      cursor += span;
    }
  }

  layoutNode(rootId, 0, Math.PI * 2, 0);
  return positions;
}

export function toFlowElements(data: MindMapData): {
  normalized: MindMapData;
  nodes: Node[];
  edges: Edge[];
} {
  const normalized = normalizeMindMapData(data);
  const rootId = normalized.nodes.find((n) => n.type === "root")?.id;
  if (!rootId) {
    return { normalized, nodes: [], edges: [] };
  }

  const positions = layoutRadialMindMap(normalized.nodes, rootId);

  const nodes: Node[] = normalized.nodes.map((node) => {
    const pos = positions.get(node.id)!;
    const nodeType =
      node.type === "root" ? "root" : node.type === "branch" ? "branch" : "leaf";

    return {
      id: node.id,
      type: "mindMap",
      data: { label: node.label, nodeType },
      position: { x: pos.x, y: pos.y },
      width: pos.width,
      height: pos.height,
      draggable: true,
      selectable: true,
    };
  });

  const edges: Edge[] = normalized.nodes
    .filter((node) => node.parent)
    .map((node) => ({
      id: `${node.parent}-${node.id}`,
      source: node.parent!,
      target: node.id,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#94a3b8", strokeWidth: 2.5 },
    }));

  return { normalized, nodes, edges };
}

export function getMindMapAIOptions(input: string) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  return {
    toolId: MIND_MAP_TOOL_ID,
    temperature: 0.25,
    maxTokens: words <= 150 ? 3_000 : undefined,
  };
}
