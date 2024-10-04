# syntax=docker/dockerfile:1.7-labs
# Above for the --parents flag in COPY, https://stackoverflow.com/a/78393564

FROM peerprep-base AS installer
RUN mkdir -p /temp/dev
COPY package.json bun.lockb turbo.json /temp/dev/
COPY --parents apps/*/package.json /temp/dev/
COPY --parents packages/*/package.json /temp/dev/
COPY --parents services/*/package.json /temp/dev/
COPY packages/db/prisma/schema.prisma /temp/dev/packages/db/prisma/
RUN cd /temp/dev && bun install --frozen-lockfile && bun db:generate
