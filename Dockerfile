# stage: 1 - build the frontend react app
FROM node as react-build-frontend

WORKDIR /usr/src/frontend
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .
RUN yarn

COPY ./frontend .
RUN yarn build

#stage 2 - build the admin react app
FROM node as react-build-admin
WORKDIR /usr/src/admin
COPY ./admin/package.json .
COPY ./admin/yarn.lock .
RUN yarn

COPY ./admin .
RUN yarn build

# stage: 3 — the production environment
FROM nginx

# The NGINX image is configured to send the main NGINX access and error logs to the Docker log collector by default.
# To keep the nginx logs inside the container, un-comment the next lines :
#RUN unlink /var/log/nginx/access.log \
#    && unlink /var/log/nginx/error.log \
#    && touch /var/log/nginx/access.log \
#    && touch /var/log/nginx/error.log \
#    && chown nginx /var/log/nginx/*log \
#    && chmod 644 /var/log/nginx/*log

# To use Nginx amplify, see https://www.nginx.com/blog/monitoring-microservices-docker-containers-nginx-amplify/

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=react-build-frontend /usr/src/frontend/build /usr/src/frontend/
COPY --from=react-build-admin /usr/src/admin/build /usr/src/admin/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
