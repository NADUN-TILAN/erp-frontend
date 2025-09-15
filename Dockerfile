# Use official Node.js image (Debian-based for better SWC compatibility)
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port (default for Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]