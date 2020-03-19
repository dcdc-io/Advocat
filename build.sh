#!/bin/bash

### dependencies
(cd slouchdb && cd slouchdb && yarn && yarn build)

# build agents

# build pwa
(cd pwa/pwa/ && yarn && yarn build)

# build couchdb-fauxton
(cd cou)

# build pouchdb-fauxton

# build slouchdb