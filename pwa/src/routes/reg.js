export async function get(req, res, next) {
    const DB = globalThis.dbContext
    const registrations = DB("registrations")
    const all = await registrations.allDocs({ include_docs: true })
    const datapoints = all.rows.filter(row => row.doc.location.latitude).map(({doc}) => {
        //return { geoCode: doc.location.geoCode }
        return [doc.location.longitude.toFixed(1), doc.location.latitude.toFixed(1)]
    })
    res.send({
        datapoints
    })
}