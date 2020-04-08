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

DEPLOY_TARGETS=$(echo $DEPLOY_TARGET | tr ";" "\n")
SECONDARY=""
for CURRENT_DEPLOY_TARGET in $DEPLOY_TARGETS
do
    # copy images
    pscp -i $DEPLOY_KEY $FILE $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/$FILE
    pscp -i $DEPLOY_KEY alive.tar $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/alive.tar
    pscp -i $DEPLOY_KEY deploy.tar $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/deploy.tar

    # load images
    plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$CURRENT_DEPLOY_TARGET "cat /$FILE | docker load"
    plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$CURRENT_DEPLOY_TARGET "cat /alive.tar | docker load"
    plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$CURRENT_DEPLOY_TARGET "cat /deploy.tar | docker load"


    pscp -i $DEPLOY_KEY ./scripts/setup.prod.sh $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/setup.prod.sh
    pscp -i $DEPLOY_KEY config.$DEPLOY_ENV.json $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/config.$DEPLOY_ENV.json
    pscp -i $DEPLOY_KEY ./pwa/static/manifest.dev.json $DEPLOY_USER@$CURRENT_DEPLOY_TARGET:/manifest.dev.json

    #
    plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$CURRENT_DEPLOY_TARGET "chmod +x /setup.prod.sh"
    plink -batch -i $DEPLOY_KEY $DEPLOY_USER@$CURRENT_DEPLOY_TARGET "SECONDARY_DEPLOY=$SECONDARY ADVOCAT_TAG=advocat:$TAG DEPLOY_ENV=$DEPLOY_ENV DOMAIN=$DOMAIN /setup.prod.sh"
    
    # prevents deploying to secondary instances
    SECONDARY=TRUE
done


# DEPLOY_KEY=/path/to/ppk
# DEPLOY_USER=root
# DEPLOY_TARGET=<ip address>
# DEPLOY_ENV=dev
# DOMAIN=advocat.dev
