<script>
    import { setContext, getContext } from 'svelte'

    export let postcodedata
    export let update

    let location
    let postcode
    let postcode_url = "https://api.postcodes.io/postcodes/"

    //let _this = this

    postcodedata = {result: {postcode: "loading",
                                  longitude: 0.0,
                                  latitude: 0.0}}
    
    let processPostcode = (async function(data) {
        postcodedata = data;
        console.log(data)
        console.log(postcode_url)
        //TODO: pass data back to parent
        //update(data)
        //location = setContext("clientLocation", "in thingy")
        //_this.fire("locationfound", data)
    })

    let getLocationByPostcode = (async function() {
        const response = await fetch(postcode_url + postcode);
        processPostcode(await response.json())
    });


</script>
<div>
    enter your postcode <input type="text" bind:value={postcode}><br>
    <button on:click={getLocationByPostcode}>get location by postcode</button>
    {postcodedata.result.longitude}, {postcodedata.result.latitude}
</div>