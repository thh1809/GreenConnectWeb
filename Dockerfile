# ============================
# Stage 1: Build Next.js app
# ============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

# Use the Next.js start command
CMD ["npm", "start"]
