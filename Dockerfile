# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY ../../Downloads/final-configs-v2/final/angular-app .
RUN npm run build -- --configuration production

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist/sakai-ng/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
