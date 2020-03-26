const sjcl = require("sjcl")

const lowercase = str => str.toLowerCase()
const hash = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str))
const randomString = () => require("crypto").randomBytes(32).toString("base64")

export async function get(req, res, next) {
    const DB = globalThis.dbContext
    // find user email for token in registrations
    const registrations = DB("registrations")
    const all = await registrations.allDocs()
    const [reg] = all.rows.filter(row => row.doc.token === req.param.token)
    assert(reg)
    // get or create a user database using hash(lowercase(email))
    const userIdentity = hash(lowercase(reg.email))
    const userDb = DB("user_" + userIdentity)
    // add the user as a member of the database (if they are not already)
    // add the user to the _user to the database (if they're not already in)
    // set a random password if they were not already in the _user database
    await userDb.getSecurity(async doc => {
        if (doc.members && doc.members.users && doc.members.users.includes(lowercase(reg.email))) {
            // the user has access
        } else {
            // the user does not have access
            doc.members = doc.members || []
            doc.members.users = [...doc.members.users || [], lowercase(reg.email)]
            await userDb.putSecurity(doc)
            const _users = DB("_users")
            await _users.put({
                _id: "org.couchdb.user:" + lowercase(reg.email),
                id: userIdentity,
                name: lowercase(reg.email),
                email: lowercase(reg.email),
                location: reg.location,
                password: randomString(),
                type: "user",
            })
            _users.close()
        }
    })
    // get a session on behalf of the user
    // set a cookie for the user
    // close the user database
    userDb.close()
    // return {ok:true} with the session
    res.send({ok:true})
    console.log(req)
}