<script>
	import { onMount } from 'svelte';

    let mapView;

	onMount(async () => {
        const module = await import('../components/MapWidget.svelte'); 
		mapView = module.default;
    });    
</script>
 
<svelte:component this={mapView} foo="bar"/>