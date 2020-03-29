<script>
    export let question;
    export let answer; 
</script>

<h5>{question}</h5>
{#each answer as line}
    {#if Array.isArray(line)}
        <ul class="list-disc list-inside">
            {#each line as item}
                <li>{item}</li>
            {/each}
        </ul>
    {:else}
        <p>{@html line}</p>
    {/if}
{/each}

