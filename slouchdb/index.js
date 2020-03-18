const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('slouchdb-security'))
//fuxor.add('pouchdb-fauxton', require('slouchdb-fauxton'))
const PouchDB = require('pouchdb')

const app = require('express-pouchdb')(PouchDB.defaults({
    prefix: './db/'
}), {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
app.listen(5984)