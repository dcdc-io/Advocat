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

export const bufferToHex = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
export const lowercase = str => str.toLowerCase()
export const randomString = () => require('crypto').randomBytes(16).toString("hex")
export const randomStringSC = () => { let buffer = new Uint8Array(16); window.crypto.getRandomValues(buffer); return bufferToHex(buffer) }
export const hash = str => sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(str)).substr(0, 32)

export const getUserAccountDB = async (username) => {
    return useDatabase({
        name: "user_" + ((username && username !== "empty") ? hash(lowercase(username)) : "local"),
        sync: (username && username !== "empty")
    })
}

export const localDatabase = async () => {
    return useDatabase({ name: "_local", sync: false, options: { auto_compaction: true } })
}

export const setDatabaseUrl = (url) => {
    console.log("setDatabaseUrl has been called")
    dbUrl = url
}

export const sendMail = async ({ to, template, params }) => {
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

export const buildFormShape = async (database, mainForm, subforms = []) => {
    const db = globalThis.dbContext(database)
    let form = await db.get(mainForm)
    let fields = form.fields

    for(let form in subforms)
    {
        fields.forEach(element => {
            element.order -= 10
        });
        let newForm = await db.get(form)
        formShape.fields = formShape.fields.concat(newForm.fields)
    }          

    form.fields = fields
    console.log(form)
    return form
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
                url: ({ domain, token }) => `https://${domain}/complete-registration/${token}`
            }
        })
        return { ok: true }
    } catch (e) {
        if (/Document update conflict/.test(e.message)) {
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
                params: {
                    token,
                    name,
                    url: ({ domain, token }) => `https://${domain}/account/signin.${token}`
                }
            })
            console.error(e)
            return { ok: true }
        }
        console.error(e)
        return { ok: false }
    }
}

let fetchInUserContext = fetch
const databaseCache = {}
export const useDatabase = ({ name, sync = true, onlyRemote = false, options = {} }) => {
    if (!name) {
        throw "name not included in options"
    }
    if (window === undefined) {
        onlyRemote = true
    }
    if (dbUrl === "") {
        throw "cannot useDatabase without a URL"
    }
    const url = `${dbUrl.replace(/\/$/, '')}${name ? '/' : ''}${name && name.replace(/^\//, '')}`
    const cacheKey = `${name}:${sync}:${onlyRemote}`
    if (onlyRemote === false) {
        if (Object.keys(databaseCache).indexOf(cacheKey) >= 0) {
            // existing db
            return databaseCache[cacheKey]
        }
        let syncRemote
        const local = new PouchDB(name, options)
        if (sync) {
            syncRemote = new PouchDB(url, {
                fetch: fetchInUserContext
            })
            local.replicate.from(syncRemote).on('complete', (info) => {
                local.sync(syncRemote, { live: true, retry: true })
                    .on('change', function () { console.log("change") })
                    .on('paused', function () { console.log("paused") })
                    .on('error', function () { console.log("error") })
            }).on('error', function () { console.log("error") })
        }
        databaseCache[cacheKey] = local
        const close = local.close.bind(local)
        local.close = () => {
            if (syncRemote) {
                syncRemote.close() // necessary?
            }
            close()
            delete databaseCache[cacheKey]
        }
        return local
    } else {
        const remote = new PouchDB(url, {
            ...options,
            fetch: fetchInUserContext,
            skip_setup: true
        })
        databaseCache[cacheKey] = remote
        const close = remote.close.bind(remote)
        remote.close = () => {
            close()
            delete databaseCache[cacheKey]
        }
        return remote
    }
}

export const urlBase64ToBase64 = str => str.replace(/\-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - str.length % 4) % 4, "=")
export const utf8ToBinaryString = str => encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, r) => String.fromCharCode(parseInt(r, 16)))
export const strToUrlBase64 = str => binToUrlBase64(utf8ToBinaryString(str))
export const binToUrlBase64 = bin => btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+/g, "")
export const uint8ToUrlBase64 = uint8 => {
    let bin = '';
    uint8.forEach(code => {
        bin += String.fromCharCode(code)
    });
    return binToUrlBase64(bin)
}

/**
 * Signs a whole document producing a signature suitable for signed sharing.
 * @param {Object} doc A whole document.
 * @param {Number} iat The issued at timestamp. 
 * @param {Number} exp The expiration timestamp.
 */
export const docSignature = async (doc, iat, exp) => {
    const username = await getCurrentUsername()
    const deviceKey = await getDeviceKey({ username })
    const toSign = {
        sub: hash(username),
        doc,
        iat,
        exp
    }
    const signature = await window.crypto.subtle.sign({
        name: "ECDSA", hash: { name: "SHA-256" }
    }, deviceKey.key.privateKey, new TextEncoder().encode(JSON.stringify(toSign)))
    return new Uint8Array(signature)
}

export const createDeviceAuthenticationToken = async () => {
    const username = await getCurrentUsername()
    const deviceKey = await getDeviceKey({ username })
    const header = strToUrlBase64(JSON.stringify({
        alg: "ES256",
        typ: "JWT"
    }))
    const claims = strToUrlBase64(JSON.stringify({
        rid: deviceKey.remoteId,
        iat: Date.now(),
        exp: Date.now() + 1000 * 10,
        // jti: random(),
        sub: hash(username)
    }))
    const signature = await window.crypto.subtle.sign({
        name: "ECDSA", hash: { name: "SHA-256" }
    }, deviceKey.key.privateKey, new TextEncoder().encode(`${header}.${claims}`))
    return `${header}.${claims}.${uint8ToUrlBase64(new Uint8Array(signature))}`
}

