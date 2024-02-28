FROM node:alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm ci
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 17001
CMD [ "npm", "run", "dev" ]