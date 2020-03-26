require('dotenv').config()

const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

const randomString = () => require('crypto').randomBytes(16).toString("hex")
const txtSafe = str => str.replace(require('./rx.js').cleanText, '')
const htmlSafe = str => txtSafe(require('striptags')(str))
const emailSafe = str => { if (require('./rx.js').email.test(str)) { return str } else { throw "invalid email address" } }

const { DOMAIN = "advocat.group", SMTP_HOST = "localhost", SMTP_PASS, SMTP_PORT = 25, SMTP_USER, REGISTRATION_USER, REGISTRATION_PASS, PROTOCOL, PORT = 443 } = process.env

const loop = async () => {
    // 1. get the messages flagged "waiting"
    try {
        const messages = await fetch(`${PROTOCOL}://${REGISTRATION_USER}:${REGISTRATION_PASS}@${DOMAIN}:${PORT}/db/registrations/_all_docs?include_docs=true`).then(res => res.json()).then(data => data.rows)

        for (let { doc } of messages) {
            // safety checks
            // 1. already sent or errored
            if (doc.status) {
                continue
            }
            // 2. bad name format
            if (!doc.name) {
                continue
            }
            // 3. bad email
            if (emailSafe(doc.email)) {
                // throws on error
            }
            try {
                const transport = nodemailer.createTransport({
                    host: SMTP_HOST,
                    port: SMTP_PORT,
                    auth: {
                        user: SMTP_USER,
                        pass: SMTP_PASS
                    }
                })
                const token = randomString()
                doc.token = token
                const url = `${PROTOCOL}://${DOMAIN}/complete-registration/${token}`
                const message = {
                    from: "advocat@dcdc.io",
                    to: emailSafe(doc.email),
                    subject: `Your ${DOMAIN} Registration`,
                    text: `advocat.
                    
                    Thank you ${txtSafe(doc.name)}. To complete your registration visit this URL in a web browser: ${url}
                    
                    The advocat. development team at DCDC.io.`,
                    html: `<h1>Thank you from advocat.</h1>
                    <br />
                    <p>Thank you ${htmlSafe(doc.name)}.</p>
                    <br />
                    <p>To complete your registration please visit ${url} by clicking or copying the URL to a web browser.</p>
                    <br />
                    <p>The advocat. development team at DCDC.io.</p>`
                }
                // 3. flag message as "sent"
                doc.status = "sent"
                const ok = await fetch(`${PROTOCOL}://${REGISTRATION_USER}:${REGISTRATION_PASS}@${DOMAIN}:${PORT}/db/registrations/${encodeURIComponent(doc._id)}?conflicts=true`, {
                    method: "PUT",
                    body: JSON.stringify(doc),
                    headers: { 'Content-Type': 'application/json' }
                 })
                const response = await ok.json()
                console.log(response)
                // here we have deferred the email until after we know the database is updated properly
                if (response.ok) {
                    const info = await transport.sendMail(message)
                    console.log(info)
                }
            }
            catch (error) {
                doc.status = "error"
                console.error(error)
                await fetch(`${PROTOCOL}://${REGISTRATION_USER}:${REGISTRATION_PASS}@${DOMAIN}:${PORT}/db/registrations/${encodeURIComponent(doc._id)}?conflict=true`, { 
                    method: "PUT",
                    body: JSON.stringify(doc),
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        }
        setTimeout(loop, 10000)
    } catch (e) {
        console.error("unable to fetch docs")
        setTimeout(loop, 60000)
    }
}
loop()

