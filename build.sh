#!/bin/bash
echo $PWD

### dependencies
(cd pouchdb && yarn && yarn build)

# build agents


# build couchdb-fauxton
(cd couchdb-fauxton-1.1.10 && yarn)

# build pouchdb-fauxton
(cd pouchdb-fauxton && yarn)

# build pouchdb-server
(cd pouchdb-server && yarn)

# build pwa
(cd pwa && yarn && yarn build)
