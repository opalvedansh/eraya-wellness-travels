# Use Node.js LTS
FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy app source
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Expose port
EXPOSE 8080

# Start the server using tsx (no compilation needed!)
CMD ["pnpm", "tsx", "server/index.ts"]
