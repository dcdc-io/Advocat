<script>
    import { getContext, onMount } from "svelte"
    import { useDatabase, getUserAccountDB } from "../helpers.js"
    import { changePassword } from "../accountHelpers.js"
    import { Button, TextField, Checkbox } from "../../node_modules/smelte/src"
    import { goto } from "@sapper/app"
    import * as yup from "yup"

    let { loggedIn, username } = getContext("user");

    let db;
    let oldPassword;
    let newPassword;
    let newPasswordValidate;
    let isSubmitting;
    let submitted = false;
    let error = {};


    //TODO: server side this
    const validate = async () => {
          return new Promise((resolve, reject) => {
          const schema = yup.object().shape({
            newPassword: yup.string().required(),
            newPasswordValidate: yup.string().required().oneOf([newPassword],"passwords do not match"),
          })
          error.email = ""
          schema.validate(user, {abortEarly: false})
            .then(async () => {
                resolve(true)
            })
            .catch(err => {
                (err.inner || []).forEach(err => {
                    error[err.path] = err.message
                })
              resolve(false)
            })
        })
      }
    
    const handleSubmit = async () => {
        try{
            isSubmitting = true;
            const ok = await validate()
            if(ok){
                if(user.passwordGenerated === false){
                    const login = await _users.multiUserLogIn($username, oldPassword)
                    if(login.sessionID){
                        let result = await db.changePassword($username, newPassword)
                    }else{
                        error[oldPassword] = "old password not correct"
                    }
                }
                else{
                    let result = await db.changePassword($username, newPassword)
                }
            }
        }
        finally{
            isSubmitting = false;
            submitted = true;
        }
    }

    const init = async () => {
        db = await require("express-pouchdb/lib/utils").getUsersDB(globalThis.appContext, globalThis.dbContext)		
    }

    onMount(async () => {
        await init()
    })

</script>

<svelte:head>
    <title>Change Password</title>
</svelte:head>

<!-- We don't think you should use passwords - click here for an explanation as to why
[TODO : link to blog] -->

{#if submitted}
    new Password was submitted
{:else}
    <form on:submit|preventDefault={handleSubmit}>
        <TextField type="password" label="old password" bind:value={oldPassword} error={error.oldPassword}/>
        <TextField type="password" label="new password" bind:value={newPassword} error={error.newPassword}/>
        <TextField type="password" label="new password confirmation" bind:value={newPasswordValidate} error={error.newPasswordValidate}/>
        <Button block type="submit" disabled={isSubmitting}>update Password</Button>
    </form>
{/if}

