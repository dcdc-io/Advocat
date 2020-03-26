(async () => {
    const fuxor = require('fuxor')
    fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection
    const PouchDB = require("pouchdb")
    PouchDB.plugin(require('pouchdb-authentication'))
        .plugin(require('pouchdb-adapter-http'))
        .plugin(require("../pouchdb-security")) // <- plugged in to expose security API

    const useDatabase = async (name, skip_setup = true) => {
        const db = new PouchDB("http://admin:password@localhost:3000/db" + (name ? "/" + name : ""), { skip_setup, adapter: "http" })
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
    const _users = await createDatabase("_users")

    await _users.post({
        "_id": "org.couchdb.user:mailer",
        "name": "mailer",
        "password": process.env.MAILERPASS,
        "roles": [],
        "type": "user"
    })

    for (let user of [
        { _id: "ben@dcdc.io", name: "Ben Babik", location: "Leeds, UK", version: "0.1" },
        { _id: "rhys@dcdc.io", name: "Rhys Kyte", location: "Leeds, UK", version: "0.1" },
        { _id: "james@dcdc.io", name: "James Turner", location: "Leeds, UK", version: "0.1" },
        { _id: "elma@dcdc.io", name: "Elma Gakenyi", location: "Leeds, UK", version: "0.1" },
        { _id: "kertu@dcdc.io", name: "Kertu Babik", location: "Leeds, UK", version: "0.1" },
        { _id: "davidcharnock@dcdc.io", name: "David Charnock", location: "Leeds, UK", version: "0.1" }
    ]) { await registrations.post(user) }

    registrations.putSecurity({ "members": { "users": ["mailer"] }, "writers": { "roles": ["_public"] } })

    await migrationdb.get("2020-03-25-0001").then(async doc => {
        doc.completed = true
        await migrationdb.put(doc)
    })
})()