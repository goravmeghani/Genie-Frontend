import * as React from "react";

export type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
	default: "bg-blue-100 text-blue-800 border-transparent",
	secondary: "bg-muted text-foreground border-transparent",
	outline: "bg-transparent border border-input text-foreground",
};

export const Badge = ({ className = "", variant = "default", ...props }: BadgeProps) => (
	<div
		className={[
			"inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
			variantStyles[variant],
			className,
		].join(" ")}
		{...props}
	/>
);

export default Badge;


