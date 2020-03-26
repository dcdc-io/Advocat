const PouchDB = require("pouchdb").plugin(require("pouchdb-adapter-memory"))
import * as plugin from "./lib"

it('can', async () => {
    PouchDB.plugin(plugin)

    const db = new PouchDB("test", {adapter: "memory"})
    await db.put({_id:"12345"})

    expect((await db.allDocs()).rows.length).toEqual(1)
})

it('ignores admin part', async () => {
    // @ts-ignore
    const impl = plugin.__impl as any

    const ok = await impl.isAdminUser({ name: null, roles: ["_admin"] })
    expect(ok).toEqual(true)
})