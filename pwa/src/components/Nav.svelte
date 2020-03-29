<script>
	import { stores } from '@sapper/app';
	import { getContext } from 'svelte';
	import { colourInvert } from '../helpers.js';
	import { Tabs } from '../../node_modules/smelte/src';

	export let segment;

    const { page } = stores();
	let { loggedIn, username } = getContext("user")

	function colourInvertButton() {
		colourInvert.update(n => !n)
	}

	const loginMenu = [
      { to: '/login', text: 'login' },
      { to: '/register', text: 'register' },
	];
	
	const navMenu = [
		{ to: '/', text: 'home'},
		{ to: '/registration_map', text: 'registration map'}
	]


	$: path = $page.path;
</script>

<style>
	nav {
		font-weight: 300;
		padding: 0 1em;
		background-color: var(--colour-scheme-dark);
		color: var(--colour-scheme-light);
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		background-color: var(--colour-scheme-light);
		height: 4px;
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
	.info{
		color: var(--colour-scheme-dark);
	}
	.box {
		background: var(--colour-scheme-dark);
	}
	.rightmenu { 
		width: 150px;
		float: right;
		overflow: auto; 
	}
	.leftmenu { 
		width: 250px;
		float: left;
		overflow: auto; 
		white-space: nowrap;
	}

	/* .button-box {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 100;
		margin: 5px;
		padding: 2px;
		width: 3em;
	} */
</style>
<div class="box">
	<div class="rightmenu">
		<Tabs 
		    items={loginMenu}
	  	    bind:selected={path} />
	</div>
	<div class="leftmenu">
		<Tabs
		    items={navMenu}
	  	    bind:selected={path} />
	</div>
</div>
<nav>
	<ul>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
		<!-- <li><a aria-current='{segment === "about" ? "page" : undefined}' href='about'>about</a></li> -->
		<!-- <li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li> -->
		<!-- <li><a aria-current='{segment === "jobs" ? "page" : undefined}' href='jobs'>jobs</a></li> -->
		<!-- <li><a aria-current='{segment === "advocats" ? "page" : undefined}' href='advocats'>advocats</a></li> -->
		<li><a aria-current='{segment === "registration_map" ? "page" : undefined}' href='registration_map'>registration map</a></li>
		{#if $loggedIn}
       		<li><p class="info">welcome back, {$username}</p></li>
		{:else}
			<li><a aria-current='{segment === "login" ? "page" : undefined}' href='login'>login</a></li>
			<li><a aria-current='{segment === "register" ? "page" : undefined}' href='register'>register</a></li>
      	{/if}
		<!-- TODO: logout -->
	</ul>
	<!-- <div class="button-box">
		{#if $colourInvert}
			<button on:click={colourInvertButton}>Go Light</button>
		{:else}
			<button on:click={colourInvertButton}>Go Dark</button>
		{/if}
	</div> -->
</nav>
