<script>
    import { getContext } from 'svelte';
    export let claim;
    import Edit from "svelte-material-icons/briefcaseEditOutline.svelte";
    import Delete from "svelte-material-icons/briefcaseRemoveOutline.svelte";


</script>

<style>
.claim-container{
    margin: 3px;
    border: 1px black;
}
</style>

<!-- TODO: if signed this should have a QR code so we can prove the signature on a trusted device -->

<div class="claim-container" id="claim.formName">
    {#if claim}
        <h5> {claim.formName} - version {claim.formVersion}  <Edit size=4em ></Edit> </h5> 
        {#each claim.fields.sort( (a,b) => a.order - b.order) as data}
            <div class="claim-field">
                <label class="claim-field-name">{data.name}:</label>
                <span class="claim-field-data">{data.value}</span>
            </div>
        {/each}      
         <Edit size=3em ></Edit><Delete size=3em ></Delete>
    {:else}
        no claim being passed
    {/if}
</div>