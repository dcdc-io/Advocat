const fuxor = require('fuxor')
//fuxor.add('pouchdb-fauxton', require('slouchdb-fauxton'))
fuxor.add('pouchdb-security', require('slouchdb-security')) // <- dependency injection

const PouchDB = require('./slouchdb/packages/node_modules/pouchdb')

const app = require('./slouchdb-server')(PouchDB.defaults({
    prefix: './db/'
}), {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
console.log("listening on 5984")
app.listen(5984)