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

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

COPY --from=react-build-frontend /usr/src/frontend/build /usr/src/frontend/
COPY --from=react-build-admin /usr/src/admin/build /usr/src/admin/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
