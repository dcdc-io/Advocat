require("./_migrate")("2020-03-28-0001-security", async ({ createDatabase, useDatabase }) => {
    
    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    const _replicator = await useDatabase("_replicator")
    await _replicator.putSecurity({
        admins: {
            roles: [
                "admin"
            ]
        }
    })
    const _users = await useDatabase("_users")
    await _users.putSecurity({
        admins: {
            roles: [
                "admin"
            ]
        }
    }
    )
    const registrations = await useDatabase("registrations")
    await registrations.putSecurity({
        members: {
            names: [
                "mailer"
            ]
        },
        writers: {
            roles: [
                "_public"
            ]
        }
    })
    const __migrations__ = await useDatabase("__migrations__")
    await __migrations__.putSecurity({
        admins: {
            roles: [
                "admin"
            ]
        }
    })
})