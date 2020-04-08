FROM node:12-alpine

COPY package.dockerfile.json package.json
COPY pouchdb-security pouchdb-security

RUN yarn

COPY . .