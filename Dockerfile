# Use the official Node.js 20 runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Install Prisma CLI
RUN npm install prisma

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Create a non-root user to run the app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]