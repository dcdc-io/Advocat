<svelte:head>
	<title>Jobs for your group</title>
</svelte:head>
<h1>Jobs List</h1>  

<style>
    .jobs_list {
        display: yes; 
    }
    
</style>

<script>
    import JobCard from "../components/JobCard.svelte";
    import CreateJob from "../components/CreateJob.svelte";
    import LocationWidget from "../components/LocationWidget.svelte";
    import { setContext, getContext } from 'svelte'

    let location = "waiting"

    let postcode_data
    let client_coords = {longitude: 0.0,
                         latitude: 0.0}

    setContext("clientLocation", location)
    location = getContext("clientLocation")

    let jobs = [{name: "deliver toilet paper",
                 urgency: "job",
                 location: {longitude: 0.0,
                            latitude: 0.0},
                 postcode: "LS61EY"
                },
                {name: "get milk and bread",
                 urgency: "job urgent",
                 location: {longitude: 0.0,
                            latitude: 0.0},
                 postcode: "wf75ly"
                },
                {name: "get prescription",
                 urgency: "job urgent",
                 restrictions: "drugs",
                 location: {longitude: 0.0,
                            latitude: 0.0},
                 postcode: "wf110dn"}
               ]                
    
    let processClientLocation = (async function(data) {
        postcode_data = data;
        client_coords.longitude = postcode_data.result.longitude
        client_coords.latitude = postcode_data.result.latitude
        console.log("updated thing")
        console.log(data)
    })

</script>

<div class="jobs_list">
    Note: all these bit won't stay here. It's just a way to develop them all in the same place
    <LocationWidget update={processClientLocation}></LocationWidget>
    <br>

    <CreateJob></CreateJob>
    
    {#each jobs as job}
        <JobCard job={job} clientLocation={client_coords}></JobCard>
    {/each}
</div>

