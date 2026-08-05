FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend and server
RUN npm run build

# Expose server port
EXPOSE 8080
ENV PORT=8080

# Start server
CMD ["node", "dist-server/server.cjs"]
