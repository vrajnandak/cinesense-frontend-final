# ---------- Stage 1: Build the frontend ----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci 

# Copy the entire project
COPY . .

# Build the Vite project
RUN npm run build



# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (optional)
# Uncomment if you add nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["/bin/sh", "-c", "\
  if [ -z \"$VITE_API_KEY\" ]; then \
    echo 'ERROR: VITE_API_KEY is not set' >&2; \
    exit 1; \
  fi; \
  sed -i \"s|__VITE_API_KEY__|$VITE_API_KEY|g\" /usr/share/nginx/html/env.js && \
  exec nginx -g 'daemon off;' \
"]
