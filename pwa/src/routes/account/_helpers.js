import * as yup from "yup"
import { transformWithProjections } from "ol/proj"

export const changePassword = async ({ username, oldPassword, newPassword, newPasswordValidate }) => {
    const _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
    await validatePasswordChange({ username, oldPassword, newPassword, newPasswordValidate })
    let user = await _users.get("org.couchdb.user:" + username)
    user.password = newPassword
    return await _users.put(user)
}

const validatePasswordChange = async ({ username, oldPassword, newPassword, newPasswordValidate }) => {
    const checkOldPassword = async () => {
        let _users = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
        let user = await _users.get("org.couchdb.user:" + username)
        if (user.passwordGenerated === true) { return true }
        try{ 
            const login = await _users.multiUserLogIn(username, oldPassword)
            if (login.sessionID) {
                return true
            } else {
                error[oldPassword] = "old password not correct"
                return false
            }
        }
        catch{
               e=> {throw e}
            }
    }
    let error = { oldPassword: "", newPassword: "", newPasswordValidate: "" }
    return new Promise(async (resolve, reject) => {
        const schema = yup.object().shape({
            newPassword: yup.string().required(),
            newPasswordValidate: yup.string().required().oneOf([newPassword], "passwords do not match"),
        })
        let oldPassCheck = await checkOldPassword()
        schema.validate({ newPassword, newPasswordValidate }, { abortEarly: false })
            .then(async () => {
                if (oldPassCheck == false) { reject(error) }
                resolve(true)
            })
            .catch(err => {
                (err.inner || []).forEach(err => {
                    error[err.path] = err.message
                })
                reject(error)
            })
    })
}