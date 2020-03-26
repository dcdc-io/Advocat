<script>
    import { onMount } from 'svelte';
    import 'ol/ol.css';
    import { Map, View, Feature } from 'ol';
    import { Heatmap as HeatmapLayer } from 'ol/layer';
    import TileLayer from 'ol/layer/Tile';
    import OSM from 'ol/source/OSM';
    import Point from 'ol/geom/Point';
    import VectorLayer from 'ol/layer/Vector';
    import VectorSource from 'ol/source/Vector';
    import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

    export let data = {}
    // Data format => data = {
    //     location: [-0.08191999999999999, 51.5473408],
    //     dataPoints: [
    //         [-0.08191999999999999, 51.5473408],
    //         [-0.08191999999999999, 51.5573408]
    //     ]
    // }

    let map;
    let viewOptions;

    if(!!data.location) {
        viewOptions = {
            center: data.location,
            zoom: 12,
            projection: 'EPSG:4326'
        }
    } else {
        viewOptions = {
            center: [-1.137255, 52.635874],
            zoom: 7,
            projection: 'EPSG:4326'
        }
    }

    onMount(() => {
        // MAP OBJECT
        map = new Map({
            target: 'mapTarget',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View(viewOptions)
        })

        // DATA
        let features = [];
        if(!!data.dataPoints) {
            data.dataPoints.forEach((coords) => {
                features.push(new Feature({
                    'geometry': new Point(coords)
                }))
            })
        }
        let vectorSource = new VectorSource({
            features: features,
            wrapX: false
        });

        // VISUAL LAYERS (BOTH POINTS AND HEATMAP)
        let vector = new VectorLayer({
            source: vectorSource,
            style: new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({color: "#e9f5f8"}),
                    stroke: new Stroke({color: "#10083f", width: 2})
                })
            })
        });
        var vector2 = new HeatmapLayer({
            source: vectorSource,
            blur: 10,
            radius: 10,
            weight: function(feature) {
                return 5;
            }
        });

        map.addLayer(vector);
        map.addLayer(vector2);
    })
</script>

<!-- <script context="module">
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
</script> -->


<style>
    @media only screen and (max-width: 499px) {
        #mapTarget{
            width: 250px;
            height: 400px;
        }
    }
    @media only screen and (min-width: 500px) and (max-width: 999px) {
        #mapTarget{
            width: 500px;
            height: 650px;
        }
    }
    @media only screen and (min-width: 1000px) {
        #mapTarget{
            width: 600px;
            height: 800px;
        }
    }
</style>

<div id="mapTarget"></div>
