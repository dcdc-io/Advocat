import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import { setContext, getContext } from 'svelte'
PouchDB.plugin(PouchDBAuthentication)

const remoteURL = "http://localhost:5984"
//`${remoteURL}

export const useDatabase = ({name}) => {
    const remote = new PouchDB(`${remoteURL}/${name}`, {skip_setup: true})
    const local = new PouchDB(`${name}`)
    local.sync(remote, {live:true, retry:true}).on('error', console.log.bind(console))
    local.__remote = remote
    return local
}

export const login = async ({username, password, force = false}) => {
    try {
        const remote = new PouchDB(remoteURL, {skip_setup:true})
        await remote.logIn(username, password)
        console.log("you are logged in")

        const { value } = getContext("loggedIn")
        $value = true
        
    } catch (e) {
        console.error(e)
        throw(e)
    }
}

export const logOut = async ()=>{
    const remote = new PouchDB(remoteURL, {skip_setup:true})
    await remote.logOut();
}