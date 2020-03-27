#!/bin/bash

TAG=$(git describe --tags)

docker build -t advocat .

docker tag advocat:latest advocat:$TAG

FILE=advocat.release.$TAG.tar

docker save -o $FILE advocat:$TAG

pscp -i $DEPLOY_KEY $FILE $DEPLOY_USER@$DEPLOY_TARGET:/$FILE

pscp -i $DEPLOY_KEY ./scripts/setup.prod.sh $DEPLOY_USER@$DEPLOY_TARGET:/setup.prod.sh

# pscp -i $DEPLOY_KEY alive.tar $DEPLOY_USER@DEPLOY_TARGET:/alive.tar

### SSH ->
#SSH=ssh -i $DEPLOY_KEY $DEPLOY_USER@$DEPLOY_TARGET 
#$SSH docker kill $(docker ps | grep alive | cut -d ' ' -f1)
#sleep 20
#$SSH (cd / && mkdir -p /app && mv /$FILE /app/$FILE)
#$SSH (cd /app && cat $FILE | docker load)
#$SSH (mkdir -p /data/advocat/db && chmod 666 /data/advocat/db)
#$SSH docker run -d -p 3000:3000 -v /data/advocat/db:/app/db -e VIRTUAL_PORT=3000 -e VIRTUAL_HOST=advocat.group -t advocat
#$SSH docker run -d -p 999:999 alive