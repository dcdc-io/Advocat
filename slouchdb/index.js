const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('slouchdb-security'))

const PouchDB = require('pouchdb').plugin(require('slouchdb-security'))

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
      include: ['routes/fauxton'],
     /* exclude: [
        'routes/authentication',
        // disabling the above, gives error messages which require you to disable the
        // following parts too. Which makes sense since they depend on it.
        'routes/authorization',
        'routes/session'
      ] */
    }
  });
  // when not specifying PouchDB as an argument to the main function, you
  // need to specify it like this before requests are routed to ``app``
  app.setPouchDB(require('pouchdb'));

  

  app.listen(5984)