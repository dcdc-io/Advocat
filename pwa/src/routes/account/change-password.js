import { changePassword } from './_helpers'

export async function post(req, res, next) {
    let result
    try {
        result = await changePassword(req.body)
        res.status(200)
    } catch(e) {
        result = e.toString()
        res.status(500)
    } finally {
        return res.send(result)
    }
}