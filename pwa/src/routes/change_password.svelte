<script>
    import { getContext } from "svelte"
    import { Button, TextField, Checkbox } from "../../node_modules/smelte/src"
    import { goto } from "@sapper/app"

    let { loggedIn, username } = getContext("user")

    let isSubmitting
    let submitted = false
    let formData = {}
    let error = {}
    
    const handleSubmit = async () => {
        isSubmitting = true
        // disable input
        const result = await fetch("account/change-password", {
            method:"POST", 
            body: JSON.stringify({ ...formData, username: $username }),
            headers: { "Content-Type": "application/json" }
        })
        // enable input
        isSubmitting = false
        if (result.ok) {
            submitted = true
        } else {
            console.log(result)
            error = await result.json()
        }


    }
</script>

<svelte:head>
    <title>Change Password</title>
</svelte:head>

<!-- We don't think you should use passwords - click here for an explanation as to why
[TODO : link to blog] -->

{#if submitted}
    Your password has been changed.
{:else}
    <form on:submit|preventDefault={handleSubmit}>
        <TextField type="password" label="old password" bind:value={formData.oldPassword} error={error.oldPassword}/>
        <TextField type="password" label="new password" bind:value={formData.newPassword} error={error.newPassword}/>
        <TextField type="password" label="new password confirmation" bind:value={formData.newPasswordValidate} error={error.newPasswordValidate}/>
        <Button block type="submit" disabled={isSubmitting}>Update Password</Button>
    </form>
{/if}

