#!/bin/bash
echo $PWD

### dependencies

# build agents

# build pouchdb-security
(cd pouchdb-security && yarn)

# build couchdb-fauxton
(cd couchdb-fauxton-1.2.3 && yarn && yarn couchdb)

## no longer used
## # build pouchdb-fauxton
## (cd pouchdb-fauxton && yarn)
## # build backoffice pouchdb-server
## (cp -r pouchdb-fauxton/www server/www && yarn)

# build pwa
(cd pwa && yarn && yarn build)

# copy fauxton build to pwa
(rm -rf pwa/__sapper__/build/_utils || true)
(rm -rf pwa/_utils)
(cp -r couchdb-fauxton-1.2.3/dist/release pwa/__sapper__/build/_utils || true)
(cp -r couchdb-fauxton-1.2.3/dist/release pwa/_utils)
