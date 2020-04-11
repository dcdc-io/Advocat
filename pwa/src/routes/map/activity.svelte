<script>
    import VerticalDrawer from "../../components/VerticalDrawer/VerticalDrawer.svelte"
    import { onMount } from 'svelte'
    
    export let examine = false

    let mapView
    let data = {
        location: [-0.08191999999999999, 51.5473408],
        datapoints: [
            [-0.08191999999999999, 51.5473408],
            [-0.08191999999999999, 51.5573408]
        ]
    }

    const interact = ({detail}) => {
        examine = detail.feature.get('data')
    }

	onMount(async () => {
        const module = await import('../../components/MapWidget.svelte'); 
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
    <svelte:component on:interact={interact} this={mapView} data={data}/>
</map>

<VerticalDrawer show={examine} bottom={true}>
    {#if examine}
        <span>I am a thing</span>
    {/if}
</VerticalDrawer>