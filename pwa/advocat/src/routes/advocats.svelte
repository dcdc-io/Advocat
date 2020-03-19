<style>
card{
    background: lightgray;
    width: 80%;
    display: block;
    padding: 5px;
}
</style>

<script>

//TODO: if not got rights then GOTO /
    import { getContext } from 'svelte'
    import { useDatabase } from '../helpers.js'
    const workers = useDatabase({name:"advocats"})

    let docs = []
    workers.allDocs({include_docs: true}).then(alldocs => {
        docs = [...alldocs.rows]
    })

	let { loggedIn, username } = getContext("user")

</script>

<!-- TODO: applicants list way of adding worker.--> 

<div>workers</div>
{#each docs as doc}
    <card>
        name: {doc.doc.name} <br>
        email: {doc.doc.email} <br>
        last location: {doc.doc.location} <br>
        last online: {doc.doc.online} <br>
        {#if doc.doc.qualifications}
            qualifictions:
                {#each doc.doc.qualifications as qualification}
                    {qualification} <br>
                {/each}
		{:else}
            qualifications: none <br>
        {/if}
        status: {doc.doc.status} <br>
    </card>
{/each}