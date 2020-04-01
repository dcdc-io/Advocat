require("./_migrate")("2020-04-01-0001", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    // create mail outbox
    const mail_outbox = await createDatabase("claim_templates")
    await mail_outbox.putSecurity({ admins: { roles: ["admin"] } })
})