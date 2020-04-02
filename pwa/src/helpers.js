import calculateSessionId from 'couchdb-calculate-session-id'
import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import { getContext } from 'svelte'
import pouchdbfind from 'pouchdb-find'
import { writable } from 'svelte/store'
import sjcl from "sjcl"
import * as yup from "yup"

PouchDB.plugin(PouchDBAuthentication)
PouchDB.plugin(pouchdbfind)

let dbUrl = ""

export const lowercase = str => str.toLowerCase()
export const randomString = () => require('crypto').randomBytes(16).toString("hex")
export const hash = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str)).substr(0, 32)

export const getUserAccountDB = async (username) => {
    return useDatabase({
        name: "user_" + ((username && username !== "empty") ? hash(lowercase(username)) : "local"),
        sync: (username && username !== "empty")
    })
}

export const setDatabaseUrl = (url) => {
    console.log("setDatabaseUrl has been called")
    dbUrl = url
}

export const sendMail = async ({to, template, params}) => {
    let mailParams = {}
    for (let key of Object.keys(params)) {
        mailParams[key] = typeof params[key] === "function" ? `func:${params[key].toString()}` : params[key]
    }
    const mail_outbox = globalThis.dbContext("mail_outbox")
    await mail_outbox.post({
        type: "email", to, template, params: mailParams, timestamp: Date.now()
    })
    console.log(to, template, mailParams)
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
            to: `"${name}" <${email}>`,
            template: "registration",
            params: {
                token,
                name,
                url: ({domain, token}) => `https://${domain}/complete-registration/${token}`
            }
        })
        return {ok: true}
    } catch(e) {
        if(/Document update conflict/.test(e.message)) {
            const token = randomString()
            const _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
            const user = await _users.get(`org.couchdb.user:${email.toLowerCase()}`)
            const info = await require("pouchdb-auth/lib/utils").dbDataFor(_users)
            const sessionID = calculateSessionId(user.name, user.salt, info.secret, Math.round(Date.now() / 1000))
            const magiclinks = globalThis.dbContext("magiclinks")
            await magiclinks.post({
                _id: token,
                sessionID,
                expires: Date.now() + 86400000
            })
            await sendMail({
                to: user.email,
                template: "registration-duplicate",
                params:{
                    token,
                    name,
                    url: ({domain, token}) => `https://${domain}/account/signin.${token}`
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
    if (!name){
        throw "name not included in options"
    }
    if (window === undefined) {
        onlyRemote = true
    }
    if (dbUrl === "") {
        throw "cannot useDatabase without a URL"
    }
    const url = `${dbUrl.replace(/\/$/, '')}${name ? '/' : ''}${name && name.replace(/^\//, '')}`
    console.log(url)
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

export const checkLocalUser = async ({loggedIn, username}) => {
    // use _local/ prefix on local only databases - it stops them syncing
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

export const validateClaimForm = async(formdata, errorHandler, formShape) => {
    const generateValidation = (input) => {
        return input.reduce( (total, fun) => {
            return total[fun[0]](...fun.slice(1))
        }, yup)
    }

    return new Promise((resolve, reject) => {
        let schema = {}
        let formerror = {}
        formShape.fields.forEach(field => {
            formerror[field.name] = ""
            schema[field.name] = generateValidation(field.validation)
        })
        schema = yup.object().shape(schema)
                
        schema.validate(formdata, {abortEarly: false})
          .then(async () => {
            errorHandler(formerror)
            resolve(true)
          })
          .catch(err => {
            let formerror = {};
            (err.inner || []).forEach(err => {
              formerror[err.path] = err.message
            })
            errorHandler(formerror)
            resolve(false)
          })
      })
}