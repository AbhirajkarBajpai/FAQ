# Use official Node.js image as base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json & package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the port 
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
