#syntax=docker/dockerfile:1.2

ARG NODE_VERSION=21.6.2

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app
# Expose the port that the application listens on.
EXPOSE 3000

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
# Run the application.
CMD ["npm", "run", "dev"]

FROM base as staging
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY . .
# Run the application.
CMD node -r dotenv/config src/index.js

FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY . .
# Run the application.
CMD node -r dotenv/config src/index.js