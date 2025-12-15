import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
}

export const Separator = ({ orientation = "horizontal", className = "", ...props }: SeparatorProps) => {
	return (
		<div
			role="separator"
			className={[
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				"bg-border",
				className,
			].join(" ")}
			{...props}
		/>
	);
};

export default Separator;


