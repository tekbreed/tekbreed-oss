# TekMemo Docker Compose self-host template

This is the batteries-included local/VPS deployment bundle for the TekMemo memory server.

It packages the portable `apps/self-host-node` runtime with:

- `tekmemo-api`: the Hono HTTP API.
- `tekmemo-worker`: the background worker process.
- `postgres`: Postgres with pgvector.
- `minio`: S3-compatible object storage.

Start it:

```bash
cp apps/self-host-docker/.env.example apps/self-host-docker/.env
docker compose -f apps/self-host-docker/docker-compose.yml up --build
```

The API listens on `http://localhost:8787`.

Use Docker Compose for local development, private servers, and VPS deployments. For Railway/Fly/Render-style hosts, deploy `apps/self-host-node/Dockerfile` directly instead of the Compose file.
