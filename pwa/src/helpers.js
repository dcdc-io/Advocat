import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import pouchdbfind from 'pouchdb-find'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(pouchdbfind)

let dbUrl = ""
export const setDatabaseUrl = (url) => {
    console.log("setDatabaseUrl has been called")
    dbUrl = url
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

export const login = async ({ username, password, force = false }) => {
    let local
    try {
        local = useDatabase({ name: "_users", sync: false })
        const result = await local.__remote.logIn(username, password)
        // set loggedIn (use js api because we're outside svelte)
        const { loggedIn, username: dbUsername } = getContext("user")
        dbUsername.set((await local.__remote.getSession()).userCtx.name)
        loggedIn.set(true)
        window.localStorage.setItem("whoami", (await local.__remote.getSession()).userCtx.name)
        return result
    } catch (e) {
        console.error(e)
        throw (e)
    } finally {
        local.__remote.close()
        local.close()
    }
}

export const checkLocalUser = async ({ loggedIn, username }) => {
    console.log("checking local user")

    console.log(dbs)

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

export const signUp = async ({ name, email, location }) => {
    try {
        const registrations = useDatabase({ name: "registrations", onlyRemote: true })
        const ok = await registrations.post({
            _id: `${name} <${email}>`,
            email,
            name,
            location
        })

    } catch (e) {
        console.log("signup Error")
        console.log(e)
        throw (e)
    }
}
/*
export const logOut = async () => {
    const remote = new PouchDB(remoteURL, {skip_setup:true})
    const { loggedIn } = getContext("user")
    loggedIn.set(false)
    await remote.logOut();
}
*/

export let colourInvert = writable(false)