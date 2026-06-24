/**
 * Server-side session resolution for the dashboard.
 *
 * Thin seam over Better Auth's `api.getSession`: given the React Router loader
 * context, construct the per-request auth instance and read the session cookie.
 * Returns the authenticated user (plus their billing account) or `null`, and a
 * `requireUser` variant that redirects to `/login` when unauthenticated — the
 * two ergonomics dashboard loaders need.
 *
 * Per-request construction mirrors {@link createDb}: the auth instance is built
 * from `context.cloudflare.env` + a fresh drizzle client each request, then the
 * mailer is injected. Nothing here is module-level state.
 *
 * @see {@link ./auth} — the factory this calls.
 * @see {@link ./email} — the mailer injected into the factory.
 */
import { eq } from "drizzle-orm";
import { redirect } from "react-router";
import { createDb, type Database } from "../db/index.server";
import { accounts } from "../db/schema";
import { createAuth } from "./auth";
import { createMagicLinkMailer } from "./email";
import type { CloudWorkerEnv } from "./env";

/** Dashboard-facing user identity: the Better Auth user + their billing account. */
export interface SessionUser {
	id: string;
	email: string;
	name: string;
	image: string | null;
	emailVerified: boolean;
	/** Billing account (FK-linked per Q decision); null only if provisioning failed. */
	accountId: string | null;
	plan: "free" | "pro" | "teams" | null;
}

/**
 * Resolves the signed-in user (plus billing account) from the request, or
 * `null` when unauthenticated. Safe to call on any loader/action — it never
 * throws on a missing/expired session, only on genuine DB errors.
 *
 * @param request the incoming request (carries the session cookie).
 * @param env     per-request Worker env.
 */
export async function getSessionUser(
	request: Request,
	env: CloudWorkerEnv,
): Promise<SessionUser | null> {
	const db = createDb(env);
	const auth = createAuth(env, db, createMagicLinkMailer(env));

	// Better Auth validates the session cookie from the request headers and
	// returns `{ session, user }`, or `null` when there is no valid session.
	const result = await auth.api.getSession({ headers: request.headers });
	if (!result) return null;

	const { user } = result;

	// One join to attach the billing identity (Q decision: separate, FK-linked).
	// Left join semantics — an account may be missing if provisioning raced, so
	// we degrade gracefully rather than blocking the user out of their dashboard.
	const account = await resolveAccount(db, user.id);

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		image: user.image ?? null,
		emailVerified: user.emailVerified,
		accountId: account?.id ?? null,
		plan: account?.plan ?? null,
	};
}

/**
 * Resolves the signed-in user or throws a redirect to `/login`. Use in loaders
 * that require authentication; `getSessionUser` is the non-throwing variant.
 *
 * The redirect carries the current path as `?redirect=` so login can bounce
 * back. React Router loaders signal redirects by throwing `redirect(...)`.
 *
 * @param request the incoming request.
 * @param env     per-request Worker env.
 */
export async function requireUser(
	request: Request,
	env: CloudWorkerEnv,
): Promise<SessionUser> {
	const user = await getSessionUser(request, env);
	if (user) return user;

	const { pathname, search } = new URL(request.url);
	const redirectTo = `${pathname}${search}`;
	throw redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
}

/** Looks up the billing account for `userId`, or `null` if none exists yet. */
async function resolveAccount(
	db: Database,
	userId: string,
): Promise<{ id: string; plan: "free" | "pro" | "teams" } | null> {
	const rows = await db
		.select({ id: accounts.id, plan: accounts.plan })
		.from(accounts)
		.where(eq(accounts.userId, userId))
		.limit(1);
	return rows[0] ?? null;
}
