const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

const loop = async () => {
    // 1. get the messages flagged "waiting"
    try {
        const messages = await fetch(process.env.OUTBOX_URL)
        
        // 2. flag them all as "sending"
        const transport = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "localhost",
            port: process.env.SMTP_PORT || 25,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
        const message = {
            from: "advocat@dcdc.io",
            to: "benjamin.babik@gmail.com", //to: "ben@dcdc.io",
            subject: "This is a test",
            text: "This is a test email.",
            html: ""
        }
        transport.sendMail(message, (error, info) => {
            if (error) {
                console.error(error)
                // 3. try and flag message as "errored"
                setTimeout(loop, 60000)
            } else {
                console.log(info)
                // 3. flag message as "sent"
                setTimeout(loop, 10000)
            }
        })
    } catch (e) {

    }
}
loop()

