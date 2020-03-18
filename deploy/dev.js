(async () => {
    const fuxor = require('fuxor')
    fuxor.add('pouchdb-security', require('slouchdb-security')) // <- dependency injection
    const PouchDB = require("pouchdb")
    PouchDB.plugin(require('pouchdb-authentication'))
        .plugin(require('pouchdb-adapter-http'))
        .plugin(require("slouchdb-security")) // <- plugged in to expose security API

    const useDatabase = async (name, skip_setup = true) => {
        const db = new PouchDB("http://admin:password@localhost:5984" + (name ? "/" + name : ""), {skip_setup, adapter:"http"})
        await db.logIn("admin", "password")
        return db
    }
    const createDatabase = async (name) => await useDatabase(name, false)

    const userdb = await useDatabase("_users")

    /**
     * first we create some test users then assign roles
     */
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

    const workers_uk_leeds = await useDatabase("workers_uk_leeds")
    const registrations = await useDatabase("registrations")
    const blog = await useDatabase("blog")

    userdb.put()

    let d = await workers_uk_leeds.getSecurity()
    let e = await workers_uk_leeds.getSecurity()
    let f = await workers_uk_leeds.getSecurity()
    /**** workaround for the issue that a db needs to exist before you can put security desc. ****/
    await workers_uk_leeds.putSecurity({ "members": { "roles": ["workers_uk_leeds_rw"] } })
    await registrations.putSecurity({ "writers": { "roles": ["registrations_writer"] } })
    await blog.putSecurity({ "readers": { "roles": ["blog_reader"] } })
})()