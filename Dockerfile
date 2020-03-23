FROM node:12-alpine AS build
RUN apk add bash
RUN mkdir -p /build
COPY . /build
WORKDIR /build
RUN ./build.sh

FROM node:12-alpine AS prod
RUN mkdir -p /app
COPY --from=build /build/pwa/__sapper__/build /app/__sapper__/build
COPY --from=build /build/pwa/package.json /app/package.json
COPY --from=build /build/pwa/node_modules /app/node_modules
COPY --from=build /build/pwa/static /app/static
COPY --from=build /build/pwa/_utils /app/_utils
RUN mkdir -p /app/db && chmod 666 /app/db
WORKDIR /app

EXPOSE 3000

ENTRYPOINT node __sapper__/build