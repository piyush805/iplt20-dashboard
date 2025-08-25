import { StatusBadgeProps } from "@/types";

const getStatusConfig = (status: StatusBadgeProps["status"]) => {
  switch (status) {
    case "LIVE":
      return {
        bgColor: "bg-red-500",
        textColor: "text-white",
        label: "LIVE",
      };
    case "SCHEDULED":
      return {
        bgColor: "bg-blue-500",
        textColor: "text-white",
        label: "SCHEDULED",
      };
    case "COMPLETED":
      return {
        bgColor: "bg-green-500",
        textColor: "text-white",
        label: "COMPLETED",
      };
    default:
      return {
        bgColor: "bg-muted",
        textColor: "text-foreground",
        label: "ALL",
      };
  }
};

export default function StatusBadge({
  status,
  className = "",
  showCount = false,
  count = 0,
}: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
      {showCount && count > 0 && (
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
          {count}
        </span>
      )}
    </span>
  );
}
