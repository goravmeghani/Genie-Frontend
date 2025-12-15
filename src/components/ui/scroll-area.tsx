import * as React from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
	heightClass?: string;
	viewportClassName?: string;
	viewportRef?: React.Ref<HTMLDivElement>;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
	(
		{
			className = "",
			heightClass = "h-full",
			viewportClassName = "",
			viewportRef,
			children,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={["relative overflow-hidden", heightClass, className].join(" ")}
				{...props}
			>
				<div
					ref={viewportRef}
					className={[
						"h-full w-full overflow-auto scrollbar-thin scrollbar-corner-transparent",
						viewportClassName,
					].join(" ")}
				>
					{children}
				</div>
			</div>
		);
	}
);

ScrollArea.displayName = "ScrollArea";

export default ScrollArea;


