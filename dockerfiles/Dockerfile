# syntax=docker/dockerfile:1.7-labs
# Above for the --parents flag in COPY, https://stackoverflow.com/a/78393564

FROM node:20 AS raw

ARG SERVICE_NAME
ENV SERVICE_NAME=$SERVICE_NAME

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
USER peerprep

COPY --chown=peerprep:peerprep --from=builder . /app/

EXPOSE $PORT
CMD cd app && bun start --filter=$SERVICE_NAME
