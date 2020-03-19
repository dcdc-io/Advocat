<script>
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte'

	import { autoLogin, colourInvert } from "../helpers.js"

	import { writable } from 'svelte/store'
	const loggedIn = writable(false)
	const username = writable("empty")
	setContext("user", { loggedIn, username })
	autoLogin()

	export let segment;
</script>

<style>
	main {
		padding: 1.5em;
		box-sizing: border-box;
		flex: 1;
	}	
	.footer {
		padding: 1em;
		text-align: center;
		color: black;
	}
	.colour-scheme {
		background: #f9f9f9;
		color: #808080;	
	}
	.colour-scheme-inverse {
		background: #808080;
		color: #f9f9f9;	
	}
</style>

<Nav {segment}></Nav>

{#if $colourInvert}
<main class="colour-scheme-inverse">
	<slot></slot>
</main>
{:else}
<main class="colour-scheme">
	<slot></slot>
</main>
{/if}

<div class="footer">
  <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
</div>
