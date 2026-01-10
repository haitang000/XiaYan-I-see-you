FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files content to the html directory
# Note: copying a directory to a directory copies the contents
COPY static /usr/share/nginx/html

# Copy the generation script
COPY generate_photos_list.sh /docker-entrypoint.d/40-generate-photos-list.sh

# Make executable
RUN chmod +x /docker-entrypoint.d/40-generate-photos-list.sh
