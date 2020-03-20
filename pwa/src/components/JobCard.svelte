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
    export let job
</script>

<div class={job.urgency} id="1">    
    <div class="distances">
        <p class="location">5 miles away</p> 
        <p class="distance-to-complete">3 miles to complete</p>
    </div>
    <p class="job-summary">{job.name}</p>
</div>