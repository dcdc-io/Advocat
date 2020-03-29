import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import pouchdbfind from 'pouchdb-find'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
import sjcl from "sjcl"

PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(pouchdbfind)

let dbUrl = ""
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

export const useDatabase = ({ name, sync = true, onlyRemote = false }) => {
    if (window === undefined) {
        onlyRemote = true
    }
    if (dbUrl === "") {
        throw "cannot useDatabase without a URL"
    }
    console.log("useDatabase has been called")
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

export const checkLocalUser = async ({ loggedIn, username }) => {
    // use _local/ prefix on local only databases - it stops them syncing
    console.log("checking local user")

    ///console.log(dbs)

    let local
    try {
        local = useDatabase({ name: "_users", sync: false })
        const session = await local.__remote.getSession()
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
    }
}

const hash = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str)).substr(0, 32)

export const signUp = async ({ name, email, location }) => {
    try {
        const registrations = useDatabase({ name: "registrations", onlyRemote: true })
        const ok = await registrations.post({
            _id: hash(email.toLowerCase()), 
            email,
            name,
            location
        })
    } 
    catch(e) {
        console.error(e)
    }
}

export let colourInvert = writable(false)