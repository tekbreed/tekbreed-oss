import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { Link } from "react-router";
import { Section } from "~/components/site/visuals";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/pricing";

/**
 * Pricing page aligned with Figma Initial design.
 */

const PLANS = [
	{
		name: "Free",
		price: "$0",
		period: "forever",
		desc: "For individual developers getting started.",
		cta: "Get started",
		ctaHref: "/signup",
		highlight: false,
		soon: false,
		features: [
			{ text: "500 MB storage", included: true },
			{ text: "1 project", included: true },
			{ text: "1 connector", included: true },
			{ text: "API key auth", included: true },
			{ text: "Pre-sync snapshots", included: false },
			{ text: "Rollback history", included: false },
			{ text: "Priority support", included: false },
			{ text: "Team sharing", included: false },
		],
	},
	{
		name: "Pro",
		price: "$9",
		period: "/month",
		desc: "For developers who live in the terminal and push often.",
		cta: "Upgrade to Pro",
		ctaHref: "/signup",
		highlight: true,
		soon: false,
		features: [
			{ text: "5 GB storage", included: true },
			{ text: "Unlimited projects", included: true },
			{ text: "5 connectors", included: true },
			{ text: "API key auth", included: true },
			{ text: "Pre-sync snapshots", included: true },
			{ text: "30-day rollback history", included: true },
			{ text: "Priority support", included: true },
			{ text: "Team sharing", included: false },
		],
	},
	{
		name: "Teams",
		price: "$24",
		period: "/month",
		desc: "For teams sharing a canonical .tekmemo/ across all members.",
		cta: "Notify me",
		ctaHref: "#teams-notify",
		highlight: false,
		soon: true,
		features: [
			{ text: "20 GB storage", included: true },
			{ text: "Unlimited projects", included: true },
			{ text: "Unlimited connectors", included: true },
			{ text: "API key auth", included: true },
			{ text: "Pre-sync snapshots", included: true },
			{ text: "90-day rollback history", included: true },
			{ text: "Priority support", included: true },
			{ text: "Team sharing", included: true },
		],
	},
];

const FAQS = [
	{
		q: "What counts as a connector?",
		a: "Each configured data source counts as one connector — e.g. one GitHub org, one Notion workspace. Multiple repos inside the same org connector count as one.",
	},
	{
		q: "How is storage measured?",
		a: "Total compressed size of all blobs in R2 for your account, including pre-sync snapshots. Deleted projects are purged within 24 hours.",
	},
	{
		q: "Can I switch plans at any time?",
		a: "Yes. Upgrades take effect immediately and are pro-rated. Downgrades take effect at the end of the current billing period.",
	},
	{
		q: "Who handles billing?",
		a: "Polar acts as our Merchant of Record and handles checkout, taxes, invoices, and cancellation. You'll see 'Polar · TekBreed' on your statement.",
	},
	{
		q: "Is there an annual discount?",
		a: "Not yet, but we're planning to introduce one. Join the mailing list (below) and we'll notify you.",
	},
];

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "Pricing — TekMemo Cloud" },
		{
			name: "description",
			content:
				"Simple, transparent pricing. Pay for storage and the features you use. Billed through Polar.",
		},
	];
}

export default function Pricing(_props: Route.ComponentProps) {
	return (
		<Section className="py-20">
			<header className="relative flex flex-col gap-4 text-center">
				<div className="mx-auto flex items-center gap-2.5">
					<span
						aria-hidden
						className="size-1.5 rounded-full bg-primary animate-pulse-dot"
					/>
					<span className="eyebrow text-primary">Pricing</span>
				</div>
				<h1 className="display mx-auto max-w-2xl text-balance text-4xl text-foreground sm:text-5xl">
					Simple, transparent pricing
				</h1>
				<p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
					No seat fees. No per-connector surcharges. Pay for storage and the
					features you use.
				</p>
			</header>

			<div className="relative mt-14 grid gap-6 lg:grid-cols-3">
				{PLANS.map((plan) => (
					<Card
						key={plan.name}
						className={cn({
							"border border-primary/40 lg:-mt-4 lg:mb-4 bg-muted/10":
								plan.highlight,
							"opacity-80": plan.soon,
						})}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="font-mono text-lg font-semibold text-foreground">
									{plan.name}
								</CardTitle>
								{plan.highlight && (
									<Badge className="bg-primary text-primary-foreground hover:bg-primary text-xs">
										Popular
									</Badge>
								)}
								{plan.soon && (
									<Badge variant="secondary" className="text-xs">
										Coming soon
									</Badge>
								)}
							</div>
							<div className="mt-4 flex items-baseline gap-1">
								<span className="display text-5xl text-foreground">
									{plan.price}
								</span>
								<span className="text-sm text-muted-foreground">
									{plan.period}
								</span>
							</div>
							<CardDescription className="text-xs mt-2">
								{plan.desc}
							</CardDescription>
						</CardHeader>

						<CardContent className="border-t border-border/40 pt-6">
							<ul className="space-y-2.5">
								{plan.features.map((f) => (
									<li
										key={f.text}
										className={cn("flex items-center gap-2.5 text-sm", {
											"text-muted-foreground/50 line-through": !f.included,
										})}
									>
										{f.included ? (
											<Check className="w-4 h-4 text-primary shrink-0" />
										) : (
											<span className="w-4 h-4 shrink-0 text-center text-muted-foreground/30">
												—
											</span>
										)}
										<span className="text-muted-foreground">{f.text}</span>
									</li>
								))}
							</ul>
						</CardContent>

						<CardFooter className="pt-6">
							{plan.soon ? (
								<Button variant="outline" className="w-full" disabled>
									{plan.cta}
								</Button>
							) : (
								<Button
									asChild
									className="w-full gap-1.5"
									variant={plan.highlight ? "default" : "outline"}
								>
									<Link to={plan.ctaHref}>
										{plan.cta}
										<ArrowRight className="size-4" />
									</Link>
								</Button>
							)}
						</CardFooter>
					</Card>
				))}
			</div>

			{/* Teams notify */}
			<div id="teams-notify" className="relative mt-20 max-w-lg mx-auto">
				<Card className="bg-muted/20">
					<CardHeader className="text-center">
						<CardTitle className="text-lg">
							Get notified when Teams launches
						</CardTitle>
						<CardDescription className="text-sm">
							Teams is coming. Leave your email and we'll notify you when it
							goes live — price locked at $24/mo.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-2">
						<Input
							type="email"
							placeholder="you@example.com"
							className="bg-background"
						/>
						<Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/95">
							Notify me
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* FAQ */}
			<div className="max-w-2xl mx-auto mt-20">
				<h2 className="text-center mb-8 display text-2xl font-bold">
					Pricing FAQ
				</h2>
				<div className="space-y-3">
					{FAQS.map((item) => (
						<Card key={item.q}>
							<CardContent className="flex items-start gap-3 pt-6">
								<HelpCircle className="w-4 h-4 text-primary/80 mt-0.5 shrink-0" />
								<div>
									<h4 className="font-semibold text-sm mb-1 text-foreground">
										{item.q}
									</h4>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{item.a}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</Section>
	);
}
