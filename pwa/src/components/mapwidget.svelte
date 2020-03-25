<script>
    import { onMount } from 'svelte';
    import 'ol/ol.css';
    import { Map, View } from 'ol';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';

    let map;

    onMount(() => { 
        map = new Map({
            target: 'mapTarget',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],

            view: new View({
                center: [ 54.109511, -2.934694],
                zoom: 7,
            })
        })
    })

    // const createMap = function(viewParams) {
    //     map = new Map({
    //         target: 'mapTarget',
    //         layers: [
    //             new TileLayer({
    //                 source: new OSM()
    //             })
    //         ],

    //         view: new View(viewParams)
    //     })
    //     console.log(map);
    // }
</script>

<script context="module">
    export const createMap = function(viewParams) {
        map = new Map({
            target: 'mapTarget',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],

            view: new View(viewParams)
        })
        console.log(map);
    }
</script>


<style>
    #mapTarget{
        width: 600px;
        height: 600px;
    }
</style>

<div id="mapTarget"></div>
