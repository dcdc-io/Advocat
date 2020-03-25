import PouchDB from 'pouchdb'
import assert from 'assert'
let wrapped = {}

function wrap(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // @ts-ignore
    const unwrapped = PouchDB.prototype[propertyKey]
    // @ts-ignore
    wrapped[propertyKey] = function () {
        const pinArguments = arguments
        return target[propertyKey].apply(this, pinArguments)
            .then(() => {
                return unwrapped.apply(this, pinArguments)
            })
            .catch((error: any) => {
                throw error
            })
    }
}

type UserCtx = {
    name: string
    roles?: string[]
}

type SecObj = {
    admins?: SecObjPerm
    members?: SecObjPerm
    readers?: SecObjPerm
    writers?: SecObjPerm
}

type SecObjPerm = {
    users?: string[]
    roles?: string[]
}

class SecurePouchDB {
    static async wouldAlterDoc(db: any, doc: any): Promise<boolean> {
        return doc._id && ((await db.get(doc._id).catch(() => null)) !== null)
    }
    static async wouldCreateDoc(db: any, doc: any): Promise<boolean> {
        return doc._id && ((await db.get(doc._id).catch(() => null)) === null)
    }
    static async canAlterDoc({ roles, name }: UserCtx, { admins, members }: SecObj): Promise<boolean> {
        const userCan = [
            ...admins?.users || [], ...members?.users || []
        ].includes(name)
        const roleCan = roles?.some(role => [
            ...admins?.roles || [], ...members?.roles || []
        ].includes(role)) || false
        const publicRoleCan = [
            ...members?.roles || []
        ].includes("_public")
        return userCan || roleCan || publicRoleCan
    }
    static async canCreateDoc({ roles, name }: UserCtx, { admins, members, writers }: SecObj): Promise<boolean> {
        const userCan = [
            ...admins?.users || [], ...members?.users || [], ...writers?.users || []
        ].includes(name)
        const roleCan = roles?.some(role => [
            ...admins?.roles || [], ...members?.roles || [], ...writers?.roles || []
        ].includes(role)) || false
        const publicRoleCan = [
            ...members?.roles || [], ...writers?.roles || []
        ].includes("_public")
        return userCan || roleCan || publicRoleCan
    }
    
    @wrap
    static async bulkDocs(docs: any, args: { userCtx?: UserCtx, secObj?: SecObj }): Promise<any> {
        if (args.userCtx && args.secObj) {
            let docArray = docs.docs || docs
            for (let doc of docArray) {
                assert(await SecurePouchDB.wouldCreateDoc(this, doc) <= await SecurePouchDB.canCreateDoc(args.userCtx, args.secObj), "cannot create doc")
                assert(await SecurePouchDB.wouldAlterDoc(this, doc) <= await SecurePouchDB.canAlterDoc(args.userCtx, args.secObj), "cannot alter doc")
            }
        }
    }
}

module.exports = wrapped