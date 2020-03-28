require("dotenv").config()
const {DB_DEPLOY_ENDPOINT, DB_DEPLOY_PASS, DB_DEPLOY_PROTOCOL, DB_DEPLOY_USER } = process.env

const fuxor = require('fuxor')
fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection
const PouchDB = require("pouchdb")
PouchDB.plugin(require('pouchdb-authentication'))
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require("../pouchdb-security")) // <- plugged in to expose security API

const useDatabase = async (name, skip_setup = true) => {
    const db = new PouchDB(`${DB_DEPLOY_PROTOCOL || "http"}://${DB_DEPLOY_USER || "admin"}:${DB_DEPLOY_PASS || "password"}@${DB_DEPLOY_ENDPOINT || "localhost/db"}` + (name ? "/" + name : ""), { skip_setup, adapter: "http" })
    //await db.logIn("admin", "password")
    return db
}
const createDatabase = async (name) => {
    const db = await useDatabase(name, false)
    return db
}

export default async function handler(name, processor) {
    const migrationdb = await useDatabase("__migrations__", false)
    const migrations = await migrationdb.allDocs()
    if (migrations.rows.length > 0) {
        console.error("cannot initialize a database that already contains migrations")
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