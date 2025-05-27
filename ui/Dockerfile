# Use Node.js base image
FROM node:18

ENV BROWSER=none

# Set working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port Vite dev server runs on
EXPOSE 3000

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]