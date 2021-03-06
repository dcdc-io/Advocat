require("./_migrate")("2020-03-28-0002", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    // create mail outbox
    const mail_outbox = await createDatabase("mail_outbox")
    await mail_outbox.putSecurity({ admins: { roles: ["admin"] }, members: { names: ["mailer"] } })

    // create magiclinks
    const magiclinks = await createDatabase("magiclinks")
    await magiclinks.putSecurity({ admins: { roles: ["admin"] } })
})