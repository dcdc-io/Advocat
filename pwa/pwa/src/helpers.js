import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
PouchDB.plugin(PouchDBAuthentication)

export const useDatabase = ({name}) => {
    const remote = new PouchDB(`http://localhost:5984/${name}`, {skip_setup: true})
    const local = new PouchDB(`${name}`)

    return {
        login: async ({username, password, options}) => {
            try { 
                await remote.logIn(username, password, options)
                console.log("you are logged in")
                local.sync(remote, {live:true, retry:true}).on('error', console.log.bind(console))
            } catch (e) {
                console.log("you are not logged in")
            }
        }
    }
}