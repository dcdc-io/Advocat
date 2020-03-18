const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('slouchdb-security'))
const PouchDB = require('pouchdb')

const app = require('express-pouchdb')(PouchDB, {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
app.listen(5984)