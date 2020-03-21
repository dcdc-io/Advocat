<svelte:head>
	<title>Jobs for your group</title>
</svelte:head>
<h1>Jobs List</h1>  

<style>
    .jobs_list {
        display: yes; 
    }
    .job {
        padding: 0.5em;        
        border: 2px solid var(--colour-scheme-dark);
        border-radius: 12px;
        margin: 1em;
    }
    .urgent {
        border: 2px solid red;
        background: rgb(250, 242, 243);
    }
    .location{
        float:left;
        margin: 0px;
    }
    .distance-to-complete{
        float:right;
        margin: 0px;
    }
    .distances{
        display:flow-root;
        padding: 0px;
    }
    .failed{
        color:red;
    }
</style>

<script>
    import JobCard from "../components/JobCard.svelte";
    import LocationWidget from "../components/LocationWidget.svelte";
    import { setContext, getContext } from 'svelte'
    let location = "waiting"

    setContext("clientLocation", location)
    location = getContext("clientLocation")

    let job_details = {name: "be annoyed at this fucking piece of shit",
                       urgency: "job",
                       location: {longitude: 0.0,
                                  latitude: 0.0}
                      }

    const printshit = (result) => {
        console.log(result)
        debugger
    }                   
    let current_location
    /*
    if (navigator.geolocation) {
        current_location = navigator.geolocation.getCurrentPosition(printshit)
        console.log("using gps data")
    } else {
        current_location = {longitude: 0.1,
                            latitude: 0.1}
        console.log("using back up location")
    }*/
    
    let processClientLocation = (async function(data) {
        postcode_data = data;
        console.log("updated thing")
        console.log(data)
    })

</script>

<div class="jobs_list">
    <LocationWidget update=this.processClientLocation></LocationWidget>
    {location}
    <JobCard job={job_details}></JobCard>
    <div class="job urgent" id="1">    
        <div class="distances">
            <p class="location">5 miles away</p> 
            <p class="distance-to-complete">3 miles to complete</p>
        </div>
        <p class="job-summary">shopping run </p>
    </div>
    <div class="job" id="2">
        <div class="distances">
            <p class="location">0.2 miles away</p>
            <p class="distance-to-complete">3 miles to complete</p>
        </div>
        <p class="job-summary">pharmacy run </p>
    </div>
    <div class="job" id="3">
        <div class="distances">
            <p class="location">2 miles away</p>
            <p class="distance-to-complete">3 miles to complete</p>
        </div>
        <p class="requirements failed">requires: not being a murderer but having a white van </p>
        <p class="job-summary">draw me like one of your french girls </p>
    </div>
    <div class="job" id="4">
        <div class="distances"> 
            <p class="location">-3 miles away</p>
            <p class="distance-to-complete">3 miles to complete</p>
        </div>
        <p class="job-summary">parcel pickup</p>
    </div>
</div>

