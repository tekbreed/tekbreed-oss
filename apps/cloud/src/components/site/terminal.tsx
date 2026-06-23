import { Check, Copy } from "lucide-react";
import type * as React from "react";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { cn } from "~/lib/utils";

/**
 * Terminal window — the styled premium shell for code/CLI demos (Signal aesthetic).
 *
 * A faux macOS window chrome (three dots + title bar) over a deep-black pane with
 * a hairline gradient border and a subtle inner grid. Used by the hero + the
 * "how sync works" section to present the three-command protocol. Each command row
 * is independently copyable via `useCopyToClipboard`.
 */

function Dot({ className }: { className?: string }) {
	return (
		<span aria-hidden className={cn("size-2.5 rounded-full", className)} />
	);
}

export function TerminalWindow({
	title = "tekmemo — zsh",
	commands,
	className,
}: {
	title?: string;
	commands: { cmd: string; note?: string }[];
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative overflow-hidden border border-border bg-[oklch(0.13_0.008_264)]",
				className,
			)}
		>
			{/* Gradient hairline top border. */}
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-px"
				style={{
					background:
						"linear-gradient(to right, transparent, oklch(0.62 0.17 248 / 0.7), oklch(0.58 0.19 295 / 0.5), transparent)",
				}}
			/>
			{/* Title bar */}
			<div className="flex items-center gap-2 border-b border-border bg-white/2 px-4 py-3">
				<div className="flex items-center gap-1.5">
					<Dot className="bg-[oklch(0.7_0.18_25/0.7)]" />
					<Dot className="bg-[oklch(0.78_0.14_85/0.6)]" />
					<Dot className="bg-[oklch(0.7_0.15_145/0.6)]" />
				</div>
				<span className="ml-2 font-mono text-xs text-muted-foreground">
					{title}
				</span>
			</div>
			{/* Command rows */}
			<div className="divide-y divide-border/50">
				{commands.map((item, i) => (
					<CommandRow key={item.cmd} index={i} {...item} />
				))}
			</div>
		</div>
	);
}

function CommandRow({
	index,
	cmd,
	note,
}: {
	index: number;
	cmd: string;
	note?: string;
}) {
	const { copy, copied } = useCopyToClipboard();
	return (
		<div className="group/cmd flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]">
			<span className="font-mono text-xs text-primary/70 select-none">
				{String(index + 1).padStart(2, "0")}
			</span>
			<span aria-hidden className="font-mono text-sm text-muted-foreground">
				$
			</span>
			<code className="flex-1 font-mono text-sm text-foreground">{cmd}</code>
			{note ? (
				<span className="hidden text-xs text-muted-foreground sm:inline">
					{note}
				</span>
			) : null}
			<button
				type="button"
				onClick={() => copy(cmd)}
				aria-label={`Copy ${cmd}`}
				className={cn(
					"flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
					copied && "border-primary/40 text-primary",
				)}
			>
				{copied ? (
					<Check className="size-3.5" />
				) : (
					<Copy className="size-3.5 opacity-0 transition-opacity group-hover/cmd:opacity-100" />
				)}
			</button>
		</div>
	);
}

/**
 * SectionHeading — the consistent block at the top of every section: mono eyebrow,
 * display heading, supporting lede. Eliminates per-section repetition.
 */
export function SectionHeading({
	eyebrow,
	title,
	lede,
	align = "left",
	className,
}: {
	eyebrow: string;
	title: React.ReactNode;
	lede?: React.ReactNode;
	align?: "left" | "center";
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4",
				align === "center" && "items-center text-center",
				className,
			)}
		>
			<div className="flex items-center gap-2.5">
				<span
					aria-hidden
					className="size-1.5 rounded-full bg-primary animate-pulse-dot"
				/>
				<span className="eyebrow text-primary">{eyebrow}</span>
			</div>
			<h2
				className={cn(
					"display max-w-2xl text-3xl text-foreground sm:text-4xl",
					align === "center" && "mx-auto",
				)}
			>
				{title}
			</h2>
			{lede ? (
				<p
					className={cn(
						"max-w-2xl text-base leading-relaxed text-muted-foreground",
						align === "center" && "mx-auto",
					)}
				>
					{lede}
				</p>
			) : null}
		</div>
	);
}
