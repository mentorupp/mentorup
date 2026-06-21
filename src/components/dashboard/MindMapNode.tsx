"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

type MindMapNodeData = {
  label: string;
  nodeType: "root" | "branch" | "leaf";
};

const styles: Record<
  MindMapNodeData["nodeType"],
  { bg: string; border: string; shadow: string; text: string; radius: number }
> = {
  root: {
    bg: "linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #10b981 100%)",
    border: "#4338ca",
    shadow: "0 12px 32px rgba(79, 70, 229, 0.35)",
    text: "text-sm font-bold leading-snug",
    radius: 18,
  },
  branch: {
    bg: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    border: "#4f46e5",
    shadow: "0 8px 24px rgba(99, 102, 241, 0.28)",
    text: "text-[13px] font-semibold leading-snug",
    radius: 14,
  },
  leaf: {
    bg: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    border: "#059669",
    shadow: "0 6px 18px rgba(16, 185, 129, 0.25)",
    text: "text-xs font-medium leading-snug",
    radius: 12,
  },
};

const handleStyle = {
  opacity: 0,
  width: 8,
  height: 8,
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  border: "none",
  background: "transparent",
};

function MindMapNodeComponent({ data }: NodeProps) {
  const nodeData = data as MindMapNodeData;
  const style = styles[nodeData.nodeType] ?? styles.branch;

  return (
    <div
      className="relative flex h-full w-full items-center justify-center px-4 py-3 text-center text-white"
      style={{
        background: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: style.radius,
        boxShadow: style.shadow,
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <p className={`${style.text} break-words hyphens-auto`}>{nodeData.label}</p>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
}

export default memo(MindMapNodeComponent);
