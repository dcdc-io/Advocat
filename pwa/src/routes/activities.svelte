<svelte:head>
	<title>Activities</title>
</svelte:head>

<script>
    import Activity from "../components/Activity.svelte";
    import CreateJob from "../components/CreateJob.svelte";
    import LocationWidget from "../components/LocationWidget.svelte";
    import { setContext, getContext } from 'svelte'

    let location = "waiting"

    let postcode_data
    let client_coords = {longitude: 0.0,
                         latitude: 0.0}

    setContext("clientLocation", location)
    location = getContext("clientLocation")

    let activities = [
        {
            name: "Deliver toilet paper",
            urgency: "job",
            location: {
                longitude: 0.0,
                latitude: 0.0
            },
            postcode: "LS61EY"
        },
        {
            name: "Get milk and bread",
            urgency: "job urgent",
            location: {
                longitude: 0.0,
                latitude: 0.0
            },
            postcode: "WF75LY"
        },
        {
            name: "Get prescription",
            urgency: "job urgent",
            restrictions: "drugs",
            location: {
                longitude: 0.0,
                latitude: 0.0
            },
            postcode: "WF110DN"
        }
    ]
    
    let processClientLocation = (async function(data) {
        postcode_data = data;
        client_coords.longitude = postcode_data.result.longitude
        client_coords.latitude = postcode_data.result.latitude
        console.log("updated thing")
        console.log(data)
    })
</script>

<style>
    /* .jobs_list {
        display: yes; 
    }   */
</style>

<div class="jobs_list">
    <!-- Note: all these bit won't stay here. It's just a way to develop them all in the same place -->
    <!-- <LocationWidget dispatch={processClientLocation}></LocationWidget>
    <br> -->

    <!-- <CreateJob></CreateJob> -->
    
    {#each activities as activity}
        <Activity activity={activity} clientLocation={client_coords}></Activity>
        <br><br>
    {/each}
</div>

