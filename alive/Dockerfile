FROM node:12-alpine

RUN mkdir -p /app
COPY package.json /app/package.json
COPY index.js /app/index.js

WORKDIR /app
RUN yarn

EXPOSE 999

ENTRYPOINT node index.js