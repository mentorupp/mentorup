"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
  type NodeTypes,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import { Check, Download, Loader2, Maximize2, Minimize2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import MindMapNode from "./MindMapNode";
import { toFlowElements, getTreeDepth, type MindMapData } from "@/lib/mind-map";

const nodeTypes: NodeTypes = {
  mindMap: MindMapNode,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function MindMapDownloadButton({ title }: { title: string }) {
  const { getNodes } = useReactFlow();
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = useCallback(async () => {
    const viewportEl = document.querySelector(
      ".mind-map-flow .react-flow__viewport"
    ) as HTMLElement | null;
    if (!viewportEl) return;

    setDownloading(true);
    setDone(false);

    try {
      const nodes = getNodes();
      const bounds = getNodesBounds(nodes);
      const padding = 80;
      const imageWidth = Math.ceil(bounds.width + padding * 2);
      const imageHeight = Math.ceil(bounds.height + padding * 2);

      const viewport = getViewportForBounds(
        bounds,
        imageWidth,
        imageHeight,
        0.5,
        2.5,
        padding
      );

      const dataUrl = await toPng(viewportEl, {
        backgroundColor: "#ffffff",
        width: imageWidth,
        height: imageHeight,
        pixelRatio: 3,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      const link = document.createElement("a");
      link.download = `mapa-mental-${slugify(title) || "mentorup"}.png`;
      link.href = dataUrl;
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      alert("Não foi possível exportar a imagem. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }, [getNodes, title]);

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={downloading}
      className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-md ring-1 ring-zinc-200 transition hover:bg-zinc-50 disabled:opacity-60"
    >
      {downloading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : done ? (
        <Check size={14} className="text-accent-600" />
      ) : (
        <Download size={14} />
      )}
      {downloading ? "Exportando…" : done ? "Baixado!" : "Baixar PNG"}
    </button>
  );
}

function MindMapCanvas({ data }: { data: MindMapData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { normalized, nodes: layoutNodes, edges: layoutEdges } = useMemo(
    () => toFlowElements(data),
    [data]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const stats = useMemo(() => {
    const rootNode = normalized.nodes.find((n) => n.type === "root");
    const depth = rootNode ? getTreeDepth(normalized.nodes, rootNode.id) : 0;
    const branch = normalized.nodes.filter((n) => n.type === "branch").length;
    const leaf = normalized.nodes.filter((n) => n.type === "leaf").length;
    return { total: normalized.nodes.length, depth, branch, leaf };
  }, [normalized.nodes]);

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 flex flex-col bg-white p-4" : ""}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-surface-900">
            {normalized.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {stats.total} conceitos · {stats.depth} níveis · {stats.branch} ramos · {stats.leaf}{" "}
            detalhes
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MindMapDownloadButton title={normalized.title} />
          <button
            type="button"
            onClick={() => setFullscreen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-surface-50"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {fullscreen ? "Sair" : "Tela cheia"}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`mind-map-flow overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 shadow-inner ${
          fullscreen ? "min-h-0 flex-1" : "h-[min(72vh,680px)]"
        }`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.12, maxZoom: 1.1 }}
          minZoom={0.08}
          maxZoom={2}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: "default",
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          }}
        >
          <Background color="#e2e8f0" gap={20} size={1} />
          <Controls showInteractive={false} className="!rounded-xl !border !shadow-md" />
        </ReactFlow>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-md bg-gradient-to-r from-primary-600 to-accent-500" />
            Tema central
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-md bg-primary-500" />
            Ramos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-5 rounded-md bg-accent-500" />
            Detalhes
          </span>
        </div>
        <p>Arraste para reorganizar · scroll para zoom · exporte em alta resolução (PNG)</p>
      </div>
    </div>
  );
}

export default function MindMapViewer({ data }: { data: MindMapData }) {
  return (
    <ReactFlowProvider>
      <MindMapCanvas data={data} />
    </ReactFlowProvider>
  );
}
