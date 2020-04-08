#!/bin/bash

cd /
mkdir -p build
git clone git://github.com/dcdc-io/Advocat.git build
cd build

TAG=$(git describe --tags)

# build alive
(cd alive && docker build -t alive .)

# build advocat
docker build -t advocat .
docker tag advocat:latest advocat:$TAG
FILE=advocat.release.$TAG.tar

# build deploy
(cd deploy && ./pre-build.sh && docker build -t deploy .)

# install
chmod +x /build/scripts/setup.prod.sh

ADVOCAT_TAG=advocat:$TAG /build/scripts/setup.prod.sh
