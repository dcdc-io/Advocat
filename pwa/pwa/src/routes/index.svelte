<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script>
	import { useDatabase } from '../helpers.js'
	let something = 1
	let message = "no message"
	let log = ["foo"]

	let numbers
	const database = async () => {
		numbers = useDatabase({name:"numbers"})
		try {
			message = await numbers.login({username:"admin", password:"password"})
			const posted = numbers.db.post({name: "guy", number: 0})
			try {
				await posted
				let changes = numbers.db.changes({
					since: 'now',
					live: true,
					include_docs: true
					}).on('change', function(change) {
						log = [...log, "a log message"]
						console.log("CHANGE")
					}).on('complete', function(info) {
						console.log("COMPLETE")
					}).on('error', function (err) {
						console.log(err);
				});
			} catch (e) {
				debugger
				console.log(e)
			}
		}
		    catch(e) {
			message = e.toString()
		}
	}
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
	<img alt='Borat' src='great-success.png'>
	<figcaption>HIGH FIVE!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>

<a href="#" on:click={database}>message: {message}</a>
<br>
{#each log as logline}
	<div><span>{logline}</span></div>
{/each}