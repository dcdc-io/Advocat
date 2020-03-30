require('dotenv').config()

import { findTemplate, compileTemplate } from "./lib"

import nodemailer from 'nodemailer'
import fetch from 'node-fetch'

const emailSafe = (str:string) => { if (require('./rx.js').email.test(str)) { return str } else { throw "invalid email address" } }

const randomString = () => require('crypto').randomBytes(16).toString("hex")

const { DOMAIN = "advocat.group",
    MESSAGE_DELAY = "10000",
    RECOVERY_TIME = "60000",
    EMAIL_FROM,
    SMTP_HOST = "localhost",
    SMTP_PASS,
    SMTP_PORT = "25",
    SMTP_USER,
    MAILER_USER,
    MAILER_PASS,
    PROTOCOL,
    PORT = "443" } = process.env

const wellKnownReplacements = {}

const loop = async () => {
    try {
        const transport = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        })
        const messages = await fetch(`${PROTOCOL}://${MAILER_USER}:${MAILER_PASS}@${DOMAIN}:${PORT}/db/mail_outbox/_all_docs?include_docs=true`).then(res => res.json()).then(data => data.rows)
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
                    to: emailSafe(doc.to.email || doc.to),
                    subject: compiled.metadata.subject,
                    text: compiled.text,
                    html: compiled.body
                })
                console.log(info)
            } catch (error) {
                doc.status = "error"
                console.error(error)
                await fetch(`${PROTOCOL}://${REGISTRATION_USER}:${REGISTRATION_PASS}@${DOMAIN}:${PORT}/db/registrations/${encodeURIComponent(doc._id)}?conflict=true`, {
                    method: "PUT",
                    body: JSON.stringify(doc),
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        }
        setTimeout(loop, parseInt(MESSAGE_DELAY))
    } catch (error) {
        console.error("an error occured...")
        setTimeout(loop, parseInt(RECOVERY_TIME))
    }
}