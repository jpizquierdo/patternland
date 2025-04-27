# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG VITE_API_URL=${VITE_API_URL}

RUN npm run build


# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Copy a script that generates config.json based on environment variables
COPY generate-config.sh /usr/share/nginx/html/generate-config.sh
RUN chmod +x /usr/share/nginx/html/generate-config.sh

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf
# Execute the script during container startup
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/generate-config.sh && nginx -g 'daemon off;'"]
