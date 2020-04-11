<svelte:head>
	<title>Volunteers</title>
</svelte:head>

<script>
	import { onMount, getContext } from 'svelte';

    const getLatLong = async () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((loc) => { resolve([loc.coords.longitude, loc.coords.latitude]) }, (err) => { reject(err) });
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
        console.log(data);
        const module = await import('../../components/MapWidget.svelte'); 
        mapView = module.default;
        mapView.classList.add("map")
    })

</script>

<style>
    map {
        width: 100vw;
        height: 100%;
        position: absolute;
    }
</style>

<map>
    <svelte:component this={mapView} data={data}/>
</map>