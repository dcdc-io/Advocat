<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import { Button, Snackbar, notifier, Notifications } from '../../node_modules/smelte/src'
    import Claim from "../components/claim.svelte";
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let claimBeingMade = false
    let docs;

    const init = async () => {
        docs = await (await getUserAccountDB($username)).allDocs({include_docs: true});
        docs = docs.rows.filter(row => {
            return row.doc.type === "claim"
        })
    }

    const completedClaim = _ => {
        claimBeingMade = false;
        notifier.notify("Claim successfully recorded.")
        init()
    }

    const cancelledClaim = _ => {
        claimBeingMade = false;
        notifier.notify("Claim was cancelled")
    }

    const button_COVID19 = () =>{
        claimBeingMade = "void-uk-covid-19-antibody-test";
    }

    const button_GP = () =>{
        claimBeingMade = "void-uk-is-gp";
    }

    onMount(() => {
        init();
    })
</script>

<div class="claim-list">
    {#if docs}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {/if}
</div>

{#if claimBeingMade}
    <TemplateForm on:canvel={cancelledClaim} on:completed={completedClaim} template={claimBeingMade}></TemplateForm>
{:else}
<!-- TODO: in future this will be a dropdown -->
    <div class="button-container">
    <!-- TODO: disable button when record exists and template is unique? -->
        <Button on:click={button_GP} block>I'm a GP in the UK</Button> <br><br> 
        <Button on:click={button_COVID19} block>Record COVID-19 Antibody Test</Button>
    </div>
{/if}

<Notifications />
