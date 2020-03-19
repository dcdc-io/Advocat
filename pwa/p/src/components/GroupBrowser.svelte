<script>
    export let groups
</script>

<div>
    {#each groups as group}
    <div>
        <h3>{group.name}</h3>
        <p>group recent summary</p>
        <p>group current stats</p>
    </div>
    {/each}
</div>