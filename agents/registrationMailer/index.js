const nodemailer = require('nodemailer')
const fetch = require('node-fetch')

const randomString = () => {
    let token
    require('crypto').randomBytes(32, (_, buffer) => {
        token = buffer.toString("hex")
    })
    return token
}

const loop = async () => {
    // 1. get the messages flagged "waiting"
    

    process.env.OUTBOX_URL = "http://admin:password@localhost:3000/db/registrations/"
    try{
        const messages = await fetch(process.env.OUTBOX_URL + "_all_docs")
            .then(async res => await res.json())
            .then(data => data.rows)
    } catch (e){
        console.error(e)
    }
    console.log (messages)
    for (let { doc, rev } of messages) {
        try {
            doc._rev = rev
            const transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "localhost",
                port: process.env.SMTP_PORT || 25,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            })
            const token = randomString()
            const message = {
                from: "advocat@dcdc.io",
                to: "benjamin.babik@gmail.com", //to: "ben@dcdc.io",
                subject: "This is a test",
                text: "This is a test email.",
                html: `url stuff + ${token}`
            }
            transport.sendMail(message, (error, info) => {
                if (error) {
                    throw error
                } else {
                    console.log(info)
                    // 3. flag message as "sent"
                    setTimeout(loop, 10000)
                }
            })
        }
        catch (error) {
            doc.status = "error"
            console.error(error)
            await fetch(process.env.OUTBOX_URL + "/registrations" , { method: "PUT" , body: doc }).catch(e => console.error (`in addition the document was unable to be updated`))
            setTimeout(loop, 60000)
        }
    }
  
}
loop()

