import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "icon";
type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

const assets = {
  color: "/brand/logo-transparent-sm.png",
  white: "/brand/logo-white-transparent.png",
  icon: "/brand/logo-icon.png",
} as const;

const heights: Record<LogoSize, number> = {
  xs: 40,
  sm: 48,
  md: 56,
  lg: 68,
  xl: 84,
};

const maxWidths: Record<LogoSize, number> = {
  xs: 200,
  sm: 240,
  md: 280,
  lg: 340,
  xl: 400,
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
  const maxWidth = variant === "icon" ? height : maxWidths[size];
  const src = assets[variant];

  const image = (
    <Image
      src={src}
      alt="MentorUp"
      width={maxWidth}
      height={height}
      priority={priority}
      className={cn("w-auto object-contain object-left", className)}
      style={{ height, maxWidth, width: "auto" }}
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
