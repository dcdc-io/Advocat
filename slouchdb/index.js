const fuxor = require('fuxor')
//fuxor.add('pouchdb', require('slouchdb'))
fuxor.add('pouchdb-security', require('slouchdb-security'))

const PouchDB = require('./slouchdb/packages/node_modules/pouchdb')

const app = require('express-pouchdb')(PouchDB.defaults({
    prefix: './db/'
}), {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
app.listen(5984)