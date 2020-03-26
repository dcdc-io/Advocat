<script>
	import { onMount } from 'svelte';

    let mapView;
    let data = {
        location: [-0.08191999999999999, 51.5473408],
        dataPoints: [
            [-0.08191999999999999, 51.5473408],
            [-0.08191999999999999, 51.5573408]
        ]
    }

	onMount(async () => {
        const module = await import('../components/MapWidget.svelte'); 
		mapView = module.default;
    });    
</script>
 
<svelte:component this={mapView} data={data}/>