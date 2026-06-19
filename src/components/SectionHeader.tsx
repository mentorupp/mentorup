import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 lg:mb-10",
        align === "center" && "mx-auto max-w-2xl text-center",
        align === "left" && "max-w-xl",
        className
      )}
    >
      <span className="section-label">{label}</span>
      <h2 className="section-title mt-2">{title}</h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-zinc-500 lg:text-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}
