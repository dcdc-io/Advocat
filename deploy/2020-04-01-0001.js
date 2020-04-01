require("./_migrate")("2020-04-01-0001", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    // create claim_templates outbox
    const claim_templates = await createDatabase("claim_templates")
    await claim_templates.putSecurity({ admins: { roles: ["admin"] } })
})