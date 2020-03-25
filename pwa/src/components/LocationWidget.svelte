<script>
    import { Button, TextField } from 'smelte'
    import { setContext, getContext } from 'svelte'

    export let update

    console.log("update")
    console.log(update)

    update("blah")

    let error
    let location
    let postcode
    let data
    let postcode_url = "https://api.postcodes.io/postcodes"
    let isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

    //let _this = this

    let result = {postcode:  null,
                  easting: null,
                  northing:  null}
     
    const processPostcode = async function(data) {
        result.geoCode  = data.result.postcode;
        result.easting  = data.result.easting;
        result.northing = data.result.northing;
        update(data)
        return result
    }

    const getLocationViaLatLong = async function(pos){
        let lon = pos.coords.longitude  
        let lat = pos.coords.latitude 
        
        if(pos.coords.accuracy < 100)
        {
            error = `accuracy too low for good postcode, accuracy detected = ${pos.cords.accuracy} m`
        }

        const response = await fetch(postcode_url + `?lon=${lon}&lat=${lat}`)
        const result = (await response.json()).result
        if(result){
            postcode = result[0].postcode
        } else{
            error = `no postcodes found within 100m of your location`
        }
    }

    const getLocationViaDevice = async function() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((loc) => {
                getLocationViaLatLong(loc);
            });
        }
    }
</script>

<script context="module">    
    export async function getLocation() {
        const response = await fetch(postcode_url + "/" + postcode);
        return processPostcode(await response.json())
    };
</script>

<div>
    <div id="error">{error}</div>
    <TextField label="postcode" bind:value={postcode} />
    <!-- <Button on:click={getLocationByPostcode}>get location by postcode</Button>  -->
    {#if isMobile && navigator.geolocation}
        <Button block on:click={getLocationViaDevice}>use current location</Button>
    {/if}
</div>