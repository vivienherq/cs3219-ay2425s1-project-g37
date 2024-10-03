# syntax=docker/dockerfile:1.7-labs
# Above for the --parents flag in COPY, https://stackoverflow.com/a/78393564

FROM node:20-alpine AS raw

FROM raw AS base
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm install -g bun
ENV PATH="$PATH:/root/.bun/bin"

FROM base AS installer
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY --parents apps/*/package.json /temp/dev/
COPY --parents packages/*/package.json /temp/dev/
COPY --parents services/*/package.json /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=installer /temp/dev/node_modules ./node_modules
# We don't need to do this since Bun can run TypeScript files directly
# RUN bun build --filter=@peerprep/questions-service

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 peerprep
RUN adduser --system --uid 1001 peerprep
USER peerprep

COPY --chown=peerprep:peerprep --from=builder . /app/

EXPOSE $PORT
CMD cd app && ls -lAh && cat package.json && bun start --filter=@peerprep/questions-service
