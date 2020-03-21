#!/bin/bash
echo $PWD

### dependencies

# build agents

# build pouchdb-security
(cd pouchdb-security && yarn)

# build couchdb-fauxton
# (cd couchdb-fauxton-1.1.10 && yarn && yarn couchdb)
# ^^^ not need as pouchdb-fauxton will build

# build pouchdb-fauxton
(cd pouchdb-fauxton && yarn)

# build pouchdb-server
(cp -r pouchdb-fauxton/www server/www && yarn)

# build pwa
(cd pwa && yarn && yarn build)
(cp -r pwa/__sapper__/build server/pwa)
