<script context="module">
    export const preload = (page) => {
        const { token } = page.params
        return { token }
    }
</script>
<script>
    import { onMount } from "svelte"
    import { urlBase64ToBase64 } from "../../helpers"

    export let token
    export let decoded

    onMount(async () => {
        decoded = JSON.parse(atob(urlBase64ToBase64(token)))
        /* decoded will be an object like {
            // signature expiration
            exp: 1586511429926
            // signature issued at
            iat: 1586511428866
            // reference to _id of document in user db
            ref: "void-uk-covid-19-antibody-test5a546be68032fbb0318a66589a7018ac"
            // signature of whole document + iat + exp
            sig: "PCd_o2UwfRakpSVCIpnheuCXSOG7gk6hUI19XvORwayKwifgZZz4LnNiMWEpXtnV75ZCXQVdJfw9dmyqRvXMEg"
            // user _id hash
            sub: "f4e7a1dd379adf779f88262d7f5193d7"
        } */
    })
</script>

{#if decoded}
    
hello { token }

here is a token:

{decoded}

{/if}