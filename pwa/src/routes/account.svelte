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
    .account-buttons {
        text-align: center;
    }
</style>

{#if $loggedIn && userDataLoaded}
    <form on:submit|preventDefault={handleSubmit} on:changed={validate} on:invalid={validate} on:input={validate}>
        <div>
            <div class="bg-secondary-100 border-t-4 border-secondary-500 rounded-b text-secondary-900 px-4 py-3 shadow-md" role="alert">
                <div class="flex">
                    <div class="py-1"><svg class="fill-current h-6 w-6 text-secondary-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                    <div>
                    <p class="font-bold">UK COVID-19 Antibody Test Tech Preview</p>
                    <p class="text-sm">To support our application for <a href="https://techforce19.uk/" class="underline" target="_blank">#techforce19</a> we have published a technical preview of a self service coronavirus test result tracker feature.</p>
                    <p class="text-sm">This feature is for demonstrations purposes and you can read more about how it works on our developer blog here: <a href="https://blog.advocat.group/techforce19" class="underline">blog.advocat.group/techforce19</a></p>
                    <br/>
                    <Checkbox label="Enable Tech Preview" bind:checked={user.enableTechForce19Preview} />
                    </div>
                </div>
            </div>
        </div>
        <br />

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
            <Checkbox label="Allow my doctor to access my data." bind:checked={user.GP_consent} />
        <br>
        <Button block type="submit" disabled={!validChangeDetected}>Update Information</Button>
    </form>
    <br><br>
    <div class="account-buttons">
        <Button type="button" href="change_password">Change Password</Button>
        <Button type="button" href="signout">Switch Accounts</Button>
    </div>
{:else}
    <div class="login-redirect">
        <br><br>
        <p>Please login to edit account information</p>
        <br>
        <Button type="button" href="login">Login now!</Button>
    </div>
{/if}
