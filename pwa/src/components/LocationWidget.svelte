<script>
    import { Button, TextField } from '../../node_modules/smelte/src'
    import { setContext, getContext, onMount } from 'svelte'

    let error = ""
    let location
    let isMobile = false

    const getLocationViaLatLong = async function(pos) {
        let lon = pos.coords.longitude  
        let lat = pos.coords.latitude 
        
        if (pos.coords.accuracy < 100) {
            error = `accuracy too low for good postcode detection, accuracy was within ${pos.cords.accuracy} m`
        }

        const response = await fetch(postcode_url + `?lon=${lon}&lat=${lat}`)
        const result = (await response.json()).result
        if (result) {
            postcode = result[0].postcode
        } else{
            error = `no postcodes found within 100m of your location`
        }
    }

    const getLocationViaDevice = async function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((loc) => {
                getLocationViaLatLong(loc);
            });
        }
    }

    onMount(() => {
        dispatch = createEventDispatcher()
        isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
    })
</script>

<script context="module">
    import { createEventDispatcher } from 'svelte'

    let postcode_url = "https://api.postcodes.io/postcodes"
    let postcode

    let data
    let result = {geoCode: null,
                  longitude: null,
                  latitude:  null}
    
    let dispatch = () => {}

    const processPostcode = async function(data) {
        result.geoCode  = data.result.postcode;
        result.longitude  = data.result.longitude;
        result.latitude = data.result.latitude;
        dispatch('update', result)
        return result
    }
    export const getLocation = async () => {
        const response = await fetch(postcode_url + "/" + result.geoCode);
        return processPostcode(await response.json())
    };
</script>

<div>
    <div id="error">{error}</div>
    <TextField label="postcode" bind:value={result.geoCode} />
    {#if isMobile && navigator.geolocation}
        <Button block on:click={getLocationViaDevice}>use current location</Button>
    {/if}
</div>