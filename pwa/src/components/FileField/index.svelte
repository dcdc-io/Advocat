<script>
    import { onMount } from "svelte"
    export let files = []
    export let filenames = []
    let comp
    onMount(async () => {
        const FileField = await import('./FileField.svelte')
        comp = FileField.default
    })
</script>

<svelte:component bind:files={files} bind:filenames={filenames} this={comp}>
    <slot />
</svelte:component>