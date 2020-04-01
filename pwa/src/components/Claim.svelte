<script>
    import { onMount, getContext } from 'svelte';
    export let claim;

    onMount(() => {
        console.log(claim)   
    })
</script>

<style>
.claim-container{
    margin: 3px;
    border: 1px black;
}
</style>

<div class="claim-container" id="claim.formName">
    {#if claim}
        <h5> {claim.formName} - version {claim.formVersion}</h5>
        {#each claim.fields as data}
            <div class="claim-field">
                <label class="claim-field-name">{data.name}:</label>
                <span class="claim-field-data">{data.value}</span>
            </div>
        {/each}

    {:else}
        no claim being passed
    {/if}
</div>