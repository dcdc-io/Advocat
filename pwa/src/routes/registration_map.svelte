<script>
	import { onMount, getContext } from 'svelte';
    import { useDatabase } from '../helpers.js';
   
    const locations = useDatabase({name:"locations"})
    const users = useDatabase({name:"_users"})

    let docs = []
    locations.allDocs({include_docs: true}).then(alldocs => {
        docs = [...alldocs.rows]
    })

    //users.allDocs({include_docs: true}).then(alldocs => {

    //let { loggedIn, username } = getContext("user")

    const getLatLong = async () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((loc) => { resolve([loc.coords.longitude.toFixed(1), loc.coords.latitude.toFixed(1)]) }, (err) => { reject(err) });
            }
        })
    }

    const getDatapoints = async () => {
        return fetch('reg').then(raw => raw.json())
    }

    const getData = async () => {
        let dataObject = await getDatapoints();
        const locLatLong = await getLatLong();
        dataObject.location = locLatLong;
        return dataObject
    }
    
    let mapView;
    let data;

	onMount(async () => {
        data = await getData();
        const module = await import('../components/MapWidget.svelte'); 
		mapView = module.default;
    })

</script>
 
Reg map
<svelte:component this={mapView} data={data}/>