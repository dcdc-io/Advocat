<script>
	import { onMount } from 'svelte';

    let mapView;
    let data = {
        location: [-0.08191999999999999, 51.5473408],
        datapoints: [
            [-0.08191999999999999, 51.5473408],
            [-0.08191999999999999, 51.5573408]
        ]
    }

	onMount(async () => {
        const module = await import('../components/MapWidget.svelte'); 
		mapView = module.default;
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