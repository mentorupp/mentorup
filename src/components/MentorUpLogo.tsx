import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "icon";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const assets = {
  color: "/brand/logo-full.png",
  white: "/brand/logo-white.png",
  icon: "/brand/logo-icon.png",
} as const;

/** Proporção real da logo completa (ícone + wordmark) */
const WORDMARK_RATIO = 3.68;

const heights: Record<LogoSize, number> = {
  xs: 38,
  sm: 46,
  md: 54,
  lg: 62,
  xl: 74,
};

interface MentorUpLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export default function MentorUpLogo({
  variant = "color",
  size = "md",
  href = "/",
  className,
  priority = false,
}: MentorUpLogoProps) {
  const height = heights[size];
  const width =
    variant === "icon" ? height : Math.round(height * WORDMARK_RATIO);
  const src = assets[variant];

  const image = (
    <Image
      src={src}
      alt="MentorUp"
      width={width}
      height={height}
      priority={priority}
      className={cn("w-auto object-contain object-left", className)}
      style={{ height, width: "auto", maxWidth: width }}
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
