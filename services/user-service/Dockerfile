ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim AS build

ARG BUN_VERSION=1.1.28

WORKDIR /build

# Install Bun in the specified version
RUN apt update && apt install -y bash curl unzip && \
 curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}
ENV PATH="/root/.bun/bin:${PATH}"
# ENV PATH="${PATH}:/root/.bun/bin"

#
# Copy the lock file and app manifest, then install
# the dependencies, including the dev dependencies
#
# COPY bun.lockb package.json ./
COPY . . 

RUN bun install 
# --frozen-lockfile

# Copy the application sources into the build stage
# COPY . .

# ADJUST: Build your application
RUN bun run build

RUN ls -la /build
#
# After building the application, we will remove the node_modules
# directory and install only the production dependencies.
#
# Note that clearing the Bun package cache is necessary because I encountered
# extremely slow install times during building the image. This issue seems to be
# related to: https://github.com/oven-sh/bun/issues/4066
#
# RUN rm -rf node_modules && \
#   rm -rf /root/.bun/install/cache/ && \
#   bun install --frozen-lockfile --production

#
# Optional step: Here we will prune all unnecessary files from our
# node_modules directory, such as markdown and TypeScript source files,
# to further reduce the container image size.
#
# RUN curl -sf https://gobinaries.com/tj/node-prune | sh && \
#     node-prune

FROM node:${NODE_VERSION}-slim AS distribution
WORKDIR /app

COPY --from=build /root/.bun /root/.bun
ENV PATH="/root/.bun/bin:${PATH}"
ENV NODE_ENV="production"


# ADJUST: Copy application build artifacts.
COPY --from=build --chown=node:node /build/node_modules ./node_modules
# COPY --from=build --chown=node:node /build/services ./services
COPY --from=build --chown=node:node /build/services/user-service ./user-service
COPY --from=build --chown=node:node /build/packages ./packages
COPY --from=build --chown=node:node /build/package.json .

EXPOSE 3002

RUN chown -R node:node /app

USER node

CMD ["/root/.bun/bin/bun", "run", "./user-service/src/index.js"]
# CMD [ "bun", "run", "start" ]
# CMD [ "bun", "start" ]
