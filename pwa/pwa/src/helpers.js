import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
PouchDB.plugin(PouchDBAuthentication)

let 

export const useDatabase = ({name}) => {
    const remote = new PouchDB(`http://localhost:5984/${name}`, {skip_setup: true})
    const local = new PouchDB(`${name}`)
    let sync;
    return {
        login: async ({username, password, options = {}}) => {
            try {
                const response = await remote.logIn(username, password)//, options)
                console.log("you are logged in")
                sync = local.sync(remote, {live:true, retry:true}).on('error', console.log.bind(console))
            } catch (e) {
                console.log("you are not logged in")
                debugger
                throw e
            }
        },
        db: local
    }
}

export const login = async ({username, password}) => {
    try {
        await useDatabase({name:""}).login({username, password})
        console.log("you are logged in")
    } catch (e) {
        console.error(e)
        throw(e)
    }
}