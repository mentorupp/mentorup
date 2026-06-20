import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "icon";
type LogoSize = "xs" | "sm" | "md" | "lg";

const assets = {
  color: "/brand/logo-transparent-sm.png",
  white: "/brand/logo-white-transparent.png",
  icon: "/brand/logo-icon.png",
} as const;

const heights: Record<LogoSize, number> = {
  xs: 28,
  sm: 32,
  md: 40,
  lg: 52,
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
  const src = assets[variant];
  const width = variant === "icon" ? height : Math.round(height * 4.2);

  const image = (
    <Image
      src={src}
      alt="MentorUp"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain object-left", className)}
      style={{ height, width: variant === "icon" ? height : "auto", maxWidth: variant === "icon" ? height : 220 }}
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
