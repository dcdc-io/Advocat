(async () => {
    const PouchDB = require("pouchdb")
    PouchDB.plugin(require('pouchdb-authentication')).plugin(require('pouchdb-adapter-http'))

    const useDatabase = async (name) => {
        const db = new PouchDB("http://admin:password@localhost:5984" + (name ? "/" + name : ""), {skip_setup:true, adapter:"http"})
        await db.logIn("admin", "password")
        return db
    }

    const userdb = await useDatabase("_users")

    // test users
    const alice = await userdb.signUp("alice@dcdc.io", "password")
    const bob = await userdb.signUp("bob@dcdc.io", "password")
    const jack = await userdb.signUp("jack@dcdc.io", "password")

    const globalgroupdb = await useDatabase("group_global_dev")
    const alicebobgroupdb = await useDatabase("group_global_alicebob")
    const bobjackgroupdb = await useDatabase("group_global_bobjack")

   // return;
    await userdb.putUser("alice@dcdc.io", { roles: ["group_global_dev", "group_global_alicebob"] })
    await userdb.putUser("bob@dcdc.io", { roles: ["group_global_dev", "group_global_alicebob", "group_global_bobjack"] })
    await userdb.putUser("jack@dcdc.io", { roles: ["group_global_dev", "group_global_bobjack"] })

    userdb
})()