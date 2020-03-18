const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('slouchdb-security'))

const PouchDB = require('pouchdb').plugin(require('slouchdb-security'))


// testing permission stuff
let _users = new PouchDB("_users")
_users.allDocs().then(result => console.log(result))

_users.getSecurity()
    .then(security => { 
            console.log(security)
        return _users.putSecurity({
            "members": [
                "group1", "group2"
            ],
            "readers": [
                "group3"
            ],
            "writers": [
                "group4"
            ]
        })
    })
    .catch(error => {
        console.log(error)
    })

var app = require('express-pouchdb')(PouchDB, {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
  app.setPouchDB(require('pouchdb'));
  app.listen(5984)