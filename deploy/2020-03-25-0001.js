require("./_migrate")("2020-03-25-0001", async ({ createDatabase, useDatabase }) => {
    const migrationdb = await useDatabase("__migrations__", false)
    const migrations = await migrationdb.allDocs()
    if (migrations.rows.length > 1 /* 1 BECAUSE THIS JOB HAS ALREADY BEEN POSTED */) {
        console.error("cannot initialize a database that already contains migrations")
        process.exit(-1)
    }
    
    const registrations = await createDatabase("registrations")
    const _users = await createDatabase("_users")

    await _users.post({
        "_id": "org.couchdb.user:mailer",
        "ident": "MAILER",
        "name": "mailer",
        "password": process.env.MAILERPASS,
        "roles": [],
        "type": "user"
    })

    await _users.createIndex({
        index: {
            fields: [
                'ident'
            ]
        }
    })

    for (let user of [
        //{ _id: "ben@dcdc.io", email: "ben@dcdc.io", name: "Ben Babik", location: "Leeds, UK", version: "0.1" },
        //{ _id: "rhys@dcdc.io", email: "rhys@dcdc.io", name: "Rhys Kyte", location: "Leeds, UK", version: "0.1" },
        //{ _id: "james@dcdc.io", email: "james@dcdc.io", name: "James Turner", location: "Leeds, UK", version: "0.1" },
        //{ _id: "elma@dcdc.io", email: "elma@dcdc.io", name: "Elma Gakenyi", location: "Leeds, UK", version: "0.1" },
        //{ _id: "kertu@dcdc.io", email: "kertu@dcdc.io", name: "Kertu Babik", location: "Leeds, UK", version: "0.1" },
        //{ _id: "davidcharnock@dcdc.io", email: "davidcharnock@dcdc.io", name: "David Charnock", location: "Leeds, UK", version: "0.1" }
    ]) { await registrations.post(user) }

    registrations.putSecurity({ "members": { "names": ["mailer"] }, "writers": { "roles": ["_public"] } })
})