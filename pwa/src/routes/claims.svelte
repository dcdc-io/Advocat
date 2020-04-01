<script>
    import TemplateForm from "../components/TemplateForm.svelte";
    import Claim from "../components/claim.svelte";
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let makingNewClaim = false
    let docs;

    const init = async () => {
        window.db = await getUserAccountDB($username)
        docs = await (await getUserAccountDB($username)).allDocs({include_docs: true});
        docs = docs.rows.filter(row => {
            return row.doc.type === "claim"
        })
    }

    const clickHandler = () =>{
        makingNewClaim = true;
    }

    onMount(() => {
        init();
    })
</script>

{#if makingNewClaim}
    <!-- will have dropdown in future to select form  -->
    <TemplateForm template="void-uk-covid-19-antibody-test"></TemplateForm>
{:else}
    <button on:click={clickHandler}></button>
{/if}

<div class="claim-list">
    {#if docs}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {/if}
</div>

