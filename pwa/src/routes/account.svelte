<script>
    import { getContext, onMount } from "svelte"
    import { useDatabase, getUserAccountDB } from "../helpers.js"
    import { Button, TextField, Checkbox } from "../../node_modules/smelte/src"
    import { goto } from "@sapper/app"
    import * as yup from "yup"

    let userDataLoaded = false

    let { loggedIn, username } = getContext("user");
    let user = {
        email: "",
        firstName: "",
        surname: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "",
        postcode: ""
    };
    let error = {
        email: ""
    };
    let validChangeDetected = false;

    const handleSubmit = async () => {
        const ok = await validate()
        if (ok) {
            const userDb = await getUserAccountDB($username)
            let account
            try {
                account = await userDb.get("account")
                console.log("rev comparision:", user._rev || "none", account._rev || "none")
                user._rev = account._rev
            } catch(e) {
                console.log("getAccount error: ", e)
            } finally {
                user._id = "account"
                await userDb.put(user)
            }
        }
        if (validChangeDetected) {
            // Update DB with user info
            validChangeDetected = false;
        }
    }

    const clearAllErrorText = () => {
        for (const key of Object.keys(error)) {
            error[key] = ""
        }
    }

    const validate = () => {
        return new Promise((resolve, reject) => {
            const schema = yup.object().shape({
                email: yup.string().email().required(),
                firstName: yup.string().nullable(),
                surname: yup.string().nullable(),
                addressLine1: yup.string().nullable(),
                addressLine2: yup.string().nullable(),
                city: yup.string().nullable(),
                country: yup.string().nullable(),
                postcode: yup.string().nullable()
            })
            clearAllErrorText()
            schema.validate(user, {abortEarly: false}).then(() => {
                validChangeDetected = true;
                resolve(true)
            }).catch(err => {
                (err.inner || []).forEach(err => {
                    error[err.path] = err.message
                })
                validChangeDetected = false;
                resolve(false)
            })
        })
    }
    $: {
        
    }
    onMount(async () => {
        console.log("==== getting user data for " + $username)
        const userDb = await getUserAccountDB($username)
        try {
            user = await userDb.get("account")
        } catch(e) {
            // not found?
            console.log(e)
        } finally {
            userDataLoaded = true
        }
    });
</script>

<svelte:head>
    <title>advocat. account</title>
</svelte:head>

<style>
    .login-redirect {
        margin: 0 auto;
        text-align: center;
    }
</style>

{#if $loggedIn && userDataLoaded}
    <form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
        <div>
            <p>Personal Information</p>
            <TextField label="Email" bind:value={user.email} error={error.email} />
            <TextField label="Name" bind:value={user.name} />
        </div>

        <br>
        <div>
            <p>Address</p>
            <TextField label="Address Line 1" bind:value={user.addressLine1} />
            <TextField label="Address Line 2" bind:value={user.addressLine2} />
            <TextField label="Town/City" bind:value={user.city} />
            <TextField label="Post/Zip Code" bind:value={user.postcode} />
            <TextField label="Country" bind:value={user.country} />
            <TextField label="Phone Number" bind:value={user.phoneNumber} />
        </div>
        <br>
            <p>GP Practice/Family Doctor Information</p>
            <TextField label="Name" bind:value={user.GP_name} />
            <TextField label="Email" bind:value={user.GP_Email} /> 
            <TextField label="Address Line 1" bind:value={user.GP_addressLine1} />
            <TextField label="Address Line 2" bind:value={user.GP_addressLine2} />
            <TextField label="Town/City" bind:value={user.GP_city} />
            <TextField label="Post/Zip Code" bind:value={user.GP_postcode} />
            <TextField label="Country" bind:value={user.GP_country} />
            <TextField label="Phone Number" bind:value={user.GP_phoneNumber} />
            <Checkbox label="Allow my doctor to access my data." bind:value={user.GP_consent} />
        <br>
        <Button block type="submit" disabled={!validChangeDetected}>Update Information</Button>
    </form>
    <br>
    <Button type="button" href="change_password">Change Password</Button>
{:else}
    <div class="login-redirect">
        <br><br>
        <p>Please login to edit account information</p>
        <br>
        <Button type="button" href="login">Login now!</Button>
    </div>
{/if}
