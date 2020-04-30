<script context="module">
    let singletonDB
    let singletonUsername = ""
</script>

<script>
    import Claim from "../components/Claim.svelte"
    import { getContext, setContext } from 'svelte'
    import { getUserAccountDB } from '../helpers.js'

    let { loggedIn, username } = getContext("user")

    let docs = []
    
    const updateDocs = async () => {
        const allDocs = await singletonDB.allDocs({include_docs: true})
        docs = allDocs.rows.filter(row => {
            return row.doc.type === "claim"
        })
    }

    export const init = async () => {
        if (singletonDB)
            await singletonDB.close()
        singletonDB = await getUserAccountDB($username)
        singletonDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', change => {
            updateDocs()
        })
        singletonUsername = $username
    }

    const loadClaims = async () => {
        await init()
        await updateDocs()
    }

    let promise = loadClaims()
</script>

<div class="claim-list">
    {#await promise}
        Loading claims...
    {:then value}
        {#each docs as doc}
            <Claim claim={doc.doc}></Claim>
        {/each}
    {:catch}
        Oops! Something went wrong!
    {/await}
</div>
