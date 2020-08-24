FROM node:12-alpine
RUN npm i -g nodemon
WORKDIR /usr/app
COPY exporter/package.json .
RUN yarn
COPY exporter .