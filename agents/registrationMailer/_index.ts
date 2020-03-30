require('dotenv').config()

import { findTemplate, compileTemplate } from "./lib"

const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

const randomString = () => require('crypto').randomBytes(16).toString("hex")
const txtSafe = str => str.replace(require('./rx.js').cleanText, '')
const htmlSafe = str => txtSafe(require('striptags')(str))
const emailSafe = str => { if (require('./rx.js').email.test(str)) { return str } else { throw "invalid email address" } }


const { DOMAIN = "advocat.group",
    SMTP_HOST = "localhost",
    SMTP_PASS,
    SMTP_PORT = 25,
    SMTP_USER,
    MAILER_USER,
    MAILER_PASS,
    PROTOCOL,
    PORT = 443 } = process.env

const wellKnownReplacements = {}

const loop = async () => {
    try {
        const transport = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        })
        const messages = await fetch(`${PROTOCOL}://${MAILER_USER}:${MAILER_PASS}@${DOMAIN}${PORT ? `:${PORT}` : ""}/db/mail_outbox/_all_docs?include_docs=true`).then(res => res.json()).then(data => data.rows)
        for (let { doc } of messages) {
            try {
                if (doc.status === "sent" || doc.type !== "email") {
                    continue
                }
                const template = await findTemplate(doc.template)
                const compiled = await compileTemplate(template, {
                    ...doc.params,
                    ...wellKnownReplacements
                })
                doc.status = "sent"
                // TODO: after sent actions
                // TODO: send mail
                const info = await transport.sendMail({
                    from: EMAIL_FROM,
                    to: doc.to.email || doc.to,
                    subject: frontmatter(compiled, "subject"),
                    text: text(compiled),
                    html: compiled
                })
                console.log(info)
            } catch (error) {
                doc.status = "error"
                console.error(error)
                await fetch(`${PROTOCOL}://${MAILER_USER}:${MAILER_PASS}@${DOMAIN}${PORT ? `:${PORT}` : ""}/db/mail_outbox/${encodeURIComponent(doc._id)}?conflict=true`, {
                    method: "PUT",
                    body: JSON.stringify(doc),
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        }
        setTimeout(loop, MESSAGE_DELAY)
    } catch (error) {
        console.error("an error occured...")
        setTimeout(loop, RECOVERY_TIME)
    }
}