FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages ./packages
COPY apps/self-host-node ./apps/self-host-node
RUN pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm --filter @tekbreed/tekmemo-server build
RUN pnpm --filter @tekbreed/tekmemo-self-host-node build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app ./
EXPOSE 8787
CMD ["pnpm", "--filter", "@tekbreed/tekmemo-self-host-node", "server"]
