# Eurêka — reproducible, host-agnostic image: build with Node, serve with nginx.
# The resulting image is a plain static-file server on port 80; it runs the same
# on Coolify, plain Docker, or anywhere else.

# ---- build stage ---------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Install deps from the lockfile for a reproducible build (better layer caching too).
COPY package.json package-lock.json ./
RUN npm ci

# Build the static site into /app/dist (Vite emits root-relative, hashed assets).
COPY . .
RUN npm run build

# ---- serve stage ---------------------------------------------------------------
FROM nginx:1.27-alpine

# Our server config (SPA fallback + PWA-correct caching + manifest MIME).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# The built static site.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
