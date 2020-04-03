<script>
    import { onMount } from "svelte"
    export let files = []
    let comp
    onMount(async () => {
        const FileField = await import('./FileField.svelte')
        comp = FileField.default
    })
</script>

<svelte:component bind:files={files} this={comp}>
    <slot />
</svelte:component>