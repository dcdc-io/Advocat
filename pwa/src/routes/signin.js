export async function post(req, res, next) {
    const users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
    console.log(users)
    debugger
}