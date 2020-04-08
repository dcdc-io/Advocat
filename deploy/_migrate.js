const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, process.env.NODE_ENV || "" + ".env") })
const { DB_DEPLOY_ENDPOINT = "localhost:3000/db", DB_DEPLOY_PASS, DB_DEPLOY_PROTOCOL, DB_DEPLOY_USER } = process.env

const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection
const PouchDB = require("pouchdb")
PouchDB.plugin(require('pouchdb-authentication'))
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require("../pouchdb-security")) // <- plugged in to expose security API
    .plugin(require('pouchdb-find'))

const useDatabase = async (name, skip_setup = true) => {
    const db = new PouchDB(`${DB_DEPLOY_PROTOCOL || "http"}://${DB_DEPLOY_USER}:${DB_DEPLOY_PASS}@${DB_DEPLOY_ENDPOINT}` + (name ? "/" + name : ""), { skip_setup, adapter: "http" })
    return db
    //await db.logIn("admin", "password")
}

const createDatabase = async (name) => {
    const db = await useDatabase(name, false)
    return db
}

const handler = async (name, processor) => {
    const migrationdb = await useDatabase("__migrations__", false)
    const migrations = await migrationdb.allDocs()
    if (migrations.rows.filter(row => row.id === name).length) {
        console.error("cannot migrate to a database that already contains migration")
        process.exit(-1)
    }
    await migrationdb.post({
        _id: name,
        started: true
    })

    await processor({createDatabase, useDatabase})
    
    await migrationdb.get(name).then(async doc => {
        doc.completed = true
        await migrationdb.put(doc)
    })
    console.log("migration complete")
}

module.exports = handler