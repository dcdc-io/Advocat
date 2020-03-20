const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection

const PouchDB = require('pouchdb')
const path = require('path')
const express = require('express')
const cors = require('cors')
const app = express()
const WWW = path.join(path.dirname(__filename) + '/www')

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
}))

app.get('/_utils', function (req, res) {
  if (req.originalUrl === '/_utils') {
    res.redirect(301, '/_utils/');
  } else {
    res.sendFile(path.join(WWW, 'index.html'))
  }
});
app.use('/_utils', express.static(WWW));

app.use('/', require('express-pouchdb')(PouchDB.defaults({
  prefix: './db/'
}), {
  mode: 'fullCouchDB',
  overrideMode: {
    exclude: ['routes/fauxton']
  }
}))
console.log("listening on 5984")
app.listen(5984)