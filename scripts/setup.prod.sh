#!/bin/bash

# FILE=advocat.release.v0.1.2.tar DOMAIN=advocat.group ./setup.prod.sh

if [ -z "$FILE" ]
then 
    echo "error: FILE variable not set to location of .tar image"
    exit -1
fi
if [ -z "$DOMAIN" ]
then
    echo "error: DOMAIN variable not set to hostname of service"
    exit -2
fi

# test to see if proxy running
PROXY_CONTAINER=$(docker ps | grep nginx-proxy | cut -d ' ' -f1)
if [ -z "$PROXY_CONTAINER" ]
then
    echo "info: nginx-proxy is ok"
else
    echo "warn: nginx-proxy is missing, will be started"
    docker run -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock -t jwilder/nginx-proxy
    PROXY_CONTAINER=$(docker ps | grep jwilder/nginx-proxy | cut -d ' ' -f1)
fi

# kill "alive" health monitor and wait for 20 seconds
ALIVE=$(docker ps | grep alive | cut -d ' ' -f1)
if [ -z "$ALIVE" ]
then 
    docker kill $ALIVE
    echo "info: alive has been stopped, pausing for 20s"
    sleep 20
fi

# kill existing advocat
ADVOCAT_APP=$(docker ps | grep advocat | cut -d ' ' -f1)
if [ -z "$ADVOCAT_APP" ]
then
    docker kill $ADVOCAT_APP
    echo "info: advocat stopped"
else
    echo "info: advocat is not running, this is the first run"
fi

# move incoming tar to /app and load into docker
echo "info: loading $FILE to docker images"
(cd / && mkdir -p /app && mv /$FILE /app/$FILE && cat /app/$FILE | docker load)

# setup directory structure
(mkdir -p /app/db && chmod 666 /app/db)

# run advocat
docker run -d -v /app/db:/app/db -v /app/config.json:/app/config.json -p 3000:3000 -e VIRTUAL_HOST=$DOMAIN -t advocat

# run alive
docker run -d -p 999:999 alive