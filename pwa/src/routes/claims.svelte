<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import { Button, Snackbar, notifier, Notifications } from '../../node_modules/smelte/src'
    import Claim from "../components/claim.svelte";
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let makingNewClaim = false
    let docs;

    const init = async () => {
        docs = await (await getUserAccountDB($username)).allDocs({include_docs: true});
        docs = docs.rows.filter(row => {
            return row.doc.type === "claim"
        })
    }

    const clickHandler = () =>{
        makingNewClaim = true;
    }

    const completedClaim = _ => {
        makingNewClaim = false;
        notifier.notify("Claim successfully recorded.")
        init()
    }

    onMount(() => {
        init();
    })
</script>

{#if makingNewClaim}
    <!-- will have dropdown in future to select form  -->
    <TemplateForm on:completed={completedClaim} template="void-uk-covid-19-antibody-test"></TemplateForm>
{:else}
    <Button on:click={clickHandler} block>Record COVID-19 Antibody Test</Button>
{/if}

<div class="claim-list">
    {#if docs}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {/if}
</div>

<Notifications />
