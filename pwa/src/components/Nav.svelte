<script>
    import { stores } from '@sapper/app';
    import { getContext } from 'svelte';
    import { Tabs } from '../../node_modules/smelte/src';

    const { page } = stores();
    let { loggedIn, username } = getContext("user")
    let accountMenu = [];
    let path;

	const navMenu = [
		{ to: '/#', text: "Home" },
        //{ to: '/map/registrations', text: 'Map' }
        { to: '/map/activity', text: "Map" },
        { to: 'activities', text: "Activities"}
	]

	$: {
        path = $page.path === "/" ? "/#" : $page.path
    }
	$: {
		if ($loggedIn) {
			accountMenu = [
                { to: '/make_activities', text: 'Make Activities'},
                { to: '/claims', text: 'Tech Preview'},
                { to: '/account', text: $username }		
			]
		} else {
			accountMenu = [
                { to: '/login', text: 'Login' }
			]
		}
	}
</script>

<style>
    .nav-box {
        background: var(--colour-scheme-dark);
        display: flex;
    }
    .leftmenu { 
        flex: 1;
        display: flex;
        justify-content: flex-start;
    }
    .spacer {
        flex: 1;
        display: flex;
        justify-content: center;
    }
    .rightmenu { 
        flex: 1;
        display: flex;
        justify-content: flex-end;
    } 
</style>

<div class="nav-box">
    <div class="leftmenu">
        <Tabs
            items={navMenu}
            bind:selected={path} />
    </div>
    <div class="spacer"></div>
    <div class="rightmenu">
        <Tabs
            items={accountMenu}
            bind:selected={path} />
    </div>
</div>