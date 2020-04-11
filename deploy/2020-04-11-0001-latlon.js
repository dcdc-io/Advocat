require("./_migrate")("2020-04-11-0001-latlon", async ({ createDatabase, useDatabase }) => {

    /**************************************************/
    /*             START OF DEPLOYMENT                */
    /**************************************************/

    const cache_latlon = await createDatabase("cache_latlon")
    await cache_latlon.createIndex({
        index: { fields: ['latitude', 'longitude'] }
    })
    await cache_latlon.putSecurity({
        readers: {
            roles: [ "_public" ]
        }
    })
})
