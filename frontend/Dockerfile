FROM node:18-alpine AS builder

WORKDIR /app

# Copy frontend files
COPY frontend/ .

# Accept build argument
ARG API_BASE_URL

# Generate config.json with API base URL
RUN echo '{"API_BASE_URL": "'${API_BASE_URL}'"}' > src/config.json

# Install dependencies and build (if needed)
# Uncomment if you have a build step
# RUN npm install
# RUN npm run build

FROM nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy frontend files from builder
COPY --from=builder /app /usr/share/nginx/html

# Expose HTTPS port only
EXPOSE 443

# Skip nginx entrypoint scripts and start directly
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
