<script>
    import Claim from "../components/claim.svelte";
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
      
    let { loggedIn, username } = getContext("user");
    let docs;
    let db

    const init = async () => {
        db = await getUserAccountDB($username)
        /* TODO: this causes client side memory leak 
        db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', function(change) {updateDocs()})
        */
        updateDocs()
    }

    const updateDocs = async () =>{
        docs = (await db.allDocs({include_docs: true})).rows.filter(row => {
            return row.doc.type === "claim"
        })
    }
    onMount(()=>{
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