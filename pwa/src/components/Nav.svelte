<script>
	import { stores } from '@sapper/app';
	import { getContext } from 'svelte';
	import { colourInvert } from '../helpers.js';
	import { Tabs } from '../../node_modules/smelte/src';

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
	.nav-box {
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
</style>
<div class="nav-box">
	<div class="rightmenu">
		{#if $loggedIn}
			<Tabs
				items={[
					{ to: '/account', text: $username },
				]}
				bind:selected={path} />
		{:else}
			<Tabs
				items={loginMenu}
				bind:selected={path} />
		{/if}
	</div>
	<div class="leftmenu">
		<Tabs
			items={navMenu}
			bind:selected={path} />
	</div>
</div>