export const userSetup = async ({ loggedIn, username }) => {
    let session = await fetch("db/_session").then(result => result.json())
    if (!session.userCtx || !session.userCtx.name) {
        // offline first key authentication
        let currentUsername = await getCurrentUsername()
        if (currentUsername) {
            let deviceKey = await getDeviceKey({ username: currentUsername })
            if (deviceKey) {
                // TODO: here we need to setup outgoing xhr
                // to use a user signed JWT.
                const jwt = await createDeviceAuthenticationToken()
                await fetch(`signin`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jwt })
                }).catch(error => {
                    console.log(error)
                })
                session = await fetch("db/_session").then(result => result.json())
            }
        }
    }
    if (session.userCtx.name) {
        username.set(session.userCtx.name)
        loggedIn.set(true)
    } else {
        // TODO: are we offline??
        username.set(null)
        loggedIn.set(false)
    }
    return session.userCtx.name
}

const validateFiles = (files, formField, formError) => {
    if (!formField) {
        return formError
    }
    let errors = []
    for (let fileFieldName of Object.keys(files)) {
        for (let file of files[fileFieldName]) {
            if (formField.maxSize && file.length > formField.maxSize) {
                errors.push(`${file.name} is too big`)
            }
            if (formField.fileType && !file.type.startsWith(formField.fileType)) {
                errors.push(`${file.name} is not a ${formField.fileType}`)
            }
        }
    }
    formError[formField.name] = errors.join("\n")
    return formError
}

export const validateClaimForm = async (formData, formDataFiles, errorHandler, formShape) => {
    const generateValidation = (input) => {
        return input.reduce((total, fun) => {
            return total[fun[0]](...fun.slice(1))
        }, yup)
    }

    return new Promise((resolve, reject) => {
        let schema = {}
        let formError = {}

        formShape.fields.forEach(field => {
            formError[field.name] = ""
            schema[field.name] = generateValidation(field.validation)
        })

        let fileField = formShape.fields.filter((field) => field.inputType === "FileField")[0]
        if (fileField) {
            formError = validateFiles(formDataFiles, fileField, formError)
        }

        schema = yup.object().shape(schema)

        schema.validate(formData, { abortEarly: false })
            .then(async () => {
                errorHandler(formError)
                if (formError[fileField.name].length !== 0) { resolve(false) }
                resolve(true)
            })
            .catch(err => {
                let formError = {};
                (err.inner || []).forEach(err => {
                    formError[err.path] = err.message
                })
                errorHandler(formError)
                resolve(false)
            })
    })
}

export const setCurrentUsername = async ({ username }) => {
    const local = await localDatabase()
    let putUsername = {
        _id: "currentUsername",
        value: username
    }
    const current = await local.get("currentUsername").catch(() => false)
    if (current) {
        putUsername._rev = current._rev
    }
    await local.put(putUsername)
}

export const getCurrentUsername = async () => {
    const local = await localDatabase()
    const username = await local.get("currentUsername").catch(() => ({ value: undefined }))
    return username.value
}

export const getDeviceKey = async ({ username }) => {
    if (window === undefined) {
        return
    }
    if (!username) {
        return
    }
    const local = await localDatabase()
    const key = await local.get(`_local/enrollment/${username}`).catch(() => false)
    if (key) {
        return key
    }
}

export const enrollDevice = async ({ username, force = false }) => {
    if (window === undefined) {
        return false
    }
    if (!username) {
        return false
    }
    const key = await window.crypto.subtle.generateKey({
        name: "ECDSA",
        namedCurve: "P-256"
    }, false, ["sign", "verify"])
    const local = await localDatabase()
    const newKey = {
        _id: `_local/enrollment/${username}`,
        type: "devicekey",
        remoteId: randomStringSC(),
        key
    }
    const userdb = await getUserAccountDB(username)
    // check for existing key
    let revokeKey
    const existingKey = await local.get(`_local/enrollment/${username}`).catch(() => false)
    if (existingKey) {
        if (!force) {
            throw new Error("cannot install a key where a key already exists")
        }
        // revoke remote key
        revokeKey = await userdb.get(existingKey.remoteId)
        // update rev to replace local key
        newKey._rev = existingKey._rev
    }
    setCurrentUsername({ username })
    // TODO: optionally encrypt/wrap newKey with pin/pbkdf?
    await local.put(newKey)
    const jwk = await crypto.subtle.exportKey("jwk", key.publicKey)
    await userdb.put({
        _id: newKey.remoteId,
        type: "devicekey",
        jwk,
        userAgent: window.navigator.userAgent,
        ip: "0.0.0.0" // TODO: should record device IP so users can see what devices are authenticated
    })
    if (revokeKey) {
        await userdb.put({
            ...revokeKey,
            _deleted: true,
            revoked: Date.now(),
            revocationReason: "upgrade"
        })
    }
    return jwk
}

export const unenrollDevice = async ({ username }) => {
    if (window === undefined) {
        return false
    }
    if (!username) {
        return false
    }
    const local = await localDatabase()
    const key = await local.get(`_local/enrollment/${username}`)
    const userdb = await getUserAccountDB(username)
    const remoteKey = await userdb.get(key.remoteId)
    await userdb.put({
        ...remoteKey,
        _deleted: true,
        revoked: Date.now(),
        revocationReason: "unenroll"
    })
    await local.remove(key)
}