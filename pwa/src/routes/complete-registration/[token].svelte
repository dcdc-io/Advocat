<script>
    let readyToUse = false
    let expiredLink = false
    import { onMount } from "svelte"
    onMount(async () => {
        const result = await fetch(`${window.location.href}.login`).then(raw => raw.json())
        console.log(result)
        if (!result.ok) {
            if (result.reason && /expired/.test(result.reason)) {
                expiredLink = true
            }
        }
        readyToUse = true
    })
</script>

{#if !readyToUse}
<div>Please wait...</div>
{/if}

{#if readyToUse && !expiredLink}
<div>
    This content is only available when you have signed in
</div>
{/if}

{#if expiredLink}
<div>
    The registration you are trying to complete has already been completed.
</div>
{/if}