const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection

const PouchDB = require('pouchdb')
const path = require('path')
const express = require('express')
const app = express()
const WWW = path.join(path.dirname(__filename) + '/www')
const PWA = path.join(path.dirname(__filename) + '/pwa')

app.get('/_utils', function (req, res) {
  if (req.originalUrl === '/_utils') {
    res.redirect(301, '/_utils/');
  } else {
    res.sendFile(path.join(WWW, 'index.html'))
  }
});

app.use('/_utils', express.static(WWW))

app.use('/', require('express-pouchdb')(PouchDB.defaults({
  prefix: './db/'
}), {
  mode: 'fullCouchDB',
  overrideMode: {
    exclude: ['routes/fauxton']
  }
}))
console.log("listening on 80")
app.listen(80)