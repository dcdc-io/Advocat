<svelte:head>
  <script src="instascan.min.js" on:load={instascanLoaded}></script>
</svelte:head>
 
<script>
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	
	export let height;
	export let width;
	export let opts;

	let	cameras = []
	let	currentCamera = undefined
	let	result = undefined
	let	_loadCamera = undefined
	let video;
	let Camera, scanner, instascanReady;


	// const opts = {
	// 	continuous: true,
	// 	video: video,
	// 	mirror: true,
	// 	captureImage: false,
	// 	backgroundScan: true,
	// 	refractoryPeriod: 5000,
	// 	scanPeriod: 1
	// }

	const instascanLoaded = () => {
		instascanReady = true
	}

	const dispatch = createEventDispatcher()

	const init = () => {
		if (!instascanReady) {
			return setTimeout(() => {
				init()
			}, 100);
		}
		// needed for server side rendering
		// TODO check double launching camera
		Camera = new Instascan.Camera;

		Instascan.Camera.getCameras().then(cams => {
			cameras = cams
			_startScanner();
		})
		.catch(error => {
			dispatch('loadCameraFailed');
		});
	}

	const changeCamera = (camera) => {
		if(camera) {
			currentCamera = camera
		} else {
			const index = cameras.indexOf(camera)
			currentCamera = index < cameras.length() - 1 ? cameras[index] : cameras[0];
		}
		scanner.stop().then(() => {
			_startScanner();
		});
	}
	
	const _startScanner = () => {
		// console.log('start scanner');
		// checks if currentCamera exists
		const camera = !!currentCamera ? currentCamera : cameras[0];
		scanner = new Instascan.Scanner({video: video});

		scanner.addListener('scan', (content) => {	
			// console.log(content)
			dispatch('scan', content);
		});

		scanner.addListener('inactive', () => {
			console.log('inactive')
			stop()
		})

		scanner.start(camera).then(() => {
			// console.log('start scanner success');
			dispatch('scannerStarted');
		})
		.catch((error) => {
			// console.log('start scanner failed '+error);
			dispatch('scannerStartFailed', error);
		});
	}

	const scan = () => {
		const scanResult = scanner.scan();
		result = scanResult
	}
	
	const stop = () => {
		scanner.stop().then(() => {
			dispatch('scannerStopped');
		});
	}

	onMount(async () => {
		//const insta = await import('dcdc-instascan')
		// console.log(insta)
		//instascan = insta.default
		init()
	})

</script>

<style>
	.cam {
		height: "250px";
		width: "250px";
		border: "none";
		border-radius: "0px";
		z-index: 5000;
	}
</style>

{#if cameras.length === 0}
	<slot></slot>
{/if}
	<video bind:this={video}
		class="cam"
		defaultMuted
		playsinline
		preload="auto"
	></video>


<!-- credit - https://github.com/Pedroglp/svelte-qr-scanner/blob/master/src/QRScanner.html -->