import { getUsersDB } from "./helpers.js"

export const changePassword = async (formData, errorHandler) => {
    error = { oldPassword: "", newPassword: "",newPasswordValidate: ""}
    try{
        const schema = yup.object().shape({
			newPassword: yup.string().required(),
			newPasswordValidate: yup.string().required().oneOf([newPassword],"passwords do not match"),
        })
        const db = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)
        
        await schema.validate(formData, {abortEarly: false}).catch(
            err => {(err.inner || []).forEach(err => {
                error[err.path] = err.message
            }); throw new "error"
        })

    }
    finally{
        return errorHandler(error)
    }
}
