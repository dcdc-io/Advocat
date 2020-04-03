<script context="module">

    let singletonDB = false
    let singletonUsername = ""
    let docs

    const updateDocs = async () =>{
        docs.set((await singletonDB.allDocs({include_docs: true})).rows.filter(row => {
            return row.doc.type === "claim"
        }))
    }

    export const init = async (username) => {
        if(username === singletonUsername)
            return singletonDB
        if(singletonDB)
            singletonDB.close()       

        singletonDB = await getUserAccountDB(username)
        singletonDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', function(change) {updateDocs()})
        
        singletonUsername = username
        updateDocs();
    }
</script>

<script>
    import Claim from "../components/claim.svelte";
    import { onMount, getContext,setContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'   

    let { loggedIn, username } = getContext("user");

    onMount( async () =>{
        await init($username, this);
    })

</script>


<div class="claim-list">
    {#if docs}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {/if}
</div>