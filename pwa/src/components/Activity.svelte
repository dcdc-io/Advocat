<script>
    import { onMount, getContext } from "svelte"
    import gpsDistance from "gps-distance"
    import { Card, Button, Chip, Dialog } from 'smelte'
    import TemplateForm from "../components/TemplateForm.svelte";
    import { useDatabase } from '../helpers.js'

    export let activity
    let mappedActivity = JSON.parse(JSON.stringify(activity))
    activity.fields.forEach((x) => mappedActivity[x.name] = x.value)
    console.log(mappedActivity)

    const wait = ms => new Promise((r, j)=>setTimeout(r, ms))

    export let clientLocation
    let { loggedIn, username } = getContext("user");
    let isAuthor
    let isAssigned
    // let isAuthor = true
    // let isAssigned = false
    let acceptDecline = false
    let expanded = false

    let distance_in_km
    let distance = 0

    let postcode_url = "https://api.postcodes.io/postcodes/"
    let postcode_data = {result: {postcode: "loading",
                                  longitude: 0.0,
                                  latitude: 0.0}}
    $: postcode_data, getDistanceToActivity()
    $: clientLocation, getDistanceToActivity()
    $: activity, getDistanceToActivity()

    let showDeleteDialog = false
    let isEditing;

    const button_edit = () => {
        // TODO: some warning needs to go up about invalidating previous proofs when you do this.
        isEditing = true
    }

    const button_delete = async () => {
        // Check Docs re replication
        await (await getUserAccountDB($username)).remove(activity)
    }

    const button_done = () => {
        console.log("done")
    }

    const button_accept = async () => {
        activity.assigned = $username
        const activitiesDB = await useDatabase({name: 'job_index'})
        activitiesDB.put(activity)
    }

    const button_decline = async () => {
        await wait(300)
        expanded = false
    }

    const getAge = () => {
        return ((Date.now() - mappedActivity.created) / 60000).toFixed(0)
    }

    // const button_more = () => {
    //     promise = expand()
    // }

    // const expand = async () => {
    //     console.log('attempting to expand')
    //     return true
    // }

    // const button_less = () => {
    //     promise = shrink()
    // }

    // const shrink = async () => {
    //     return false
    // }

    let processPostcode = (async function(data) {
        postcode_data = data;
        // console.log(data)
        // console.log(postcode_url)
        // distance = getDistanceToActivity()
    })
    
    let getLocationByPostcode = (async function() {
        const response = await fetch(postcode_url + mappedActivity.postZipCode);
        processPostcode(await response.json())
    });
  
    onMount(async function() {
        isAuthor = $username === activity.author
        isAssigned = $username === activity.assigned
        if ((postcode_data.result.latitude === 0.0) &&
            (postcode_data.result.latitude === 0.0)) {
            await getLocationByPostcode()
        }
    })
    
    let getDistanceToActivity = function() {
        // distance_in_km = gpsDistance(clientLocation.latitude,
        //                        clientLocation.longitude,
        //                        postcode_data.result.latitude,
        //                        postcode_data.result.longitude)
        distance_in_km = 50
        if ((clientLocation.latitude === 0.0) &&
            (clientLocation.longitude === 0.0)) {
            distance = "?" } 
        else {
            distance = Math.round((distance_in_km * 0.621371) * 10) / 10
        }
    }
</script>

<style>
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
    .card-title {
        font-family: "ChangaOne Regular";
    }
    .card-text {
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }
</style>

<!-- <Card.Card>
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
    <div slot="actions"></div>
</Card.Card> -->

<div class="activity-container" id="activity.formName">
    {#if activity}
        {#if isEditing}
            <!-- <TemplateForm  on:cancel={cancelledactivity} on:completed={updateactivity} type="activity" template={[activity.formID]} edit={activity}></TemplateForm> -->
            <TemplateForm type="activity" template={[activity.formID]} edit={activity}></TemplateForm>
        {:else}
            <Button icon="{mappedActivity.icon}"></Button>
            <br/> 
            <h5>{mappedActivity.formName}</h5> 
            <span>{mappedActivity.postZipCode}</span>&nbsp;&nbsp;&nbsp;<span>Posted {getAge()} minutes ago</span>
            <br/><br/>
            <Chip icon="done" on:click={button_done}>Done</Chip>
            <br/><br/>
            {#if expanded}
                {#if isAuthor || isAssigned}
                    {#each activity.fields.reverse() as data}
                        <div class="activity-field">
                            <label class="activity-field-name">{data.name}:</label>
                            <span class="activity-field-data">{data.value}</span>
                        </div>
                    {/each}
                    <br/><br/>   
                    <Chip icon="edit" on:click={button_edit}>edit</Chip>
                    <Chip icon="delete" on:click={() => showDeleteDialog = true}>delete</Chip>
                    <br/><br/>
                {:else}   
                    <Chip icon="thumb_up_alt" on:click={button_accept}>I can help!</Chip>
                    <Chip icon="thumb_down_alt" on:click={button_decline}>Sorry, I can't help.</Chip>
                    <br/><br/>
                {/if}
                <Chip icon="expand_less" on:click={() => expanded = false}>Less</Chip>
            {:else}
                <Chip icon="expand_more" on:click={() => expanded = true}>More</Chip>
            {/if}
        {/if}
    {/if}
</div>

<Dialog bind:value={showDeleteDialog}>
  <h5 slot="title">Delete this activity?</h5>
  <div class="text-gray-700">If you delete this there is no way to get it back</div>
  <div slot="actions">
    <Button text on:click={() => {showDeleteDialog = false; button_delete();}}>Yes</Button>
    <Button text on:click={() => showDeleteDialog = false}>No</Button>
  </div>
</Dialog>