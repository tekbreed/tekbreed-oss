import { cn } from "~/lib/utils";

/**
 * TekMemo brand mark (SC1 / SC2).
 *
 * A custom SVG glyph: a rounded-square container with a brand gradient stroke,
 * enclosing a connected "memory node" constellation — one central node linked to
 * three satellites. Reads as: connected memory, technical, premium. The gradient
 * (brand-blue → brand-violet) is the single accent used across the whole app.
 *
 * `Wordmark` pairs the glyph with the mono "TekMemo" / "Cloud" treatment.
 */

export function LogoMark({
	className,
	size = 28,
}: {
	className?: string;
	size?: number;
}) {
	// Stable gradient id so multiple marks on one page don't collide.
	const gid = "tekmemo-logo-grad";
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 32 32"
			fill="none"
			className={cn("shrink-0", className)}
			role="img"
			aria-label="TekMemo"
		>
			<defs>
				<linearGradient id={gid} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
					<stop stopColor="oklch(0.7 0.15 215)" />
					<stop offset="0.5" stopColor="oklch(0.62 0.17 248)" />
					<stop offset="1" stopColor="oklch(0.58 0.19 295)" />
				</linearGradient>
			</defs>
			{/* Container — rounded square with hairline gradient stroke. */}
			<rect
				x="1.5"
				y="1.5"
				width="29"
				height="29"
				rx="8"
				stroke={`url(#${gid})`}
				strokeWidth="1.25"
				opacity="0.55"
			/>
			{/* Connection lines (drawn first so nodes sit on top). */}
			<g stroke={`url(#${gid})`} strokeWidth="1.25" strokeLinecap="round" opacity="0.7">
				<line x1="16" y1="16" x2="9" y2="9.5" />
				<line x1="16" y1="16" x2="23.5" y2="10" />
				<line x1="16" y1="16" x2="11" y2="23.5" />
			</g>
			{/* Satellite nodes. */}
			<circle cx="9" cy="9.5" r="2" fill={`url(#${gid})`} />
			<circle cx="23.5" cy="10" r="2" fill={`url(#${gid})`} />
			<circle cx="11" cy="23.5" r="2" fill={`url(#${gid})`} />
			{/* Central node — slightly larger, brighter. */}
			<circle cx="16" cy="16" r="3" fill={`url(#${gid})`} />
			<circle cx="16" cy="16" r="3" fill="oklch(0.99 0 0)" opacity="0.9" />
		</svg>
	);
}

export function Wordmark({
	className,
	suffix = "Cloud",
}: {
	className?: string;
	suffix?: string | null;
}) {
	return (
		<span
			className={cn(
				"font-mono text-sm font-semibold tracking-tight text-foreground",
				className,
			)}
		>
			TekMemo
			{suffix ? (
				<span className="text-muted-foreground">
					{" "}
					{suffix}
				</span>
			) : null}
		</span>
	);
}

export function Logo({ className }: { className?: string }) {
	return (
		<span className={cn("flex items-center gap-2", className)}>
			<LogoMark size={26} />
			<Wordmark />
		</span>
	);
}
