#!/bin/bash
echo $PWD

### dependencies

# build agents


# build couchdb-fauxton
(cd couchdb-fauxton-1.1.10 && yarn)

# build pouchdb-fauxton
(cd pouchdb-fauxton && yarn)

# build pouchdb-server
(cp -r pouchdb-fauxton/www server/www && yarn)

# build pwa
(cd pwa && yarn && yarn build)
