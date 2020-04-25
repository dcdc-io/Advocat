import { generateHeaderPayloadString, urlBase64ToUtf8, atob, btoa } from "../../helpers.js"
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

export const verifyDocSignature = async (token) => {
    const { exp, iat, sig, ref, sub } = JSON.parse(urlBase64ToUtf8(token))
    /* decoded will be an object like {
        // signature expiration
        exp: 1586511429926
        // signature issued at
        iat: 1586511428866
        // reference to _id of document in user db
        ref: "void-uk-covid-19-antibody-test5a546be68032fbb0318a66589a7018ac"
        // signature of (header[not sent]) + "." sub + whole document + iat + exp
        sig: "PCd_o2UwfRakpSVCIpnheuCXSOG7gk6hUI19XvORwayKwifgZZz4LnNiMWEpXtnV75ZCXQVdJfw9dmyqRvXMEg"
        // user _id hash
        sub: "f4e7a1dd379adf779f88262d7f5193d7"
    } */
    const claimantDb = await globalThis.dbContext(`user_${sub}`)
    let doc = await claimantDb.get(ref)
    // revpos patch
    for (const key of Object.keys(doc._attachments)) {
        delete doc._attachments[key].revpos
    }
    //

    const toVerify = {
        sub,
        doc,
        iat,
        exp
    }
    const hps = generateHeaderPayloadString(toVerify)
    console.log(hps)
    const jwtToVerify = `${hps}.${sig}`
    const userKeys = (await claimantDb.allDocs({include_docs: true})).rows.filter(row => row.doc.type === "devicekey").map(row => row.doc.jwk)
    
    for (const key of userKeys) {
        console.log("----------------------------------")
        console.log(key)
        console.log(jwtToVerify)
        const claimantPEM = jwkToPem(key)
        console.log(claimantPEM)
        try {
            if (jwt.verify(jwtToVerify, claimantPEM)) {
                return {ok:true, doc:doc}
            }
        } catch(error) {
            console.log(error)
        }
    }
    return {ok:false}
}