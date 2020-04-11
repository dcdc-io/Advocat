import fetch from "node-fetch"

export async function get(req, res, next) {
    const geocode = req.query.geocode.replace(" ", "").toLowerCase()
    const latlon = globalThis.dbContext("cache_latlon")
    try {
        const cachehit = await latlon.get(geocode)
        if (cachehit) {
            return res.send({ ...cachehit, ok:true })
        }
    } catch (e) {
        // 
    }
    const url = `https://api.postcodes.io/postcodes/${geocode}`
    const result = await fetch(url)
    if (result.ok) {
        const doc = (await result.json()).result
        doc._id = geocode
        await latlon.put(doc)
        return res.send({ ...doc, ok: true })
    }
    return res.send({ok: false})
}