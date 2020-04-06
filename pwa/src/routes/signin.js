import calculateSessionId from 'couchdb-calculate-session-id'
import { sendMail, randomString } from "../helpers.js"
import assert from "assert"
import jsonwebtoken from "jsonwebtoken"
import jwktopem from "jwk-to-pem"

const { JWT_CLOCK_DRIFT = 60000 } = process.env

export async function post(req, res, next) {
    const _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
    // magic link email
    if (req.body.email && !req.body.password) {
        // calculateSessionId(userDoc.name, userDoc.salt, info.secret, timestamp());
        const user = await _users.get(`org.couchdb.user:${req.body.email.toLowerCase()}`)
        const info = await require("pouchdb-auth/lib/utils").dbDataFor(_users)
        const sessionID = calculateSessionId(user.name, user.salt, info.secret, Math.round(Date.now() / 1000))
        // gen token and put into magiclinks db
        const token = randomString()
        const magiclinks = globalThis.dbContext("magiclinks")
        await magiclinks.post({
            _id: token,
            sessionID,
            expires: Date.now() + 86400000
        })
        // send session ID to user as email
        await sendMail({
            to: user.email,
            template: "magiclink",
            params: {
                name: user.name,
                email: user.email,
                token,
                url: ({ domain, token }) => `https://${domain}/account/signin.${token}`
            }
        })
        res.send({ ok: true })
        return
    }
    // username password
    if (req.body.email && req.body.password) {
        try {
            const login = await _users.multiUserLogIn(req.body.email.toLowerCase(), req.body.password)
            assert(login.sessionID, "couldn't create session, does user exist?")
            res.cookie("AuthSession", login.sessionID)
            res.send({ ok: true })
        } catch (e) {
            res.send({ ok: false })
        }
        return
    }
    // jwt
    if (req.body.jwt) {
        const decoded = jsonwebtoken.decode(req.body.jwt, { complete: true })
        const userDeviceKey = await (await globalThis.dbContext(`user_${decoded.payload.sub}`)).get(decoded.payload.rid)
        assert(!userDeviceKey.revoked, "user device key is revoked")
        const pem = jwktopem(userDeviceKey.jwk)
        const result = jsonwebtoken.verify(req.body.jwt, pem)
        assert(result.iat < (Date.now() + JWT_CLOCK_DRIFT), "jwt issued in the future")
        assert(result.exp > (Date.now() - JWT_CLOCK_DRIFT), "jwt expired")
        const _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
        const user = (await _users.find({ selector: { ident: result.sub } })).docs[0]
        const info = await require("pouchdb-auth/lib/utils").dbDataFor(_users)
        const sessionID = calculateSessionId(user.name, user.salt, info.secret, Math.round(Date.now() / 1000))
        res.cookie("AuthSession", sessionID)
        res.send({ ok: true })
        return
    }
}

export async function get(req, res, next) {
    // console.log(req.query.key)
    if (req.query.key) {
        res.cookie("AuthSession", req.query.key)
    }
    res.redirect("/")
}
