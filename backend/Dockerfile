# pull official base image
FROM node

# set work directory
WORKDIR /usr/src/backend

COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 5000


