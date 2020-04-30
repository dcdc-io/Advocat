<svelte:head>
	<title>Activities</title>
</svelte:head>

<script context="module">
    let singletonDB
    let singletonUsername = ""
</script>

<script>
    import Activity from "../components/Activity.svelte";
    import CreateJob from "../components/CreateJob.svelte";
    import LocationWidget from "../components/LocationWidget.svelte";
    import { useDatabase } from "../helpers.js"
    import { setContext, getContext } from "svelte"

    let location = "waiting"
    let { loggedIn, username } = getContext("user");

    let postcode_data
    let client_coords = {longitude: 0.0,
                         latitude: 0.0}

    setContext("clientLocation", location)
    location = getContext("clientLocation")

    let activities = []
    
    
    let processClientLocation = (async function(data) {
        postcode_data = data;
        client_coords.longitude = postcode_data.result.longitude
        client_coords.latitude = postcode_data.result.latitude
        console.log("updated thing")
        console.log(data)
    })

    const updateDocs = async () => {
        console.log("update docs has been hit")
        const allDocs = await singletonDB.allDocs({include_docs: true})
        activities = allDocs.rows
    }

    export const init = async () => {
        if (singletonDB)
            await singletonDB.close()
        singletonDB = await useDatabase({name: 'job_index'})
        singletonDB.when("change", updateDocs)
        singletonUsername = $username
    }

    const loadActivities = async () => {
        await init()
        await updateDocs()
    }

    let promise = loadActivities()
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
    {#await promise}
        Loading activities...
    {:then value}
        {#each activities as activity}
        <Activity activity={activity.doc} clientLocation={client_coords}></Activity>
        <br><br>
    {/each}
    {:catch}
        Oops! Something went wrong!
    {/await}
    
</div>

