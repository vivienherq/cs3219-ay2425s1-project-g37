# syntax=docker/dockerfile:1.7-labs
# Above for the --parents flag in COPY, https://stackoverflow.com/a/78393564

FROM node:20 AS raw

ARG SERVICE_NAME
ENV SERVICE_NAME=$SERVICE_NAME
ARG SERVICE_DIRECTORY
ENV SERVICE_DIRECTORY=$SERVICE_DIRECTORY

FROM raw AS base
RUN npm install -g bun
ENV PATH="$PATH:/root/.bun/bin"

FROM base AS installer
RUN mkdir -p /temp/dev
COPY package.json bun.lockb turbo.json /temp/dev/
COPY --parents apps/*/package.json /temp/dev/
COPY --parents packages/*/package.json /temp/dev/
COPY --parents services/*/package.json /temp/dev/
COPY packages/db/prisma/schema.prisma /temp/dev/packages/db/prisma/
RUN cd /temp/dev && bun install --frozen-lockfile && bun db:generate

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=installer /temp/dev/node_modules ./node_modules
RUN bun run build --filter=$SERVICE_NAME

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 peerprep
RUN adduser --system --uid 1001 peerprep

# Turborepo needs to be able to write to this `.turbo/cache` folder to work, so we create it and
# allow the non-admin runner user to write to it.
RUN mkdir -p /app/.turbo/cache && chown -R peerprep:peerprep /app/.turbo

USER peerprep

# Replicate the package management structure
COPY --chown=peerprep:peerprep --from=builder /app/package.json /app/bun.lockb /app/turbo.json /app/.env /app/
COPY --chown=peerprep:peerprep --from=builder --parents /app/./apps/*/package.json /app/
COPY --chown=peerprep:peerprep --from=builder --parents /app/./packages/*/package.json /app/
COPY --chown=peerprep:peerprep --from=builder --parents /app/./services/*/package.json /app/
COPY --chown=peerprep:peerprep --from=builder /app/node_modules /app/node_modules

# Load the dist folder containing what we need to run
COPY --chown=peerprep:peerprep --from=builder /app/$SERVICE_DIRECTORY/dist /app/$SERVICE_DIRECTORY/dist

EXPOSE $PORT
CMD bun start --filter=$SERVICE_NAME
