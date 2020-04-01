import { signUp } from "../../helpers.js"

export async function get(req, res, next) {
    const token = req.params.token
    const magiclink = await globalThis.dbContext("magiclinks").get(token)
    console.log(magiclink)
    if (magiclink.expires < Date.now()) {
        return res.redirect(302, "/404")
    }
    res.cookie("AuthSession", magiclink.sessionID) 
    return res.redirect(302, "/")
}