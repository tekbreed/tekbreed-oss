import {
	AlertTriangle,
	CheckCircle2,
	Copy,
	Eye,
	EyeOff,
	KeyRound,
	Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { createDb } from "~/db/index.server";
import { getEnv } from "~/server/context.server";
import type { ApiKeyView } from "~/server/queries";
import {
	createApiKey,
	getAccountForUser,
	listApiKeysForAccount,
	revokeApiKey,
} from "~/server/queries";
import { requireUser } from "~/server/session.server";
import { formatDate } from "~/utils/format";
import { PageHeader } from "./+components/page-header";
import type { Route } from "./+types/api-keys";

/**
 * API keys (SC3.x). Real DB-backed provisioning + revocation. The cloud stores
 * ONLY a salted sha256 lookup hash — the raw `tm_…` key is returned by the
 * create action EXACTLY ONCE and surfaced in a one-time reveal dialog; once the
 * dialog closes the key is unrecoverable (revoke + re-create is the only path).
 *
 * Both mutations are ownership-guarded (`accountId` scopes every write), so a
 * key id from elsewhere cannot touch another account's key. There is no
 * `lastSeen` field (tracking is deferred), so the list shows Created + Status
 * only. The list refreshes via loader revalidation after each action.
 */

export function meta(_: Route.MetaArgs) {
	return [{ title: "API Keys — TekMemo Cloud" }];
}

/** Server data: the account's API keys, newest first. */
export interface ApiKeysLoaderData {
	keys: ApiKeyView[];
}

/** Action response — a discriminated union over `intent`. */
export type ApiKeyActionData =
	| { intent: "create"; rawKey: string; row: ApiKeyView }
	| { intent: "revoke"; ok: boolean }
	| { intent: "error"; ok: false };

export async function loader({
	request,
	context,
}: Route.LoaderArgs): Promise<ApiKeysLoaderData> {
	const user = await requireUser(request, getEnv(context));
	const db = createDb(getEnv(context));
	const account = await getAccountForUser(db, user.id);
	const keys = account ? await listApiKeysForAccount(db, account.id) : [];
	return { keys };
}

/**
 * Create + revoke. Ownership is re-resolved server-side on every submission
 * (the signed-in account must own the key being revoked). Create returns the
 * one-time raw key so the route can surface it in the reveal dialog; revoke is
 * idempotent (revoking an already-revoked or foreign key is a no-op).
 */
export async function action({
	request,
	context,
}: Route.ActionArgs): Promise<ApiKeyActionData> {
	const user = await requireUser(request, getEnv(context));
	const db = createDb(getEnv(context));
	const form = await request.formData();
	const intent = String(form.get("intent") ?? "");

	const account = await getAccountForUser(db, user.id);
	if (!account) {
		return { intent: "error", ok: false };
	}

	if (intent === "create") {
		const label = String(form.get("label") ?? "");
		const { rawKey, row } = await createApiKey(db, {
			accountId: account.id,
			label,
			salt: getEnv(context).TEKMEMO_API_KEY_SALT ?? "",
		});
		return { intent: "create", rawKey, row };
	}

	if (intent === "revoke") {
		const keyId = String(form.get("keyId") ?? "");
		if (keyId) {
			await revokeApiKey(db, account.id, keyId);
		}
		return { intent: "revoke", ok: true };
	}

	return { intent: "error", ok: false };
}

export default function ApiKeysPage({ loaderData }: Route.ComponentProps) {
	const { keys } = loaderData;
	const createFetcher = useFetcher<ApiKeyActionData>();
	const revokeFetcher = useFetcher<ApiKeyActionData>();

	const [showCreate, setShowCreate] = useState(false);
	const [label, setLabel] = useState("");
	const [createdKey, setCreatedKey] = useState<{
		rawKey: string;
		label: string;
	} | null>(null);
	const [copied, setCopied] = useState(false);
	const [showKey, setShowKey] = useState(false);
	const [revokeId, setRevokeId] = useState<string | null>(null);

	// The raw key is shown exactly once: when the create action lands, capture it
	// into local state to drive the reveal dialog, and tear down the create form.
	// Once dismissed, the key is gone forever — only its hash is persisted.
	useEffect(() => {
		if (createFetcher.data?.intent === "create") {
			setCreatedKey({
				rawKey: createFetcher.data.rawKey,
				label: createFetcher.data.row.label ?? "Unlabeled",
			});
			setShowCreate(false);
			setLabel("");
		}
	}, [createFetcher]);

	// Optimistically grey a key the moment its revoke submission fires, before
	// the action returns and the loader revalidates.
	const revokingId = revokeFetcher.formData?.get("keyId");
	const isRevoking = (id: string) =>
		revokingId != null && String(revokingId) === id;

	const copy = (text: string) => {
		navigator.clipboard.writeText(text).catch(() => {});
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="p-6">
			<PageHeader
				title="API Keys"
				subtitle="Account-wide. Keys authenticate all sync operations."
				action={
					<Button
						size="sm"
						onClick={() => setShowCreate(true)}
						className="h-9 text-xs"
					>
						<Plus className="mr-1.5 h-4 w-4" /> New key
					</Button>
				}
			/>

			<div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
				<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
				<p className="text-xs leading-normal text-primary/80">
					Raw API keys are shown <strong>only once at creation</strong>. We
					store a salted SHA-256 hash. Treat keys like passwords — never commit
					them to version control.
				</p>
			</div>

			<Card>
				<CardContent className="p-0">
					{keys.length === 0 ? (
						<div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
							<KeyRound className="h-8 w-8 text-muted-foreground/40" />
							<p className="text-sm font-medium text-foreground">
								No API keys yet
							</p>
							<p className="max-w-sm text-xs text-muted-foreground">
								Create a key to authenticate{" "}
								<code className="font-mono text-[10px]">tekmemo push</code> from
								your machines and CI.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="px-5 py-3 text-xs">Label</TableHead>
									<TableHead className="px-5 py-3 text-xs hidden sm:table-cell">
										Key
									</TableHead>
									<TableHead className="px-5 py-3 text-xs hidden md:table-cell">
										Created
									</TableHead>
									<TableHead className="px-5 py-3 text-xs">Status</TableHead>
									<TableHead className="px-5 py-3 text-xs text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{keys.map((key) => (
									<TableRow
										key={key.id}
										className={
											key.revokedAt || isRevoking(key.id) ? "opacity-50" : ""
										}
									>
										<TableCell className="px-5 py-3 text-xs">
											<div className="flex items-center gap-2">
												<KeyRound className="h-4 w-4 shrink-0 text-primary/80" />
												<span className="font-medium text-foreground">
													{key.label ?? "Unlabeled"}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-5 py-3 text-xs hidden sm:table-cell">
											<code className="font-mono text-[10px] text-muted-foreground">
												{key.lastFour ? `tm_…${key.lastFour}` : "tm_…"}
											</code>
										</TableCell>
										<TableCell className="px-5 py-3 text-xs text-muted-foreground hidden md:table-cell">
											{formatDate(key.createdAt)}
										</TableCell>
										<TableCell className="px-5 py-3 text-xs">
											{key.revokedAt ? (
												<Badge
													variant="destructive"
													className="h-5 px-1.5 py-0 text-[10px] leading-none"
												>
													Revoked
												</Badge>
											) : (
												<Badge
													variant="outline"
													className="h-5 px-1.5 py-0 text-[10px] leading-none border-primary/30 bg-primary/5 text-primary"
												>
													Active
												</Badge>
											)}
										</TableCell>
										<TableCell className="px-5 py-3 text-right text-xs">
											{!key.revokedAt && (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 text-xs text-destructive hover:bg-destructive/5 hover:text-destructive"
													onClick={() => setRevokeId(key.id)}
												>
													Revoke
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Create key dialog */}
			<Dialog open={showCreate} onOpenChange={setShowCreate}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-base font-semibold">
							Create API key
						</DialogTitle>
						<DialogDescription className="text-xs">
							Give this key a label so you know which machine it belongs to.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<div className="space-y-1.5">
							<Label htmlFor="key-label" className="text-xs">
								Label
							</Label>
							<Input
								id="key-label"
								placeholder="e.g. laptop, ci, work-desktop"
								value={label}
								onChange={(e) => setLabel(e.target.value)}
								className="h-9 text-xs"
							/>
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							size="sm"
							className="h-9 text-xs"
							onClick={() => setShowCreate(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={() =>
								createFetcher.submit(
									{ intent: "create", label },
									{ method: "post" },
								)
							}
							disabled={!label || createFetcher.state !== "idle"}
							size="sm"
							className="h-9 text-xs"
						>
							{createFetcher.state !== "idle" ? "Creating…" : "Create key"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* One-time reveal dialog */}
			<Dialog
				open={!!createdKey}
				onOpenChange={() => {
					setCreatedKey(null);
					setShowKey(false);
				}}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-base font-semibold">
							Your new API key — save it now
						</DialogTitle>
						<DialogDescription className="text-xs">
							This is the only time you'll see the full key. Copy it before
							closing.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
							<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
							<p className="text-[11px] leading-normal text-primary/95">
								You won't see this key again after closing this dialog.
							</p>
						</div>
						<div className="rounded-lg border border-border/40 bg-muted/40 p-3">
							<p className="mb-1.5 text-[10px] text-muted-foreground">
								Label:{" "}
								<strong className="text-foreground">{createdKey?.label}</strong>
							</p>
							<div className="flex items-center gap-2">
								<code className="flex-1 break-all rounded border border-border/40 bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
									{showKey ? createdKey?.rawKey : `tm_${"•".repeat(42)}`}
								</code>
								<div className="flex shrink-0 gap-1">
									<button
										type="button"
										onClick={() => setShowKey((v) => !v)}
										className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
										title={showKey ? "Hide key" : "Show key"}
									>
										{showKey ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
									<button
										type="button"
										onClick={() => copy(createdKey?.rawKey ?? "")}
										className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
										title="Copy key"
									>
										{copied ? (
											<CheckCircle2 className="h-4 w-4 text-primary" />
										) : (
											<Copy className="h-4 w-4" />
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							className="h-9 w-full text-xs"
							onClick={() => {
								setCreatedKey(null);
								setShowKey(false);
							}}
						>
							I've copied it — close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Revoke confirm dialog */}
			<Dialog open={!!revokeId} onOpenChange={() => setRevokeId(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="text-base font-semibold">
							Revoke this key?
						</DialogTitle>
						<DialogDescription className="text-xs">
							Any machine using this key will get 401 errors on next sync. This
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							size="sm"
							className="h-9 text-xs"
							onClick={() => setRevokeId(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							size="sm"
							className="h-9 text-xs"
							disabled={revokeFetcher.state !== "idle"}
							onClick={() => {
								if (!revokeId) return;
								revokeFetcher.submit(
									{ intent: "revoke", keyId: revokeId },
									{ method: "post" },
								);
								setRevokeId(null);
							}}
						>
							{revokeFetcher.state !== "idle" ? "Revoking…" : "Revoke key"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
