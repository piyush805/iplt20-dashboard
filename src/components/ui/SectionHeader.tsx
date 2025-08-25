import { SectionHeaderProps } from "@/types";

export default function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex items-center justify-center">{icon}</div>}
        <div>
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}
