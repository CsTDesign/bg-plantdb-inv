import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  children, className
}: BadgeProps) {
  return (
    <span className={cn("bg-primary px-2 py-1 text-primary-foreground text-xs w-fit", className)}>
      {children}
    </span>
  );
}
