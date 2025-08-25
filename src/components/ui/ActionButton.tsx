import { ReactNode } from "react";
import Link from "next/link";
import { ActionButtonProps } from "@/types";

export default function ActionButton({
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled = false,
}: ActionButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-primary text-white hover:shadow-glow";
      case "secondary":
        return "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30";
      case "outline":
        return "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white";
      case "ghost":
        return "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted";
      default:
        return "bg-gradient-primary text-white hover:shadow-glow";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  const baseClasses =
    "inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {icon && icon}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={buttonClasses}>
      {icon && icon}
      {children}
    </button>
  );
}
