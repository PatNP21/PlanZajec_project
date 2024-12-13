# Use Node.js image to build the app
FROM node:16-alpine AS build

# Set working directory
WORKDIR ./

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files and build the app
COPY . .
RUN npm run build

# Use Nginx to serve the app
FROM nginx:stable-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to Nginx's HTML directory
COPY --from=build ./build /usr/share/nginx/html

# Expose port 80
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
