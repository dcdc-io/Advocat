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

    let map;

    onMount(() => {
        // MAP OBJECT
        map = new Map({
            target: 'mapTarget',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],

            view: new View({
                center: [-0.08191999999999999, 51.5473408],
                zoom: 12,
                projection: 'EPSG:4326'
            })
        })

        // DATA
        let features = [];
        let feat = new Feature({
            'geometry': new Point([-0.08191999999999999, 51.5473408])
        });
        let feat1 = new Feature({
            'geometry': new Point([-0.08191999999999999, 51.5573408])
        });
        features.push(feat);
        features.push(feat1);
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

    // const createMap = function(viewParams) {
    //     map = new Map({
    //         target: 'mapTarget',
    //         layers: [
    //             new TileLayer({
    //                 source: new OSM()
    //             })
    //         ],

    //         view: new View(viewParams)
    //     }) b

    //     console.log(map);
    // }
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
    #mapTarget{
        width: 600px;
        height: 600px;
    }
</style>

<div id="mapTarget"></div>
