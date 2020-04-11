import fetch from "node-fetch"

export async function get(req, res, next) {
    const { lat, lon } = req.query
    const latlon = globalThis.dbContext("cache_latlon")
    try {
        const cachehit = await latlon.find({
            selector: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            }
        })
        if (cachehit.docs.length > 0) {
            return res.send({ ...cachehit.docs[0], ok:true })
        }
    } catch (e) {
        // 
    }
    const url = `https://api.postcodes.io/postcodes?lat=${lat}&lon=${lon}`
    const result = await fetch(url)
    if (result.ok) {
        const doc = (await result.json()).result[0]
        doc._id = doc.postcode.replace(" ", "").toLowerCase()
        await latlon.put(doc).catch(f => f)
        return res.send({ ...doc, ok: true })
    }
    return res.send({ok: false})
}