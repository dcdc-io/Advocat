<script>
	import Nav from '../components/Nav.svelte';
	import { setContext, onMount } from 'svelte'
	import { checkLocalUser, colourInvert } from "../helpers.js"

	import { writable } from 'svelte/store'
	const loggedIn = writable(false)
	const username = writable("empty")
	setContext("user", { loggedIn, username })	

	export let segment;

	onMount(() => {
		checkLocalUser({ loggedIn, username })
	})
</script>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 2em;
		box-sizing: border-box;
		flex: 1;
		color: var(--colour-scheme-dark);
	}	
	.footer {
		padding: 1em;
		text-align: center;
		color: black;
		font-weight: 300;
		color: var(--colour-scheme-dark);
		border-top: 0.1px solid var(--colour-scheme-dark);;
	}
	.colour-scheme {
		background: var(--colour-scheme-light);
		color: var(--colour-scheme-dark);	
	}
	.colour-scheme-inverse {
		background: var(--colour-scheme-dark);
		color: var(--colour-scheme-light);	
	}
</style>

<Nav {segment}></Nav>

{#if $colourInvert}
<main >
	<slot></slot>
</main>
{:else}
<main >
	<slot></slot>
</main>
{/if}

<div class="footer">
  <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
</div>
