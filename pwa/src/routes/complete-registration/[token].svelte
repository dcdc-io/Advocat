<script context="module">
    let token
    export async function preload({ params: { token: incomingToken }}) {
        token = incomingToken
        const x = await fetch(`${token}.login`)
        console.log(x)
    }
</script>

<div>hello {token}</div>