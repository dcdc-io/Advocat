<script>
	import "../../node_modules/smelte/src/tailwind.css";
	import Nav from '../components/Nav.svelte';
	import { setContext } from 'svelte'
	import { userSetup } from "../helpers.js"
	import { writable } from 'svelte/store'
	import { stores } from '@sapper/app'
	export let segment;
	let nopad = false;
	
	const { page } = stores()
	const loggedIn = writable(false)
	const username = writable("")
	setContext("user", { loggedIn, username })

	let promise = userSetup({loggedIn, username})

	$: nopad = $page.path.indexOf("/map") >= 0
</script>

<style>
	.nopad {
		margin: 0 !important;
		padding: 0 !important;	
		width: min(90vw, 600px);
		box-sizing: border-box;
		flex: 1;
		color: var(--colour-scheme-dark);
		position: relative;
	}
	main {
		width: min(90vw, 600px);
		margin: 0 auto;
		padding: 2em 0;
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
	.sign-in-error {
		color: red;
	}
</style>

<Nav {segment}></Nav>

<main {nopad}>
	{#await promise}
		Signing In...
	{:then value}	
		<slot></slot>
	{:catch}
		<span class="sign-in-error">Unable to sign in.</span>
		<slot></slot>
	{/await}
</main>
<div class="footer">
  <p><a href="data" class="underline">Data Policy</a> - <a href="about" class="underline">About</a> - <a href="faqs" class="underline">FAQs</a> - <a href="https://blog.advocat.group" class="underline" target="_blank">Developer Blog</a></p>
  <p>advocat. is made with ❤ by <a href="https://dcdc.io" target="_blank">dcdc.io</a>, the worker led digital cooperative</p>
</div>
