import { verifyDocSignature } from "./_helpers.js"

export async function get(req, res, next) {
    const token = req.params.token
    const resp = await verifyDocSignature(token)
    if (!resp.ok)  {
        // bail out
        return res.send({ok:false})
    }

    res.send(resp.doc)

    // TODO: log which signed in user did this so the owner of the token can know
}