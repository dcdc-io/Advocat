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
    const workers = useDatabase({name:"workers"})
    let editWorker = false;
    let newWorkerEmail = "";
    let newWorkerDoc;
    let error = "";

    let docs = []
    workers.allDocs({include_docs: true}).then(alldocs => {
        docs = [...alldocs.rows]
    })

    const findWorker = () => {
        const worker = workers.find({email: newWorkerEmail})
        if(worker.docs.length == 1){
            editWorker = true
            newWorkerDoc = worker
            error = ""
        }else{
            error = "worker not found"
        }
    }
    const saveWorker = () => {
    }

	let { loggedIn, username } = getContext("user")

</script>

<!-- TODO: applicants list way of adding worker.--> 

{#if editWorker}
    <card>
        name: {newWorkerDoc.name} <br>
        email: {newWorkerDoc.email} <br>
        {#if newWorkerDoc.qualifications}
            qualifictions:
                {#each newWorkerDoc.qualifications as qualification}
                    {qualification} <br>
                {/each}
		{:else}
            qualifications: none <br>
        {/if}
        status: {newWorkerDoc.status} <br>  
    </card>
    <button on:click={saveWorker}>save worker</button>
{:else}
    <p id="error"></p>
    <button on:click={findWorker}>add Worker</button>
    <input placeholder="email" bind:value={newWorkerEmail}>
{/if}

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