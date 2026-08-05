FROM node:20-slim

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy pre-compiled server bundle
COPY dist-server ./dist-server

# Expose port
EXPOSE 8080
ENV PORT=8080

CMD ["node", "dist-server/server.cjs"]
