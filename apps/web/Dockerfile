FROM node:20-bookworm-slim AS base
# Ensure OpenSSL and certificates are available for Prisma engines
# Install netcat for start.sh healthcheck
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates netcat-openbsd \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json* ./
RUN npm ci --legacy-peer-deps || npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
# Remove any previously generated Prisma engines and regenerate with correct targets
RUN rm -rf node_modules/.prisma \
  && npx prisma generate

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install Prisma CLI globally for runtime migrations
RUN npm install -g prisma \
  && prisma --version

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --home /home/nextjs nextjs
RUN mkdir -p /home/nextjs && chown -R nextjs:nodejs /home/nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy start script and make it executable
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh
USER root
RUN chmod +x /app/start.sh
USER nextjs

# Copy Prisma schema, client, and CLI for migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs

# Set npm cache directory to a writable location
ENV npm_config_cache=/home/nextjs/.npm

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
