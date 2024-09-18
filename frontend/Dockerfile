# Build stage
FROM node:alpine3.18 as build
ARG VITE_APP_NODE_ENV
ARG VITE_APP_SERVER_BASE_URL

ENV VITE_APP_NODE_ENV=$VITE_APP_NODE_ENV
ENV VITE_APP_SERVER_BASE_URL=$VITE_APP_SERVER_BASE_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage with NGINX
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *

# Copy build files from the build stage
COPY --from=build /app/dist .

# Copy custom NGINX configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
