FROM node:18

# Create app directory
WORKDIR /app

#Expose port and start application
EXPOSE 8080
CMD ["npm", "start"]