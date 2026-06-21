import type { Edge, Node } from "@xyflow/react";

export const MIND_MAP_TOOL_ID = "mind-map";

export type MindMapNodeData = {
  id: string;
  label: string;
  type: "root" | "branch" | "leaf";
  parent?: string;
  order?: number;
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
  root: { width: 260, minHeight: 72 },
  branch: { width: 220, minHeight: 54 },
  leaf: { width: 200, minHeight: 46 },
} as const;

const LABEL_MAX = 55;

function measureNodeHeight(label: string, type: keyof typeof NODE_DIMENSIONS): number {
  const dim = NODE_DIMENSIONS[type];
  const charsPerLine = type === "root" ? 32 : type === "branch" ? 28 : 26;
  const lines = Math.max(1, Math.ceil(label.length / charsPerLine));
  return Math.max(dim.minHeight, Math.min(lines * 22 + 18, 120));
}

function findRootId(nodes: MindMapNodeData[]): string | null {
  const explicit = nodes.find((n) => n.type === "root");
  if (explicit) return explicit.id;
  const withoutParent = nodes.filter((n) => !n.parent);
  if (withoutParent.length === 1) return withoutParent[0].id;
  return withoutParent[0]?.id ?? nodes[0]?.id ?? null;
}

function assignTypesByDepth(
  nodes: MindMapNodeData[],
  rootId: string,
  childrenMap: Map<string, MindMapNodeData[]>
): MindMapNodeData[] {
  const depths = new Map<string, number>();

  function setDepth(id: string, depth: number) {
    depths.set(id, depth);
    for (const child of childrenMap.get(id) ?? []) {
      setDepth(child.id, depth + 1);
    }
  }
  setDepth(rootId, 0);

  return nodes.map((n) => {
    const depth = depths.get(n.id) ?? 0;
    let type: MindMapNodeData["type"] = "leaf";
    if (depth === 0) type = "root";
    else if (depth <= 2) type = "branch";
    else type = "leaf";
    return { ...n, type };
  });
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
        label: n.label.trim().slice(0, LABEL_MAX),
        type,
        parent: n.parent ? String(n.parent).trim() : undefined,
        order: index,
      };
    });

  if (nodes.length === 0) {
    return {
      title,
      nodes: [{ id: "root", label: title.slice(0, 60), type: "root", order: 0 }],
    };
  }

  const idSet = new Set(nodes.map((n) => n.id));
  let rootId = findRootId(nodes);

  if (!rootId) {
    rootId = "root";
    nodes.unshift({ id: rootId, label: title.slice(0, 60), type: "root", order: -1 });
    idSet.add(rootId);
  }

  const roots = nodes.filter((n) => n.type === "root" || !n.parent);
  if (roots.length > 1) {
    const syntheticId = "root-center";
    const syntheticLabel = title.slice(0, 50) || "Tema central";
    nodes = [
      { id: syntheticId, label: syntheticLabel, type: "root", order: -1 },
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

  const childrenMap = buildChildrenMap(nodes);
  nodes = assignTypesByDepth(nodes, rootId, childrenMap);

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
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  return map;
}

/** Layout horizontal em árvore — ideal para mapas com 3-5 níveis de profundidade */
export function layoutHorizontalTree(
  nodes: MindMapNodeData[],
  rootId: string,
  startX = 48,
  startY = 40
): Map<string, { x: number; y: number; width: number; height: number }> {
  const childrenMap = buildChildrenMap(nodes);
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const positions = new Map<string, { x: number; y: number; width: number; height: number }>();

  const VERTICAL_GAP = 12;
  const HORIZONTAL_GAP = 260;

  function getNodeSize(id: string) {
    const node = nodeById.get(id)!;
    const nodeType =
      node.type === "root" ? "root" : node.type === "branch" ? "branch" : "leaf";
    const width = NODE_DIMENSIONS[nodeType].width;
    const height = measureNodeHeight(node.label, nodeType);
    return { width, height, nodeType };
  }

  function subtreeHeight(id: string): number {
    const kids = childrenMap.get(id) ?? [];
    const { height } = getNodeSize(id);
    if (kids.length === 0) return height;
    const kidsHeight = kids.reduce(
      (sum, child, i) => sum + subtreeHeight(child.id) + (i > 0 ? VERTICAL_GAP : 0),
      0
    );
    return Math.max(height, kidsHeight);
  }

  function layoutSubtree(id: string, depth: number, topY: number): void {
    const { width, height } = getNodeSize(id);
    const kids = childrenMap.get(id) ?? [];
    const subtreeH = subtreeHeight(id);
    const x = startX + depth * HORIZONTAL_GAP;
    const y = topY + subtreeH / 2 - height / 2;

    positions.set(id, { x, y, width, height });

    if (kids.length === 0) return;

    let childTop = topY;
    for (const child of kids) {
      layoutSubtree(child.id, depth + 1, childTop);
      childTop += subtreeHeight(child.id) + VERTICAL_GAP;
    }
  }

  layoutSubtree(rootId, 0, startY);
  return positions;
}

export function getTreeDepth(nodes: MindMapNodeData[], rootId: string): number {
  const childrenMap = buildChildrenMap(nodes);
  function depth(id: string): number {
    const kids = childrenMap.get(id) ?? [];
    if (kids.length === 0) return 1;
    return 1 + Math.max(...kids.map((c) => depth(c.id)));
  }
  return depth(rootId);
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

  const positions = layoutHorizontalTree(normalized.nodes, rootId);

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
      style: { stroke: "#94a3b8", strokeWidth: 2 },
    }));

  return { normalized, nodes, edges };
}

export function getMindMapAIOptions(input: string) {
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  return {
    toolId: MIND_MAP_TOOL_ID,
    temperature: 0.2,
    maxTokens: words <= 150 ? 7_000 : words <= 500 ? 10_000 : 12_000,
  };
}

/** @deprecated Use layoutHorizontalTree — mantido para compatibilidade */
export function layoutRadialMindMap(
  nodes: MindMapNodeData[],
  rootId: string,
  centerX = 520,
  centerY = 420
) {
  return layoutHorizontalTree(nodes, rootId, centerX, centerY);
}
