import * as React from "react";

export interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

export const Tabs = ({ value, onValueChange, children, className = "" }: TabsProps) => {
	return (
		<div className={["w-full", className].join(" ")}>{React.Children.map(children, (child) => {
			if (
				React.isValidElement(child) &&
				(child.type as any).displayName === "TabsList"
			) {
				return React.cloneElement(child, { value, onValueChange });
			}
			return React.isValidElement(child)
				? React.cloneElement(child as any, { value })
				: child;
		})}</div>
	);
};

interface TabsListProps {
	children: React.ReactNode;
	className?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

export const TabsList = ({ children, className = "", value, onValueChange }: TabsListProps) => {
	return (
		<div className={[
			"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
			"text-muted-foreground gap-1",
			className,
		].join(" ")}
			role="tablist"
		>
			{React.Children.map(children, (child) => {
				if (!React.isValidElement(child)) return child;
				return React.cloneElement(child as any, {
					active: (child.props as any).value === value,
					onClick: () => onValueChange && onValueChange((child.props as any).value),
				});
			})}
		</div>
	);
};
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	active?: boolean;
}

export const TabsTrigger = ({ className = "", active, children, ...props }: TabsTriggerProps) => (
	<button
		className={[
			"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5",
			"text-sm font-medium transition-all focus:outline-none",
			active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
			className,
		].join(" ")}
		role="tab"
		aria-selected={active}
		{...props}
	>
		{children}
	</button>
);

interface TabsContentProps {
	value?: string;
	children: React.ReactNode;
	className?: string;
}

export const TabsContent = ({ value: current, children, className = "" }: TabsContentProps & { value: string }) => {
	return (
		<div className={["mt-3", className].join(" ")}>{children}</div>
	);
};

Tabs.displayName = "Tabs";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

export default Tabs;


