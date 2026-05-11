const baseUrl = process.env.TEKMEMO_BASE_URL ?? "http://localhost:8787";
const apiKey = process.env.TEKMEMO_API_KEY;
const headers = apiKey ? { authorization: `Bearer ${apiKey}` } : undefined;

const health = await fetch(`${baseUrl}/healthz`);
if (!health.ok) throw new Error(`Health check failed: ${health.status}`);

const readiness = await fetch(`${baseUrl}/readyz`);
if (!readiness.ok)
	throw new Error(`Readiness check failed: ${readiness.status}`);
const readinessBody = await readiness.json();

const projects = await fetch(`${baseUrl}/api/v1/projects`, { headers });
if (!projects.ok) throw new Error(`Projects check failed: ${projects.status}`);

console.log("TekMemo self-host doctor passed.");
console.log(
	JSON.stringify(readinessBody.data?.checks ?? readinessBody, null, 2),
);
