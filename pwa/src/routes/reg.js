export async function get(req, res, next) {
    const DB = globalThis.dbContext
    const registrations = DB("registrations")
    const all = await registrations.allDocs({ include_docs: true })
    const result = all.rows.filter(row => row.doc.location).map(({doc}) => {
        return { geoCode: doc.location.geoCode }
    })
    res.send(result)
}