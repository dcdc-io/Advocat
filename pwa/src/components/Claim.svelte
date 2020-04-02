<script>
    import { getContext } from 'svelte';
    import Edit from "svelte-material-icons/briefcaseEditOutline.svelte";
    import Delete from "svelte-material-icons/briefcaseRemoveOutline.svelte";
    import TemplateForm from "../components/TemplateForm.svelte";

    export let claim;

    let IsEditing;

    const button_edit = () =>{
        // TODO: some warning needs to go up about invalidating previous proofs when you do this.
        isEditing = true
    }
    const button_delete = () =>{
        // TODO: spin up a dialogue to confirm first
    }
        
    const updateClaim = () => {IsEditing = false}
    const cancelledClaim = () => {IsEditing = false}

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
        {#if IsEditing}
            <TemplateForm  on:cancel={cancelledClaim} on:completed={updateClaim}  form={claim.formName} edit={claim}></TemplateForm>
        {:else}
            <h5> {claim.formName} - v{claim.formVersion}  <Edit size=4em ></Edit> </h5> 
            {#each claim.fields.sort( (a,b) => a.order - b.order) as data}
                <div class="claim-field">
                    <label class="claim-field-name">{data.name}:</label>
                    <span class="claim-field-data">{data.value}</span>
                </div>
            {/each}      
            <Edit size=3em on:click={button_edit} ></Edit><Delete size=3em on:click={button_delete}></Delete>
        {/if}
    {/if}
</div>