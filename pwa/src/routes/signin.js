import calculateSessionId from 'couchdb-calculate-session-id'
import { sendMail } from "../helpers.js"

export async function post(req, res, next) {
    const _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
    if (req.body.email && !req.body.password) {
        // magic link email
        // calculateSessionId(userDoc.name, userDoc.salt, info.secret, timestamp());
        const user = await _users.get(`org.couchdb.user:${req.body.email.toLowerCase()}`)
        const info = await await require("pouchdb-auth/lib/utils").dbDataFor(_users)
        const sessionID = calculateSessionId(user.name, user.salt, info.secret, Math.round(Date.now() / 1000))
        // send session ID to user as email
        sendMail({
            to: user._id,
            template: "magiclink",
            params: { sessionID }
        })
        res.send({ok:true})
        return
    }
    const login = _users.multiUserLogIn(req.body.email.toLowerCase(), req.body.password)
    res.cookie("AuthSession", login.sessionID)
    res.send({ok:true})
}

export async function get(req, res, next) {
    // console.log(req.query.key)
    res.cookie("AuthSession", req.query.key)
    res.redirect("/")
}