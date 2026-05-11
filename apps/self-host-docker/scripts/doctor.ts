const baseUrl = process.env.TEKMEMO_BASE_URL ?? "http://localhost:8787";
const apiKey = process.env.TEKMEMO_API_KEY;
const headers = apiKey ? { authorization: `Bearer ${apiKey}` } : undefined;

const health = await fetch(`${baseUrl}/healthz`);
if (!health.ok)
	throw new Error(`TekMemo server health check failed: ${health.status}`);

const readiness = await fetch(`${baseUrl}/readyz`);
if (!readiness.ok)
	throw new Error(`TekMemo server readiness check failed: ${readiness.status}`);

const projects = await fetch(`${baseUrl}/api/v1/projects`, { headers });
if (!projects.ok)
	throw new Error(`TekMemo API key/project check failed: ${projects.status}`);

console.log("TekMemo Docker self-host doctor passed.");
