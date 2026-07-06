# Stage 1: Build the client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client ./
RUN npm run build

# Stage 2: Build the server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --workspaces --omit=dev

COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/prisma ./server/prisma
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:deploy --workspace server && npm run start --workspace server"]
