import { redirect } from "react-router";

import { createDb } from "~/db/index.server";
import { createAuth } from "~/server/auth";
import { getEnv } from "~/server/context.server";
import { createMagicLinkMailer } from "~/server/email";
import {
	enabledOAuthProviders,
	type OAuthProviderId,
} from "~/server/oauth-providers.server";
import type { Route } from "./+types/start.$provider";

/** Path-param providers must validate against. */
const ALLOWED = new Set<OAuthProviderId>(["github", "google"]);

/**
 * Kick off an OAuth sign-in (SC4.1, A2).
 *
 * Better Auth's `/sign-in/social` is POST and returns `{ url, redirect }` — the
 * provider authorize URL. Rather than a client POST + JS redirect, this loader
 * calls it server-side and issues a real 302, so the button is a plain `<a>`
 * (no fetcher, no JS dependency, works without the client bundle). The OAuth
 * handshake then lands at `/api/auth/callback/<provider>` (Better Auth-owned,
 * dispatched in A1.7), which sets the session and redirects to `callbackURL`.
 *
 * Mirrors the loader-only guard style of {@link ../oauth/callback}.
 */
export async function loader({
	request,
	params,
	context,
}: Route.LoaderArgs): Promise<Response> {
	const provider = String(params.provider);

	// 404-shaped guard: an unconfigured provider must never reach Better Auth
	// (it would 404 there too, but with a less helpful surface).
	if (!ALLOWED.has(provider as OAuthProviderId)) {
		throw new Response("Unknown OAuth provider", { status: 404 });
	}
	const env = getEnv(context);
	if (!enabledOAuthProviders(env).includes(provider as OAuthProviderId)) {
		throw new Response("OAuth provider not configured", { status: 404 });
	}

	// Where to land after the Better Auth callback completes the session.
	const url = new URL(request.url);
	const callbackURL = url.searchParams.get("callbackURL") ?? "/dashboard";

	const db = createDb(env);
	const auth = createAuth(env, db, createMagicLinkMailer(env));

	const result = await auth.api.signInSocial({
		body: { provider, callbackURL },
		// `disableRedirect: false` → Better Auth returns the authorize URL; we
		// perform the redirect ourselves so it's a top-level navigation.
		headers: request.headers,
	});

	if (result.url) {
		throw redirect(result.url);
	}
	// No URL means something unexpected (the idToken branch, which we never
	// send). Fall back to login rather than rendering a blank route.
	throw redirect("/login");
}

export default function OAuthStart() {
	// Loader always throws (redirect/404); this never renders. Kept so React
	// Router treats it as a routable component-bearing file.
	return null;
}
