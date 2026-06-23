import type * as React from "react";
import { cn } from "~/lib/utils";

/**
 * Section container for standard layout structure.
 */

/**
 * Section — the standard vertical-rhythm + max-width container for every public
 * page. Centralizes spacing so every section reads as part of one system.
 */
export function Section({
	as: As = "section",
	className,
	children,
	...props
}: React.ComponentProps<"section"> & {
	as?: React.ElementType;
}) {
	return (
		<As
			className={cn(
				"relative mx-auto w-full max-w-6xl px-6 sm:px-8",
				className,
			)}
			{...props}
		>
			{children}
		</As>
	);
}
