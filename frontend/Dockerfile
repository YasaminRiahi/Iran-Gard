# STAGE 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json first (better caching)
COPY frontend/package.json ./
RUN npm install

# Copy the rest of the source code
COPY frontend/ .

# Accept build argument
ARG API_BASE_URL

# Generate config.json with API base URL
RUN echo '{"API_BASE_URL": "'${API_BASE_URL}'"}' > src/config.json

# Run the Vite Build
# This creates a /app/dist folder with hashed files (e.g., assets/index-d4f2a.js)
RUN npm run build

# STAGE 2: Serve
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the built files from dist
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 443

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]