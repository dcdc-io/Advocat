<script>
    import { useDatabase } from '../helpers.js'
    const workers = useDatabase("workers")
    
    let docs = await workers.allDocs()
</script>

<div>workers</div>
{#each docs as doc}
<p>a worker</p>
{/each}