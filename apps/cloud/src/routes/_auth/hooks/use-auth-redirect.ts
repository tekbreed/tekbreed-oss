import { useSearchParams } from "react-router";

/**
 * Get the `redirect` or `next` query param, or `/dashboard` by default.
 * @returns The redirect route
 */
export function useAuthRedirect() {
	const [params] = useSearchParams();
	return params.get("redirect") ?? params.get("next") ?? "/dashboard";
}
