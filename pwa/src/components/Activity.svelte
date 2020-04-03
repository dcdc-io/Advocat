<script>
    import { onMount } from "svelte"
    import gpsDistance from "gps-distance"
    import { Card, Button } from 'smelte'

    export let activity
    export let clientLocation

    let distance_in_km
    let distance = 0

    let postcode_url = "https://api.postcodes.io/postcodes/"
    let postcode_data = {result: {postcode: "loading",
                                  longitude: 0.0,
                                  latitude: 0.0}}
    $: postcode_data, getDistanceToJob()
    $: clientLocation, getDistanceToJob()
    $: activity, getDistanceToJob()

    let processPostcode = (async function(data) {
        postcode_data = data;
        console.log(data)
        console.log(postcode_url)
        //distance = getDistanceToJob()
    })
    
    let getLocationByPostcode = (async function() {
        const response = await fetch(postcode_url + job.postcode);
        processPostcode(await response.json())
    });
  
    onMount(async function() {
        if ((postcode_data.result.latitude === 0.0) &&
            (postcode_data.result.latitude === 0.0)) {
            await getLocationByPostcode()
        }
    })
    
    let getDistanceToJob = function() {
        console.log("get distance called")
        distance_in_km = gpsDistance(clientLocation.latitude,
                               clientLocation.longitude,
                               postcode_data.result.latitude,
                               postcode_data.result.longitude)
        if ((clientLocation.latitude === 0.0) &&
            (clientLocation.longitude === 0.0)) {
            distance = "?" } 
        else {
            distance = Math.round((distance_in_km * 0.621371) * 10) / 10
        }
    }
</script>

<style>
    /* .jobs_list {
        display: yes; 
    }
    .job {
        padding: 0.5em;        
        border: 2px solid var(--colour-scheme-dark);
        border-radius: 12px;
        margin: 1em;
    } */
    /* .urgent {
        border: 2px solid red;
        background: rgb(250, 242, 243);
    } */
    .location{
        /* float: left; */
        margin: 0px;
    }
    .distance-to-complete{
        /* float: right; */
        margin: 0px;
    }
    .distances{
        display:flow-root;
        padding: 0px;
    }
    .failed{
        color:red;
    }
    /* .card-sizer {
        display: block;
    } */
    .card-title {
        font-family: "ChangaOne Regular";
    }
    .card-text {
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
</style>

<Card.Card>
    <div slot="title" class="card-title">
        <Card.Title
            title={activity.name}
            subheader={activity.postcode}
        />
    </div>
    <div slot="text" class="p-8 pb-5 pt-5 text-gray-700 body-1 card-text">    
        <div class="distances">
            <p class="location">{postcode_data.result.postcode}</p> 
            <p class="distance-to-complete">{distance} miles</p>
        </div>  
        {#if activity.restrictions}
            Advocat restrictions:
            <p class="requirements failed"> - {activity.restrictions}</p>
        {/if}
    </div>
    <div slot="actions">

    </div>
</Card.Card>