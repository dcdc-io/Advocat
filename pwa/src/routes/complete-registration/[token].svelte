<script context="module">
    let token
    let readyToUse = false
    export async function preload({ params: { token: incomingToken }}) {
        if (window) {
            token = incomingToken
            const x = await this.fetch(`${window.location.href}.login`)
            console.log(x)
            readyToUse = true
        }
    }
</script>

<div>hello</div>

{#if readyToUse}
<div>
    this content is only available when you have signed in
</div>
{/if}