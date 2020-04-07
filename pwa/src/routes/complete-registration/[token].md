```js exec
    import { onMount, getContext } from "svelte"
    import MakeClaim from "../../components/MakeClaim.svelte"
    import { Checkbox } from "../../../node_modules/smelte/src"
    import { enrollDevice, unenrollDevice } from "../../helpers"

    let { username } = getContext("user")

    let readyToUse = false
    let expiredLink = false

    let disableInput
    let enroll = true
    let enrolled = false

    let more_trusted = false

    let mounted = false
    onMount(async () => {
        mounted = true
        const result = await fetch(`${window.location.href}.activate`).then(raw => raw.json()).catch(() => ({ok:false}))
        if (!result.ok) {
            if (result.reason && /expired/.test(result.reason)) {
                expiredLink = true
            }
        }
        readyToUse = true
    })

    $: {
        if (mounted && $username) {
            if (enroll && !enrolled) {
                disableInput = true
                enrollDevice({ username: $username, force: true }).then(() => {
                    enrolled = true
                    disableInput = false
                    console.log(disableInput)
                }).catch(() => 
                    disableInput = false
                )
            } else if (!enroll && enrolled) {
                disableInput = true
                unenrollDevice({ username: $username }).then(() => {
                    enrolled = false
                    disableInput = false
                }).catch(() =>
                    disableInput = false
                )
            }
        }
    }
```

```css style
li {
    list-style: disc inside none;
}
```

{#if !readyToUse}

### Please wait...

We are completing your registration.

{/if}

{#if readyToUse && !expiredLink}
### Registration Complete

#### Are you using your own device?

When you trust a device, advocat. keeps your data on your device up to date so that you can work even when you are offline.
<br/>
<Checkbox disabled={disableInput} bind:checked={enroll} label="Trust this device (recommended)." />

{#if !more_trusted}

<span class="underline" on:click={e => more_trusted = true}>more information</span>

{:else}

##### What is a trusted device?

- Trusted devices store your data in a secure area of your device that only advocat. can access.
- Trusted devices do not prompt you to login when you open advocat.
- Trusted devices can be managed and deactivated from your [account](account) page.

##### What if I don't trust this device?

- Untrusted devices only work when you are online.
- Untrusted devices will require your password more often.
- Untrusted device __cannot__ be used to sign identity claims.

<span class="underline" on:click={e => more_trusted = false}>less information</span>

{/if}
{/if}
{#if expiredLink}

### Link Expired

The registration you are trying to complete has already been completed.

{/if}
