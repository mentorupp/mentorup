import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "icon";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

/** Arquivos PNG nativos em alta resolução — servidos sem recompressão do Next.js */
const assets = {
  color: { src: "/brand/logo-full.png", width: 2400, height: 653 },
  white: { src: "/brand/logo-white.png", width: 2400, height: 653 },
  icon: { src: "/brand/logo-icon.png", width: 1200, height: 1079 },
} as const;

const WORDMARK_RATIO = 2400 / 653;

const heights: Record<LogoSize, number> = {
  xs: 40,
  sm: 48,
  md: 56,
  lg: 64,
  xl: 80,
};

interface MentorUpLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string | null;
  className?: string;
}

export default function MentorUpLogo({
  variant = "color",
  size = "md",
  href = "/",
  className,
}: MentorUpLogoProps) {
  const displayHeight = heights[size];
  const asset = assets[variant];
  const displayWidth =
    variant === "icon"
      ? displayHeight
      : Math.round(displayHeight * WORDMARK_RATIO);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt="MentorUp"
      width={asset.width}
      height={asset.height}
      decoding="async"
      className={cn("block h-auto max-w-none object-contain object-left", className)}
      style={{
        height: displayHeight,
        width: displayWidth,
        imageRendering: "auto",
      }}
    />
  );

  if (!href) {
    return <span className="inline-flex items-center">{image}</span>;
  }

  return (
    <Link href={href} className="inline-flex items-center transition hover:opacity-90">
      {image}
    </Link>
  );
}
