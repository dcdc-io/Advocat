<script>
    import { useDatabase } from '../helpers.js'
    const workers = useDatabase({name:"workers"})
    let docs = []
    workers.allDocs().then(alldocs => {
        docs = [...alldocs.rows]
    })
</script>

<div>workers</div>
{#each docs as doc}
<p>a worker</p>
{/each}