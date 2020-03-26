<script context="module">
    let token
    export async function preload({ params: { token: incomingToken }}) {
        token = incomingToken
        const x = await fetch('complete')
        console.log(x)
    }
</script>

<div>hello {token}</div>