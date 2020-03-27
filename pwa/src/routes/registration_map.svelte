<script>
	import { onMount, getContext } from 'svelte';
    import { useDatabase } from '../helpers.js'
   
    const locations = useDatabase({name:"locations"})
    const users = useDatabase({name:"_users"})

    let docs = []
    locations.allDocs({include_docs: true}).then(alldocs => {
        docs = [...alldocs.rows]
    })

    //users.allDocs({include_docs: true}).then(alldocs => {

    // let { loggedIn, username } = getContext("user")
    

    let mapView;
    let data = {
        location: [-0.08191999999999999, 51.5473408], // startpoint
        dataPoints: [
            [-0.08191999999999999, 51.5473408],
            [-0.08191999999999999, 51.5573408]
        ]
    }

	onMount(async () => {
        const module = await import('../components/MapWidget.svelte'); 
		mapView = module.default;
    })

</script>
 
Reg map
<svelte:component this={mapView} data={data}/>