import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import pouchdbfind from 'pouchdb-find'
import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'
PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(pouchdbfind)

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
    console.log("auto login")
    try {
        const _ = new PouchDB(remoteURL, {skip_setup:true})
        const { loggedIn, username } = getContext("user")
        const session = await _.getSession()
        if (session.ok && session.userCtx.name) {
            username.set(session.userCtx.name)
            loggedIn.set(true)
        }
        _.close()
    } catch (e) {
        // don't rethrow
        console.log(e)
    }
}

const register_user = {
    username: "register",
    password: "register"
}

export const signUp = async(username, password ) =>{
    try {
        const _ = useDatabase({name:""}).__remote
        if( (await _.getSession()).userCtx.name != "register")
        {
            await _.logOut()
            await login(register_user)      
        }

        const result = await _.signUp(username, password)
        await _.logOut()
        await login({username: username ,password: password})
        return result
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