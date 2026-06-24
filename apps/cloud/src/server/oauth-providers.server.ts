/**
 * OAuth provider availability — single source of truth for which social
 * providers are configured (SC4.1, A2).
 *
 * `auth.ts` registers providers from env; the UI needs the same knowledge to
 * decide which buttons to render. Deriving both from this one helper keeps them
 * in lock-step — a provider shows its button iff `createAuth` will actually
 * accept it, so a misconfigured provider never surfaces a dead button.
 *
 * @see {@link ./auth} `resolveSocialProviders` — the auth-side mirror.
 */

import type { CloudWorkerEnv } from "./env";

/** The provider ids Better Auth expects in `/sign-in/social` body. */
export type OAuthProviderId = "github" | "google";

/** Which providers are wired (creds both present) for this env, in UI order. */
export function enabledOAuthProviders(env: CloudWorkerEnv): OAuthProviderId[] {
	const providers: OAuthProviderId[] = [];
	if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
		providers.push("github");
	}
	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		providers.push("google");
	}
	return providers;
}
