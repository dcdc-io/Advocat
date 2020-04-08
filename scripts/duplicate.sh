#!/bin/bash

docker save -o deploy.tar deploy:latest
docker save -o advocat.tar advocat:latest
docker save -o alive.tar alive:latest

