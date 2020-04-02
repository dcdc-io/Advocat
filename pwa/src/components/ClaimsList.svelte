<script>
    import Claim from "../components/claim.svelte";
    import { onMount, getContext } from 'svelte';
    import { getUserAccountDB } from '../helpers.js'
    
    let { loggedIn, username } = getContext("user");
    let docs;
    let db

    export const updateDocs = async () =>{
        docs = (await db.allDocs({include_docs: true})).rows.filter(row => {
            return row.doc.type === "claim"
        })
    }
    onMount(()=>{
        db = init($username);
        updateDocs();
    })
</script>

<script context="module">
    let singletonDB
    let singletonUsername
    export const init = async (username) => {
        if(username == singletonUsername)
            return singletonDB
        if(singletonDB)
            singletonDB.close()         
        singletonDB = await getUserAccountDB(username)
        singletonDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', function(change) {updateDocs()})
        updateDocs()
        let singletonUsername = username
        let singletonDB = db
        return db;
    }
</script>

<div class="claim-list">
    {#if docs}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {/if}
</div>