<script>
    import { stores } from '@sapper/app';
    import { getContext, onMount } from 'svelte';
    import { Chip, Button, Dialog} from '../../node_modules/smelte/src'
    import TemplateForm from "../components/TemplateForm.svelte";
    import { buildFormShape, getUserAccountDB, hash, docSignature, strToUrlBase64, uint8ToUrlBase64 } from '../helpers.js'
    import VerticalDrawer from '../components/VerticalDrawer/VerticalDrawer.svelte'
    import { qrcode, svg2url  } from 'pure-svg-code' 

    export let claim;
    export let shareUrl = ""

    const { page } = stores();
    let share = false 
    let dataUrl = ""
    let showDeleteDialog = false

    let { loggedIn, username } = getContext("user");
    let isEditing;

    const button_edit = () =>{
        // TODO: some warning needs to go up about invalidating previous proofs when you do this.
        isEditing = true
    }
    const button_delete = async () => {
        await (await getUserAccountDB($username)).remove(claim)
    }

    const button_share = async () => {
        share = true
        const iat = Date.now()
        const exp = iat + 60 + 1000
        let sig = await docSignature(claim, iat, exp)
        let newClaim = {
            sub: hash($username),
            ref: claim._id,
            iat,
            exp,
            sig: uint8ToUrlBase64(sig)
        }
        let path = strToUrlBase64(JSON.stringify(newClaim))

        shareUrl = `${$page.host.includes("localhost") ? "http" : "https"}://${$page.host}/verify/${path}.claim`
        dataUrl = svg2url(qrcode({ content:shareUrl, ecl: "L" }))
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
            <!-- <TemplateForm  on:cancel={cancelledClaim} on:completed={updateClaim} type="claim" template={[claim.formID]} edit={claim}></TemplateForm> -->
        {:else}
            <h5> {claim.formName} - v{claim.formVersion} </h5> 
            {#each claim.fields.sort( (a,b) => a.order - b.order) as data}
                <div class="claim-field">
                    <label class="claim-field-name">{data.name}:</label>
                    <span class="claim-field-data">{data.value}</span>
                </div>
            {/each}      
            <Chip icon="edit"  on:click={button_edit}>edit</Chip>
            <Chip icon="delete" on:click={() => showDeleteDialog = true}>delete</Chip>
            <Chip icon="verified_user" on:click={button_share}>verify</Chip>
            <Chip icon="share" on:click={button_share}>share</Chip>
        {/if}
    {/if}
</div>

<Dialog bind:value={showDeleteDialog}>
  <h5 slot="title">Delete this claim?</h5>
  <div class="text-gray-700">If you delete this and it was signed, it will be a pain to get it back</div>
  <div slot="actions">
    <Button text on:click={() => {showDeleteDialog = false; button_delete();}}>Yes</Button>
    <Button text on:click={() => showDeleteDialog = false}>No</Button>
  </div>
</Dialog>

<VerticalDrawer bottom={true} persistent={false} bind:show={share}>
    <div style="margin: 2em;">
        <span>{shareUrl}</span>
        <img src={dataUrl} style="width:100%;"/> 
    </div>
</VerticalDrawer>