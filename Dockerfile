FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files to the html directory
COPY static /usr/share/nginx/html

# Expose port 80
EXPOSE 80
