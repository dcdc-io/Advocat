const fuxor = require("fuxor")
fuxor.add('pouchdb-security', require('../../pouchdb-security')) // <- dependency injection
import PouchDB from "pouchdb"
PouchDB.plugin(require('pouchdb-authentication'))
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require("../../pouchdb-security")) // <- plugged in to expose security API
    .plugin(require('pouchdb-find'))
    .plugin(require('pouchdb-adapter-memory'))

const useDatabase = async (name:string, skip_setup = true) => {
    const db = new PouchDB(name, { skip_setup, adapter: "http" })
    return db
    //await db.logIn("admin", "password")
}

const createDatabase = async (name:string) => {
    const db = await useDatabase(name, false)
    return db
}

(async () => {
    const http = require("http")
    http.globalAgent.keepAlive = true
    http.globalAgent.maxSockets = 128
    const agent = http.globalAgent
    const fetch = require("node-fetch")
    
    /*
    const db = (function(){                                                    // 1000 @ 617
        // @ts-ignore
        const self = this
        self.data = []
        http.createServer(function(request:any, response:any) {
            self.data.push({foo:"bar"})
            response.writeHead(200, {"Context-Type":"text/html"})
            response.end("ok", "utf-8")
        }).listen(5000)
        return {
            allDocs: async () => [],
            post: async (data:any) => fetch("http://localhost:5000/", {method:"post", body:"hello", agent})
        }
    }).bind(new Object())() 

    const db = (function(){                                                  // 1000 @ 723
        // @ts-ignore
        const self = this
        self.data = []
        const express = require("express")
        const app = express()
        app.post('/', (req:any, res:any) => {
            self.data.push({foo:"bar"})
            res.send("ok")
        })
        let server = app.listen(4000)
        setTimeout(() => {
            server.close()
        }, 8000)
        return {
            allDocs: async () => [],
            post: async (data:any) => fetch("http://localhost:4000/", {method:"post", body:"hello", agent})
        }
    }).bind(new Object())()
    /*
    const db = (function(){                                                  // 1000 @ 2
        // @ts-ignore
        const self = this
        self.data = []
        return {
            allDocs: async () => [],
            post: async (data:any) => self.data.push(data)
        }
    }).bind(new Object())()
    */
    
    //const db = new PouchDB("foobar", {adapter:"memory"})                       // 1000 @ 320
    //const db = new PouchDB("foobar")                                         // 1000 @ 403
    // @ts-ignore
    //const db = new PouchDB("http://admin:password@localhost:5984/foobar", {fetch:(url, opts) => fetch(url, {...opts, agent})})    // 1000 @ 3019
    // @ts-ignore
    const db = new PouchDB("http://admin:password@localhost:3000/db/foobar", {fetch:(url, opts) => fetch(url, {...opts, agent})}) // 1000 @ 2455
    // @ts-ignore
    //const db = new PouchDB("http://admin:password@64.227.42.14:3000/db/foobar", {fetch:(url, opts) => fetch(url, {...opts, agent})}) // 1000 @ 3979

    const time = async (f:any) => {
        let t = Date.now()
        await f()
        return Date.now() - t
    }


    await time(async () => {
        await db.allDocs()
    }).then(r => console.log(r))

    await time(async () => {
        await db.post({foo:1})
    }).then(r => console.log(r))

    await time(async () => {
        let i = 0
        let all = []
        while (i < 1000) {
            all.push(db.post({foo:1}))
            i++
        }
        await Promise.all(all)
    }).then(r => console.log(r))
})()
