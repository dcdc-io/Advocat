(async () => {
    const fuxor = require('fuxor')
    fuxor.add('pouchdb-security', require('../pouchdb-security')) // <- dependency injection
    const PouchDB = require("pouchdb")
    PouchDB.plugin(require('pouchdb-authentication'))
        .plugin(require('pouchdb-adapter-http'))
        .plugin(require("../pouchdb-security")) // <- plugged in to expose security API

    const useDatabase = async (name, skip_setup = true) => {
        const db = new PouchDB("http://admin:password@localhost:3000/db" + (name ? "/" + name : ""), {skip_setup, adapter:"http"})
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
        // abort, we have a migration
        console.error("cannot initialize a database that already contains migrations")
        process.exit(-1)
    }
    await migrationdb.post({
        _id: "0",
        started: true
    })

    /**
     * first we create some test users then assign roles
     */
    const userdb = await useDatabase("_users")

    // test users
    const alice = await userdb.signUp("alice@dcdc.io", "password")
    const bob = await userdb.signUp("bob@dcdc.io", "password")
    const jack = await userdb.signUp("jack@dcdc.io", "password")
    // special user
    const register = await userdb.signUp("register", "register")
    // test user roles
    await userdb.putUser("alice@dcdc.io", { roles: ["workers_uk_leeds_rw", "blog_reader"] })
    await userdb.putUser("bob@dcdc.io", { roles: ["workers_uk_leeds_rw", "blog_reader"] })
    await userdb.putUser("jack@dcdc.io", { roles: ["workers_uk_leeds_rw", "blog_reader"] })
    // this is a special user that can signin from the front end
    await userdb.putUser("register", { roles: ["registrations_writer"] })

    /**
     * now we create a test database and assign our workers_uk_leeds_rw role to 
     * it in the "member" slot so that users with the role can both read and write
     * 
     * we do the equivalent for a registration and blog database, as write only and
     * read only respectively
     */
    // test databases

    const workers_uk_leeds = await createDatabase("workers_uk_leeds")
    //let i = await workers_uk_leeds.get("_local/_security")
    const registrations = await createDatabase("registrations")
    const blog = await createDatabase("blog")
    
    await workers_uk_leeds.putSecurity({ "members": { "roles": ["workers_uk_leeds_rw"] } })
    await registrations.putSecurity({ "writers": { "roles": ["registrations_writer"] } })
    await blog.putSecurity({ "readers": { "roles": ["blog_reader"] } })

    await migrationdb.get("0").then(async doc => {
        doc.completed = true
        await migrationdb.put(doc)
    })
})()

console.log("deployment done")