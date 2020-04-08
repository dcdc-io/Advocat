#!/bin/bash

if [ -z "$DEPLOY_KEY" ]
then
    echo "error: DEPLOY_KEY not set to path of ppk file"
    exit -1
fi

if [ -z "$DEPLOY_USER" ]
then
    echo "error: DEPLOY_USER not set"
    exit -1
fi

if [ -z "$DEPLOY_TARGET" ]
then
    echo "error: DEPLOY_TARGET not set to a name or ip"
    exit -1
fi

if [ -z "$DEPLOY_ENV" ]
then
    echo "error: DEPLOY_ENV not set to a value, e.g. 'dev' or 'prod'"
    exit -1
fi

if [ -z "$DOMAIN" ]
then
    echo "error: DOMAIN not set to a value, e.g. 'advocat.dev'"
    exit -1
fi

TAG=$(git describe --tags)

# build alive
(cd alive && docker build -t alive .)
docker save -o alive.tar alive:latest

# build advocat
docker build -t advocat .
docker tag advocat:latest advocat:$TAG
FILE=advocat.release.$TAG.tar
docker save -o $FILE advocat:$TAG

# build deploy
(cd deploy && ./pre-build.sh && docker build -t deploy .)
docker save -o deploy.tar deploy:latest

# move alive tar to /app and load into docker
#echo "info: loading alive.tar to docker images"
#(cat /alive.tar | docker load)

# load deploy
#echo "info: loading deploy.tar to docker images"
#(cat /deploy.tar | docker load)

# move incoming tar to /app and load into docker
#echo "info: loading $FILE to docker images"
#ADVOCAT_TAG=$((cat /$FILE | docker load) | cut -d ' ' -f3)

pscp -i $DEPLOY_KEY $FILE $DEPLOY_USER@$DEPLOY_TARGET:/$FILE
pscp -i $DEPLOY_KEY alive.tar $DEPLOY_USER@$DEPLOY_TARGET:/alive.tar
pscp -i $DEPLOY_KEY deploy.tar $DEPLOY_USER@$DEPLOY_TARGET:/deploy.tar
pscp -i $DEPLOY_KEY ./scripts/setup.prod.sh $DEPLOY_USER@$DEPLOY_TARGET:/setup.prod.sh
pscp -i $DEPLOY_KEY config.$DEPLOY_ENV.json $DEPLOY_USER@$DEPLOY_TARGET:/config.$DEPLOY_ENV.json
pscp -i $DEPLOY_KEY ./pwa/static/manifest.dev.json $DEPLOY_USER@$DEPLOY_TARGET:/manifest.dev.json

# 

plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$DEPLOY_TARGET "chmod +x /setup.prod.sh"
plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$DEPLOY_TARGET "FILE=/$FILE DEPLOY_ENV=$DEPLOY_ENV DOMAIN=$DOMAIN /setup.prod.sh"

# DEPLOY_KEY=/path/to/ppk
# DEPLOY_USER=root
# DEPLOY_TARGET=<ip address>
# DEPLOY_ENV=dev
# DOMAIN=advocat.dev
