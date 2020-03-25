(async () => {
    const fuxor = require('fuxor')
    fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection
    const PouchDB = require("pouchdb")
    PouchDB.plugin(require('pouchdb-authentication'))
        .plugin(require('pouchdb-adapter-http'))
        .plugin(require("../pouchdb-security")) // <- plugged in to expose security API

    const useDatabase = async (name, skip_setup = true) => {
        const db = new PouchDB("http://admin:password@localhost/db" + (name ? "/" + name : ""), {skip_setup, adapter:"http"})
        await db.logIn("admin", "password")
        return db
    }
    const createDatabase = async (name) => {
        const db = await useDatabase(name, false)
        return db
    }

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    const migrationdb = await useDatabase("__migrations__", false)
    const migrations = await migrationdb.allDocs()
    if (migrations.rows.length > 0) {
        console.error("cannot initialize a database that already contains migrations")
        process.exit(-1)
    }
    await migrationdb.post({
        _id: "2020-03-25-0001",
        started: true
    })


    const registrations = await createDatabase("registrations")
    registrations.put({
        "_"
    })
    

    await migrationdb.get("2020-03-25-0001").then(async doc => {
        doc.completed = true
        await migrationdb.put(doc)
    })
})()