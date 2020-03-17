import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import { setContext, getContext } from 'svelte'
PouchDB.plugin(PouchDBAuthentication)

const remoteURL = "http://localhost:5984"

export const useDatabase = ({name, sync = true}) => {
    const url = `${remoteURL.replace(/\/$/, '')}${name ? '/' : ''}${name && name.replace(/^\//, '')}`
    const remote = new PouchDB(url, {skip_setup: true})
    const local = new PouchDB(`${name}`)
    if (sync) {
        local.sync(remote, {live:true, retry:true}).on('error', console.log.bind(console))
    }
    local.__remote = remote
    return local
}

export const login = async ({username, password, force = false}) => {
    try {
        const remote = new PouchDB(remoteURL, {skip_setup:true})
        await remote.logIn(username, password)
        // set loggedIn (use js api because we're outside svelte)
        const { loggedIn, username:dbUsername } = getContext("user")
        dbUsername.set((await remote.getSession()).userCtx.name)
        loggedIn.set(true)
        
    } catch (e) {
        console.error(e)
        throw(e)
    }
}

export const autoLogin = async () => {
    try {
        const _ = new PouchDB(remoteURL)
        const { loggedIn, username } = getContext("user")
        const session = await _.getSession()
        if (session.ok) {
            username.set(session.userCtx.name)
            loggedIn.set(true)
        }
        _.close()
    } catch (e) {
        // don't rethrow
        console.log(e)
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