# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci

# Now copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
