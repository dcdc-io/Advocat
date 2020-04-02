<script>
    import { onMount } from "svelte"
    import MakeClaim from "../../components/MakeClaim.svelte";

    
    let readyToUse = false
    let expiredLink = false
    
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
    <MakeClaim></MakeClaim>
</div>
{/if}

{#if expiredLink}
<div>
    The registration you are trying to complete has already been completed.
</div>
{/if}
