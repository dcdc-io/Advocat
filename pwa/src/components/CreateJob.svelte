<script>
        import { useDatabase, signUp} from '../helpers.js'

        const jobsDB = useDatabase({name:"jobs"}).__remote

        let urgency = 0

        let job = {name: "deliver toilet paper",
                   urgency: "job",
                   location: {longitude: 0.0,
                              latitude: 0.0},
                   postcode: "LS61EY"
                  }

        const handleSubmit = () => { 
            jobsDB.post(job).then((result) =>
            {
                console.log(result)
            }).catch(error => console.log(error))  
        }
</script>
<div>
    name: <input type="text" bind:value={job.name}><br>
    house number: <input type="text" bind:value={job.housenumber}><br>
    postcode: <input type="text" bind:value={job.postcode}><br>
    urgent? <input type=checkbox bind:checked={urgency}>
    <button on:click={handleSubmit}>Save job</button>
</div>