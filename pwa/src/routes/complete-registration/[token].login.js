import { randomString, lowercase, hash } from "../../helpers.js"

const sjcl = require("sjcl")
const assert = require("assert")

export async function get(req, res, next) {
    const DB = globalThis.dbContext
    // find user email for token in registrations
    const registrations = DB("registrations")
    const all = await registrations.allDocs({ include_docs: true })
    console.log(all)
    const [reg] = all.rows.filter(row => row.doc.token === req.params.token).map(row => row.doc)
    assert(reg)
    // get or create a user database using hash(lowercase(email))
    const userIdentity = hash(lowercase(reg.email))
    const userDb = DB("user_" + userIdentity)
    // add the user as a member of the database (if they are not already)
    // add the user to the _user to the database (if they're not already in)
    // set a random password if they were not already in the _user database
    const password = randomString()
    await userDb.getSecurity().then(async doc => {
        const app = globalThis.appContext
        const _users = await require("express-pouchdb/lib/utils").getUsersDB(app, globalThis.dbContext)
        if (doc.members && doc.members.names && doc.members.names.includes(lowercase(reg.email))) {
            // the user has access
            return res.send({ok: false, reason: "expired"})
        } else {
            // the user does not have access
            doc.members = doc.members || {}
            doc.members.names = [...doc.members.names || [], lowercase(reg.email)]
            const secObjOk = await userDb.putSecurity(doc)
            console.log(secObjOk)
            await _users.put({
                _id: "org.couchdb.user:" + lowercase(reg.email),
                id: userIdentity,
                name: lowercase(reg.email),
                email: lowercase(reg.email),
                roles: [],
                location: reg.location,
                password,
                type: "user",
            })
            // get a session on behalf of the user
            // set a cookie for the user
            // return {ok:true} with the session
            const login = await _users.multiUserLogIn(lowercase(reg.email), password)
            res.cookie("AuthSession", login.sessionID)
            return res.send({ ok: true })
        }
    })
}