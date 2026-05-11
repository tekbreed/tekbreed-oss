import { createInMemoryTekMemoServer } from "@tekmemo/server";

export interface Env {
	TEKMEMO_API_KEY?: string;
	TEKMEMO_API_KEYS?: string;
	TEKMEMO_DEFAULT_PROJECT_ID?: string;
}

export default {
	fetch(request: Request, env: Env, executionContext: ExecutionContext) {
		const apiKeys = (env.TEKMEMO_API_KEYS ?? env.TEKMEMO_API_KEY ?? "")
			.split(",")
			.map((value) => value.trim())
			.filter(Boolean);

		const app = createInMemoryTekMemoServer({
			apiKeys,
			defaultProjectId: env.TEKMEMO_DEFAULT_PROJECT_ID ?? "default",
		});

		return app.fetch(request, env, executionContext);
	},
};
