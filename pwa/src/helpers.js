import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import { getContext } from 'svelte'
import pouchdbfind from 'pouchdb-find'
import { writable } from 'svelte/store'
import sjcl from "sjcl"

PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(pouchdbfind)

let dbUrl = ""

const { loggedIn, username } = getContext("user")

export const lowercase = str => str.toLowerCase()
export const randomString = () => require('crypto').randomBytes(16).toString("hex")
export const hash = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str)).substr(0, 32)

export const getUserAccountDB = async _ => {
    const email = await checkLocalUser()
    return useDatabase("users_" + hash(lowercase(email)))
}

export const setDatabaseUrl = (url) => {
    console.log("setDatabaseUrl has been called")
    dbUrl = url
}

export const sendMail = async ({to, template, params}) => {
    const mail_outbox = globalThis.dbContext("mail_outbox")
    await mail_outbox.post({
        type: "email", to, template, params, timestamp: Date.now()
    })
    console.log(to, template, params)
}

export const signUp = async ({ name, email, location }) => {
    try {
        const token = randomString()
        const registrations = globalThis.dbContext("registrations")
        await registrations.post({
            _id: hash(email.toLowerCase()), 
            email,
            name,
            location,
            token
        })
        await sendMail({
            to: email,
            template: "registration",
            params:{
                token
            }
        })
        return {ok: true}
    } catch(e) {
        if(e.message == "Save failed: Document update conflict"){
            await sendMail({
                to: email,
                template: "registration_duplicate",
                params:{
                    token
                }
            })
            console.error(e)
            return {ok: true}
        }
        console.error(e)
        return {ok: false}
    }
}

export const useDatabase = ({ name, sync = true, onlyRemote = false }) => {
    if (window === undefined) {
        onlyRemote = true
    }
    if (dbUrl === "") {
        throw "cannot useDatabase without a URL"
    }
    const url = `${dbUrl.replace(/\/$/, '')}${name ? '/' : ''}${name && name.replace(/^\//, '')}`
    const remote = new PouchDB(url, { skip_setup: true })
    if (!onlyRemote) {
        const local = new PouchDB(`${name}`)
        if (sync) {
            local.sync(remote, { live: true, retry: true }).on('error', console.log.bind(console))
        }
        local.__remote = remote
        return local
    } else {
        return remote
    }
}

export const checkLocalUser = async () => {
    // use _local/ prefix on local only databases - it stops them syncing
    console.log("checking local user")
    let session
    let local
    try {
        local = useDatabase({ name: "_users", sync: false })
        session = await local.__remote.getSession()
        if (session.ok && session.userCtx.name) {
            username.set(session.userCtx.name)
            loggedIn.set(true)
        }
    } catch (e) {
        // don't rethrow
        console.log(e)
    } finally {
        local.__remote.close()
        local.close()
        return session.userCtx.name
    }
}