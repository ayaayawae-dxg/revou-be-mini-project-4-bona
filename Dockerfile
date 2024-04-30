# Use official node latest as the base image
FROM node:latest

# Set working directory inside container
WORKDIR /app

# Install app dependencues
COPY package.json .

RUN npm install

# Copy content into container at /app
COPY . .

# Open port 5000 to outside container
EXPOSE 5000

# Command to run
CMD ["npm", "run", "start"]