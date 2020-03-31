import { signUp } from "../../helpers.js"

export async function post(req, res, next) {
    res.send(await signUp( req.body ))
}
