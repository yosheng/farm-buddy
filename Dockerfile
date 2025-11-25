# Stage 1: Build stage
FROM node:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage with Nginx
FROM nginx:latest

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built dist directory from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set API target environment variable (can be overridden at runtime)
ENV VITE_API_TARGET=http://api:3000

EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]