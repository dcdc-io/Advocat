//const fuxor = require('fuxor')
//fuxor.add('pouchdb-fauxton', require('slouchdb-fauxton'))
//fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection

const PouchDB = require('../pouchdb/packages/node_modules/pouchdb')

const app = require('../pouchdb-server/packages/node_modules/express-pouchdb')(PouchDB.defaults({
    prefix: './db/'
}), {
    mode: 'fullCouchDB',
    overrideMode: {
      include: ['routes/fauxton']
    }
  });
console.log("listening on 5984")
app.listen(5984)