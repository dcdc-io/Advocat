import * as sapper from '@sapper/app';

window.localdb = jobs

remote_jobs.logIn('admin', 'password').then(() => {
	console.log("i am logged in")
	jobs.sync(remote_jobs, {live: true, retry: true}).on('error', console.log.bind(console))
}).catch(() => {
	console.log("i am not logged in")
})

sapper.start({
	target: document.querySelector('#sapper')
});