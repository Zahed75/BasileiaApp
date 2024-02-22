# Use the official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose port 8080 (or the port your application runs on)
EXPOSE 8080

# Define the command to start the application
CMD ["npm","node" "index.js"]
