<script>
    import { getContext, onMount } from 'svelte';
    import { Chip } from '../../node_modules/smelte/src'
    import TemplateForm from "../components/TemplateForm.svelte";
    import { getUserAccountDB } from '../helpers.js'
    import VerticalDrawer from '../components/VerticalDrawer/VerticalDrawer.svelte'
    import { qrcode, svg2url  } from 'pure-svg-code' 

    export let claim;

    let share = false
    let dataUrl = ""

    let { loggedIn, username } = getContext("user");
    let isEditing;

    const button_edit = () =>{
        // TODO: some warning needs to go up about invalidating previous proofs when you do this.
        isEditing = true
    }
    const button_delete = async () =>{
        // TODO: spin up a dialogue to confirm first
        await (await getUserAccountDB($username)).remove(claim)
    }
    const button_share = async () => {
        share = true
        dataUrl = svg2url(qrcode(`https://advocat.group/verify/${$username}.${claim._id}`))
    }
        
    const updateClaim = () => {isEditing = false}
    const cancelledClaim = () => {isEditing = false}

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
        {#if isEditing}
            <TemplateForm  on:cancel={cancelledClaim} on:completed={updateClaim} template={claim.formID} edit={claim}></TemplateForm>
        {:else}
            <h5> {claim.formName} - v{claim.formVersion} </h5> 
            {#each claim.fields.sort( (a,b) => a.order - b.order) as data}
                <div class="claim-field">
                    <label class="claim-field-name">{data.name}:</label>
                    <span class="claim-field-data">{data.value}</span>
                </div>
            {/each}      
            <Chip icon="edit"  on:click={button_edit}>edit</Chip>
            <Chip icon="delete" on:click={button_delete}>delete</Chip>
            <Chip icon="verified_user" on:click={button_share}>verify</Chip>
            <Chip icon="share" on:click={button_share}>share</Chip>
        {/if}
    {/if}
</div>


<VerticalDrawer bottom={true} persistant={true} bind:show={share}>
    <div style="margin: 2em;">
        <img src={dataUrl} style="width:100%;"/> 
    </div>
</VerticalDrawer>