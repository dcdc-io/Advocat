<script>
    import { onMount, getContext } from "svelte"
    import gpsDistance from "gps-distance"
    import { Card, Button, Chip, Dialog } from 'smelte'
    import TemplateForm from "../components/TemplateForm.svelte";

    export let activity
    export let clientLocation
    let { loggedIn, username } = getContext("user");
    let isAuthor = username === activity.author
    let isAssigned = username === activity.assigned
    let acceptDecline = false
    let expanded = false

    let distance_in_km
    let distance = 0

    let postcode_url = "https://api.postcodes.io/postcodes/"
    let postcode_data = {result: {postcode: "loading",
                                  longitude: 0.0,
                                  latitude: 0.0}}
    $: postcode_data, getDistanceToJob()
    $: clientLocation, getDistanceToJob()
    $: activity, getDistanceToJob()

    let showDeleteDialog = false
    let isEditing;

    const button_edit = () =>{
        // TODO: some warning needs to go up about invalidating previous proofs when you do this.
        isEditing = true
    }

    const button_delete = async () => {
        await (await getUserAccountDB($username)).remove(activity)
    }

    const button_done = () => {
        console.log("done")
    }

    const button_accept = () => {
        console.log("accepted!")
    }

    const button_decline = () => {
        acceptDecline = false
    }

    const button_acceptdecline = () => {
        acceptDecline = true
    }

    const getAge = () => {
        return (Date.now() - activity.created) / 60000
    }

    const button_more = () => {
        expanded = true
    }

    const button_less = () => {
        expanded = false
    }

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
    <div slot="actions"></div>
</Card.Card>

<div class="activity-container" id="activity.formName">
    {#if activity}
        {#if isEditing}
            <TemplateForm  on:cancel={cancelledactivity} on:completed={updateactivity} type="activity" template={[activity.formID]} edit={activity}></TemplateForm>
        {:else}
            <h5>{activity.name}</h5> 
            <span>{activity.postcode}</span>&nbsp;&nbsp;&nbsp;<span>Posted {getAge} minutes ago</span>
            <div>{activity.icon}</div> 
            <Chip icon="done" on:click={button_done}>Done</Chip>  
            {#if $expanded}
                {#if $isAuthor || $isAssigned}
                    {#each activity.fields.sort( (a,b) => a.order - b.order) as data}
                        <div class="activity-field">
                            <label class="activity-field-name">{data.name}:</label>
                            <span class="activity-field-data">{data.value}</span>
                        </div>
                    {/each}     
                    <Chip icon="edit" on:click={button_edit}>edit</Chip>
                    <Chip icon="delete" on:click={() => showDeleteDialog = true}>delete</Chip>
                {:else}
                    <Chip icon="thumb_up_alt" on:click={button_accept}>I can help!</Chip>
                    <Chip icon="thumb_down_alt" on:click={button_decline}>Sorry, I can't help.</Chip>
                {/if}
                <Chip icon="expand_less" on:click={button_less}>Less</Chip>
            {:else}
                <Chip icon="expand_more" on:click={button_more}>More</Chip>
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