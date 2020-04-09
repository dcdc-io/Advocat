<script context="module">
    let singletonDB
    let singletonUsername = ""
</script>

<script>
    import Claim from "../components/Claim.svelte"
    import { onMount, getContext, setContext } from 'svelte'
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
        if ($username === singletonUsername)
            return singletonDB
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

    onMount(async () => {
        await init()
        await updateDocs()
    })

</script>


<div class="claim-list">
    {#each docs as doc}
        <Claim claim={doc.doc}></Claim>
    {/each}
</div>
