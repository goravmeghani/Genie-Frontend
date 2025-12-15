import * as React from "react";

export type ButtonVariant =
	| "default"
	| "secondary"
	| "ghost"
	| "destructive"
	| "outline";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: "sm" | "md" | "lg";
}

const baseStyles =
	"group inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm";

const variantStyles: Record<ButtonVariant, string> = {
	default:
		"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600/40 ring-offset-background",
	secondary:
		"bg-muted text-foreground hover:bg-muted/80 focus:ring-muted/40 ring-offset-background",
	ghost:
		"bg-transparent hover:bg-muted text-foreground focus:ring-muted/40 ring-offset-background",
	destructive:
		"bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/40 ring-offset-background",
	outline:
		"border border-input bg-background hover:bg-muted text-foreground focus:ring-muted/40 ring-offset-background",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
	sm: "h-8 px-3 text-sm",
	md: "h-10 px-4 text-sm",
	lg: "h-11 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className = "", variant = "default", size = "md", type = "button", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={[baseStyles, variantStyles[variant], sizeStyles[size], className]
					.join(" ")}
				type={type}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export default Button;


