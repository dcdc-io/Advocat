export async function get(req, res, next) {
    const DB = globalThis.dbContext
    const registrations = DB("registrations")
    const all = await registrations.allDocs({ include_docs: true })
    const datapoints = all.rows.filter(row => row.doc.location).map(({doc}) => {
        //return { geoCode: doc.location.geoCode }
        return [doc.location.latitude, doc.location.longitude]
    })
    res.send({
        // location: [-1.137255, 52.635874],
        datapoints
    })
}